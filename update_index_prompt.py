from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv('MONGO_URI')


# create a file by the name of object_index.json  with {}
#################### Retrieve Documents ########################
from pymongo import MongoClient
import requests

# Establish a connection to your MongoDB instance
client = MongoClient(MONGO_URI)

# Access the desired database and collection
db = client["ImaginAI"]
collection = db["stock_data"]



# Define the query
# query = {"approved": 1,"annoy_index":{"$exists":False}}
query = {}

# Retrive count
doc_count = collection.count_documents(query)

#################### Create Embaddings ########################

import os
import torch
from torchvision import transforms, models
from PIL import Image
import torch.nn as nn
from io import BytesIO
from tqdm import tqdm
from joblib import Parallel, delayed


def download_image(url):
    response = requests.get(url)
    image = Image.open(BytesIO(response.content))
    return image

def perform_inference(document):

    url = document['image_url_list'][0]
    image = download_image(url)

    # Preprocess the image
    transform = transforms.Compose([
        transforms.Resize((224,224)),
        transforms.ToTensor()
    ])

    input_tensor = transform(image)
    input_batch = input_tensor.unsqueeze(0)
    del image

    # Load the pre-trained model
    weights = models.ResNet18_Weights.IMAGENET1K_V1
    model = models.resnet18(weights=weights)

    model.fc = nn.Identity()

    model.eval()

    # Make predictions
    with torch.no_grad():
        output = model(input_batch)

    return document['_id'],output



#################### Map index to objectID ########################

import json

def add_objectid(outputs):
    object_ids = [ obj_id for obj_id,_ in outputs]

    # Specify the file path to save the dictionary
    object_index_path = "object_index_prompt.json"

    with open(object_index_path, "r") as file:
        loaded_dict = json.load(file)

    if loaded_dict.get("last_idx"):
        last_idx = loaded_dict["last_idx"]
    else:
        last_idx = 0

    values = [i for i in range(last_idx+1,last_idx+len(object_ids)+1)]

    # Create the dictionary using map
    dictionary = dict(map(lambda k, v: (k,str(v)), values, object_ids))

    # update
    if loaded_dict.get("data"):
        loaded_dict['data'].update(dictionary)
        loaded_dict['last_idx'] = loaded_dict['last_idx'] + len(object_ids)
    else:
        loaded_dict['data'] = dictionary
        loaded_dict['last_idx'] = len(object_ids)

    unique_values = set(loaded_dict['data'].values())

    if len(unique_values) == len(loaded_dict['data'].values()):
        print("All values in the dictionary are unique.")
    else:
        print("Duplicate values exist in the dictionary.")

    # Save the dictionary to a JSON file
    with open(object_index_path, "w") as file:
        json.dump(loaded_dict, file)

    return last_idx



#################### Map vector to index ########################

import numpy as np
import h5py

def add_vector(outputs,last_idx):
    vector_index_path = "vector_index_prompt.h5"
    vectors_em = [vec for _,vec in outputs]

    with h5py.File(vector_index_path, 'a') as file:
        print("last_index",last_idx)
        for i, tensor in enumerate(vectors_em):
            file.create_dataset(f'tensor_{i+last_idx+1}', data=tensor)


#################### Mark the documents as Indexed ########################

def add_flag(outputs):
    # Define the ObjectIDs of the documents to update
    object_ids = [ obj_id for obj_id,_ in outputs]

    print("ObjectId ",len(object_ids))

    # Define the filter based on ObjectIDs
    filter = {"_id": {"$in": object_ids}}

    # Define the update
    update = {"$set": {"annoy_index": True}}  # Modify with your desired update

    # Update the specific documents
    result = collection.update_many(filter, update)

    # Print the number of documents updated
    print("Number of documents updated:", result.modified_count)

#################### Inference ########################
# print("Doc count", doc_count)
# # number of documents
# n_doc = 15
# # for n_skip in tqdm(range(0,doc_count,10)):
# for n_skip in tqdm(range(0,doc_count,n_doc)):
#     try:
#         documents = list(collection.find(query).skip(n_skip).limit(n_doc))
#         # #################### Create Embaddings ########################
#         outputs = Parallel(n_jobs=n_doc)(delayed(perform_inference)(document) for document in documents)
#         # #################### Map index to objectID ####################
#         last_idx = add_objectid(outputs)
#         # #################### Map vector to index ######################
#         _ = add_vector(outputs,last_idx)
#         # #################### Mark the documents as Indexed #############
#         # _ = add_flag(outputs)
#     except Exception as e:
#         print(e)
#         continue





# #################### Build Annoy Index ########################

# from annoy import AnnoyIndex

# annoy_index_path = "./annoy_index_prompt.ann"
# vector_index_path = "vector_index_prompt.h5"

# n_trees = 10
# dimensions = 512
# metric = 'angular'

# annoy_index = AnnoyIndex(dimensions,metric)

# with h5py.File(vector_index_path, 'r') as file:
#     # Assume 'dataset_name' is the name of the dataset containing the tensor
#     for dataset_name in file.keys():
#         dataset = file[dataset_name]
#         print(dataset_name)
#         # Access the tensor data
#         tensor_data = dataset[()]
#         idx = int(dataset_name.split("_")[-1])
#         print(tensor_data.shape)
#         annoy_index.add_item(idx, tensor_data[0])
#     print(len(list(file.keys())))

# annoy_index.build(n_trees)  # Specify the desired number of trees
# # Save the updated index
# annoy_index.save(annoy_index_path)
# print("Annoy index created")

# #################### Slack Notification ########################

