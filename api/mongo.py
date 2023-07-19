from os import getenv
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URI = getenv("MONGO_URI")
client = MongoClient(MONGO_URI)

db = client["ImaginAI"]
collection = db["stock_data"]
