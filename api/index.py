import base64
import io

import torch.nn as nn
from fastapi import FastAPI
from PIL import Image
from pydantic import BaseModel, Field
from torchvision import models, transforms
from annoy import AnnoyIndex

app = FastAPI()

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
                "image": ["asd","asd"],
            }
        }

@app.get("/search/image",response_model=search_image_response_model)
def search_image(request_model:search_image_request_model):
    # get image
    image = Image.open(io.BytesIO(base64.b64decode(request_model.image.encode())))
    # get transform
    input_tensor = transform(image).unsqueeze(0)
    # get embedding
    output_tensor = model(input_tensor)
    return {"message": "Hello World"}