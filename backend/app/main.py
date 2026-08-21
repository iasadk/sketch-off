from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.lifespan import lifespan
from app.rooms.router import router as room_router
from app.websocket.router import router as websocket_router
from app.exceptions.handlers import register_exception_handlers
from app.rooms.exceptions import RoomNotFoundException
from core.schemas import SuccessResponse
app = FastAPI(lifespan=lifespan)

# middlewares:
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=['*'], allow_headers=['*'])

# Exception Handler:
register_exception_handlers(app)
# Include domain routers
app.include_router(room_router)
app.include_router(websocket_router)
@app.get("/")
async def health():
    raise RoomNotFoundException("XYZ")
    return SuccessResponse(message="API is Live !!", data=None)


