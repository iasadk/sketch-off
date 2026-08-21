import os
from pymongo import AsyncMongoClient
from core.config import settings

client = AsyncMongoClient(settings.mongo_uri)

db = client['sketch-off']