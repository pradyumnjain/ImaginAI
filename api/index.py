import base64
import io
import json
import os

import requests
import torch.nn as nn
from annoy import AnnoyIndex
from dotenv import load_dotenv
from fastapi import FastAPI
from PIL import Image
from pydantic import BaseModel, Field
from pymongo import MongoClient
from torchvision import models, transforms

app = FastAPI()

# Establish a connection to your MongoDB instance
load_dotenv()

MONGO_URI = os.getenv('MONGO_URI')
client = MongoClient(MONGO_URI)

# Access the desired database and collection
db_new = client["ImaginAI"]
collection_new = db_new["stock_data"]



# Load model
weights = models.ResNet18_Weights.IMAGENET1K_V1
model = models.resnet18(weights=weights)

model.fc = nn.Identity()

model.eval()

# define transform
transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor()
])

# load index
annoy_index = AnnoyIndex(512, 'angular')
annoy_index.load("./annoy_index.ann")

# Load Json
object_index_path = "object_index.json"
with open(object_index_path, "r") as file:
    loaded_dict = json.load(file)

class search_image_request_model(BaseModel):
    image: str = Field(description='input image in base64 format')

    class Config:
        schema_extra = {
            'example': {
                "image": "/9j/4AAQSkZJRgABAQEASABIAAD//gA7Q1JFQVRPUjogZ2QtanBlZy.......",
            }
        }

class search_image_response_model(BaseModel):
    url_list: list = Field(description='url list of similar images')

    class Config:
        schema_extra = {
            'example': {
                "url_list": ["asd","asd"],
            }
        }

@app.post("/search/image",response_model=search_image_response_model)
def search_image(request_model:search_image_request_model):
    # get image
    image = Image.open(io.BytesIO(base64.b64decode(request_model.image.encode())))
    # get transform
    input_tensor = transform(image).unsqueeze(0)
    # get embedding
    output_tensor = model(input_tensor)
    # Get index
    nns = annoy_index.get_nns_by_vector(output_tensor[0],24,search_k=-1, include_distances=False)
    object_strs = [loaded_dict['data'][str(nns[j])] for j in range(len(nns))]

    return {"url_list":[f"{nns}"] }