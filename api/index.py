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

# Health Check API
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

# Search Image API
class search_image_request_model(BaseModel):
    objectid: str = Field(description='ObjectID'),
    limit: int = Field(description='number of images to return',default=24),
    skip: int = Field(description='number of images to skip',default=0)
    class Config:
        schema_extra = {
            'example': {
                "objectid": "641d6e4592e339fcd4169e6a",
                "limit":0,
                "skip":24
            }
        }

class search_image_response_model(BaseModel):
    url_list: list = Field(description='url list of similar images')

    class Config:
        schema_extra = {
            'example': {
                "url_list": ["{asd}","{asd}"],
            }
        }

def SearchImage(collection=None,vector=[],skip=0,limit=24):
    query = [
                {
                        "$search": {
                            "index": "search_image",
                            "knnBeta": {
                            "vector": vector,
                            "path": "content_embedding",
                            "k": 2000
                            }
                        }
                },
                {
                "$skip": skip
                },
                {
                "$limit": limit
                }
            ]
    result = collection.aggregate(query)
    result_list = [doc['image_url_list'][0].split("/")[-1] for doc in result]
    return result_list

@app.post("/api/search/image",response_model=search_image_response_model)
def search_image(request_model:search_image_request_model):
    # get object_id
    object_id = request_model.objectid
    skip = request_model.skip
    limit = request_model.limit
    # get image vector
    vector = collection.find({"_id":ObjectId(object_id)},{"content_embedding"})[0]['content_embedding']
    # get similar images
    documents = SearchImage(collection,vector,skip=skip,limit=limit)
    return {"url_list":documents}

# Get Image (download) API
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
    image_stream = io.BytesIO()
    image.save(image_stream, format='WEBP')
    # Retrieve the image data from the stream
    image_data = image_stream.getvalue()
    # Encode the image data as base64
    image_base64 = base64.b64encode(image_data).decode('utf-8')
    return {"image":image_base64}

# Get Home Images API
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