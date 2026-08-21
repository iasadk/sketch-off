from contextlib import asynccontextmanager
from fastapi import FastAPI
from db.mongodb import client
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Perform any setup tasks here (e.g., database connection, etc.)
    await client.admin.command('ping')
    print("Connected to MongoDB ✅")
    yield

    await client.close()
    print("Disconnected from MongoDB ❌")
    # Perform any cleanup tasks here (e.g., closing database connection, etc.)