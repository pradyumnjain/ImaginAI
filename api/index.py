import base64
import io
import json
import os
from urllib.parse import urljoin

import requests
import torch.nn as nn
from annoy import AnnoyIndex
from bson import ObjectId
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
db = client["ImaginAI"]
collection = db["stock_data"]

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


class health_check_response_model(BaseModel):
    status: str = Field(description='status of the api')

    class Config:
        schema_extra = {
            'example': {
                "status": "ok",
            }
        }

@app.get("/api/health-check",response_model=health_check_response_model)
def health_check():
    return {"status":"ok"}

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

@app.post("/api/search/image",response_model=search_image_response_model)
def search_image(request_model:search_image_request_model):
    # get image
    image = Image.open(io.BytesIO(base64.b64decode(request_model.image.encode())))
    # get transform
    input_tensor = transform(image).unsqueeze(0)
    # get embedding
    output_tensor = model(input_tensor)
    # Get index
    nns = annoy_index.get_nns_by_vector(output_tensor[0],24,search_k=-1, include_distances=False)
    object_strs = [ObjectId(loaded_dict['data'][str(nns[j])]) for j in range(len(nns))]
    documents = list(collection.find({'_id': {"$in":object_strs}}))
    url_list = [doc["image_url_list"][0].split("/")[-1] for doc in documents]
    return {"url_list":url_list}

def download_image(url):
    response = requests.get(url)
    image = Image.open(io.BytesIO(response.content))
    return image

class get_image_request_model(BaseModel):
    name: str = Field(description='input image name')

    class Config:
        schema_extra = {
            'example': {
                "name": "name",
            }
        }

class get_image_response_model(BaseModel):
    image: str = Field(description='image in base64 format')

    class Config:
        schema_extra = {
            'example': {
                "image": "sdsasdjasnakd....",
            }
        }

@app.post("/api/get/image",response_model=get_image_response_model)
def get_image(request_model:get_image_request_model):
    # get name
    name = request_model.name
    # get wassabi uri
    WASSABI_URI = os.getenv('WASSABI_URI')
    # get image
    image = download_image(urljoin(WASSABI_URI, name))
    # get base64
    image_base64 = base64.b64encode(image.tobytes())
    return {"image":image_base64}


class get_home_request_model(BaseModel):
    cursor: int = Field(description='random int seed')

    class Config:
        schema_extra = {
            'example': {
                "cursor": 5,
            }
        }

class get_home_response_model(BaseModel):
    url_list: list = Field(description='url list of similar images')
    next_cursor: int = Field(description='next cursor value')

    class Config:
        schema_extra = {
            'example': {
                "url_list": ["asd","asd"],
                "next_cursor" : 23
            }
        }

@app.post("/api/get/home",response_model=get_home_response_model)
def get_image(request_model:get_home_request_model):
    # get cursor
    cursor = request_model.cursor
    # get documents
    n_skip = cursor
    n_doc = 24
    query = {}
    documents = list(collection.find(query).skip(n_skip).limit(n_doc))
    url_list = [doc["image_url_list"][0].split("/")[-1] for doc in documents]
    next_cursor = cursor + len(url_list)
    return {"url_list":url_list,"next_cursor":next_cursor}