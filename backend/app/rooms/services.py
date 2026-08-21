from app.rooms.schemas import RoomCreateSchema, JoinRoomSchema
from app.rooms.exceptions import RoomNotFoundException, RoomFullError
from lib.utils import generate_room_code
from db.mongodb import db
async def create_room(room_data: RoomCreateSchema):
    ROOM_CODE = generate_room_code();

    data = {
        "name": room_data.name,
        "code": ROOM_CODE,
        "max_players": room_data.max_players,
        "players": []
    }
    # saving to db:
    await db.rooms.insert_one(data)

    return {
    "_id": str(data["_id"]),
    "name": data["name"],
    "code": data["code"],
    "max_players": data["max_players"],
    "players": data["players"]
}
    
async def join_room_service(payload: JoinRoomSchema):
    # Check if the room exists in db:
    room = await db.rooms.find_one({"code": payload.code});
    
    if room is None:
        raise RoomNotFoundException(payload.code)
    elif len(room["players"]) >= room["max_players"]: # TODO: Need to update this logic to handle concurrency issue and atomicity of the operation. Currently this check is not atomic and can lead to race conditions.
        raise RoomFullError()
    
    # Add the player to the room's players list
    await db.rooms.update_one({ "_id": room["_id"] }, {
        "$push": {
            "players": {
                "name": payload.player_name,
                "score": 0
            }
        }
    })

    return {
        "status": "success",
        "message": f"Player '{payload.player_name}' joined room '{payload.code}'"
    }