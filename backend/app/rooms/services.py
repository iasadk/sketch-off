from app.rooms.schemas import RoomCreateSchema, JoinRoomSchema
from app.rooms.exceptions import RoomNotFoundException, RoomFullError
from lib.utils import generate_room_code
from db.mongodb import db
async def create_room(room_data: RoomCreateSchema):
    ROOM_CODE = generate_room_code();

    data = {
        "name": room_data.room_name,
        "code": ROOM_CODE,
        "max_players": room_data.max_players,
        "players": [{"uuid": room_data.unique_player_id, "name": room_data.player_name, "score":  0}]
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
    room = await db.rooms.find_one({"code": payload.room_code});
    
    if room is None:
        raise RoomNotFoundException(payload.room_code)
    is_already_in_room = any(
            player["uuid"] == payload.unique_player_id
            for player in room["players"]
        )
    if is_already_in_room:
        return {
        "_id": str(room["_id"]),
        "name": room["name"],
        "code": room["code"],
        "max_players": room["max_players"],
        "players": room["players"]
    }
    
    result = await db.rooms.update_one(
        {
            "_id": room["_id"],
            "$expr": {
                "$lt": [
                    {"$size": "$players"},
                    "$max_players"
                ]
            }
        },
        {
            "$push": {
                "players": {
                    "uuid": payload.unique_player_id,
                    "name": payload.player_name,
                    "score": 0
                }
            }
        }
    )

    if result.modified_count == 0:
        raise RoomFullError()
    
    updatedRoom = await db.rooms.find_one({"code": payload.room_code})
    return {
        "_id": str(updatedRoom["_id"]),
        "name": updatedRoom["name"],
        "code": updatedRoom["code"],
        "max_players": updatedRoom["max_players"],
        "players": updatedRoom["players"]
    }   
    

async def getRoom(room_code: str):
    room = await db.rooms.find_one({"code": room_code})
    if room is None:
        raise RoomNotFoundException(room_code=room_code)
    
    return {
    "_id": str(room["_id"]),
    "name": room["name"],
    "code": room["code"],
    "max_players": room["max_players"],
    "players": room["players"]
    }   
    
async def removePlayerFromRoom(room_code: str, player_unique_id: str):
    result = await db.rooms.update_one({"code": room_code},{
        "$pull":{
            "players": {
                "uuid": player_unique_id
            }
        }
    })
    
    return result
