from fastapi import APIRouter, status
from app.rooms.schemas import RoomCreateSchema, JoinRoomSchema
from app.rooms.services import create_room, join_room_service
from core.schemas import SuccessResponse
router = APIRouter(
    prefix="/room",
    tags=["room"],
)

@router.post('/create', status_code=status.HTTP_201_CREATED, response_model=SuccessResponse)
async def create_room_endpoint(room_data: RoomCreateSchema):
    """
    Endpoint to create a new room.
    """
    print(f"Received request to create room : {room_data}")
    result = await create_room(room_data)
    return SuccessResponse(message="Room Created", data=result)


@router.post('/join', status_code=status.HTTP_200_OK, response_model=SuccessResponse)
async def join_room(join_room_data: JoinRoomSchema):
    """
    Endpoint to join an existing room.
    """
    res = await join_room_service(join_room_data)
    return SuccessResponse(message="Room Joined", data=res)
