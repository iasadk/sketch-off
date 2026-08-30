from app.rooms.schemas import RoomCreateSchema, JoinRoomSchema, StartGameSchema
from app.rooms.exceptions import RoomNotFoundException, RoomFullError, InsufficientPlayers, NotAllowedToStartGame
from lib.utils import generate_room_code
from db.mongodb import db
from random import choice
from datetime import datetime, timezone
from core.socket_connection_manager import manager, Message
from pymongo import ReturnDocument
from uuid import uuid4
import asyncio
from random import choice
async def create_room(room_data: RoomCreateSchema):
    ROOM_CODE = generate_room_code();

    data = {
        "name": room_data.room_name,
        "code": ROOM_CODE,
        "game_state": {
           "current_round": 0, 
           "artist_id": None,
           "total_rounds": 3,
           "round_started_at": None,
           "round_duration": None,
           "choose_word_started_at": None,
           "choose_word_duration": None,
           "choosed_word": None,
           "status": "NOT_STARTED" 
        },
        "max_players": room_data.max_players,
        "players": [{"uuid": room_data.unique_player_id, "name": room_data.player_name, "score":  0, "is_owner": True}]
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
                    "score": 0,
                    "is_owner": False
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
    "game_state": room["game_state"],
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
    room = await db.rooms.find_one({"code": room_code})
    if room is None: 
        return
    if len(room["players"]) == 0:
        # Delete the room:
        await deleteRoom(room_code=room_code)
    
    await updateRoomOwner(room_code=room_code)
    return result

async def deleteRoom(room_code: str):
    deletedCount = await db.rooms.delete_one({ "code": room_code })
    return deletedCount.deleted_count > 0

async def updateRoomOwner(room_code: str):
    room = await db.rooms.find_one({"code": room_code})
    
    if not room:
        return
    
    players = room.get("players", [])
    currentOwner = next((player for player in players if player.get("is_owner")), None)
    if currentOwner is not None:
        return
    if len(players):
        players[0]["is_owner"] = True
        
        await db.rooms.update_one({"code": room_code},{
            "$set":{
                "players": players
            }
        })

async def start_game(payload: StartGameSchema):
    room = await db.rooms.find_one({"code": payload.room_code})
    if not room:
        raise RoomNotFoundException(room_code=payload.room_code)
    players = room["players"]
    room_owner = next(
        (player for player in players if player["is_owner"]),
        None
    )
    
    if room_owner and room_owner["uuid"] != payload.unique_player_id:
        raise NotAllowedToStartGame()
    if len(players) < 2:
        raise InsufficientPlayers()
    previous_artist_id = room["game_state"]["artist_id"]
    eligible_players = [
        player for player in players
        if player["uuid"] != previous_artist_id
    ]
    
    if not eligible_players:
            raise InsufficientPlayers()
        
    # select random player
    artist = choice(eligible_players)
    prev_round = room["game_state"]["current_round"]
    words = ["HELLO", "RIVER", "BUN"]
    phase_id = str(uuid4())
    updatedRoom = await updateRoom(
    room_code=payload.room_code,
    payload={
        "game_state.artist_id": artist["uuid"],
        "game_state.status": "CHOOSING_WORD",
        "game_state.phase_id": phase_id,
        "game_state.choosed_word": None,
        "game_state.choose_word_started_at": datetime.now(timezone.utc).isoformat(),
        "game_state.choose_word_duration": 15,
        "game_state.round_started_at": None,
        "game_state.round_duration": None,
        "game_state.current_round": prev_round + 1,
        "game_state.words": words,
    }
)
    
    # Sending Game State to every participant:
    await manager.broadcast_to_room(
    room_code=payload.room_code,
    message=Message(
        type="GAME_STATE",
        content={
            "game_state": updatedRoom["game_state"]["status"],
            "artist_id": updatedRoom["game_state"]["artist_id"],
            "round_duration": updatedRoom["game_state"]["round_duration"],
            "choosed_word": updatedRoom["game_state"]["choosed_word"],
            "round_started_at": (
                updatedRoom["game_state"]["round_started_at"]
                if updatedRoom["game_state"]["round_started_at"]
                else None
            ),
            "choose_word_duration": updatedRoom["game_state"]["choose_word_duration"],
            "choose_word_started_at": (
                updatedRoom["game_state"]["choose_word_started_at"]
                if updatedRoom["game_state"]["choose_word_started_at"]
                else None
            ),
        })
    )
    
    # Sending event to participants except artist to inform we're in choosing word phase
    await manager.selective_broadcast(room_code=payload.room_code, uuid=artist["uuid"], message=Message(
    type="CHAT",
    content={"msg": f'{artist["name"]} is choosing a word', "color": "orange"}), 
    selection_type="EXCLUDE")
    
    # Sending event to artist only to choose words from
    await manager.selective_broadcast(room_code=payload.room_code, uuid=artist["uuid"], message=Message(
    type="SELECT_WORD",
    content={
        "words": words
    }), 
    selection_type="INCLUDE")
    

    # For auto select of word
    asyncio.create_task(
        choose_word_timeout(
            room_code=payload.room_code,
            phase_id=phase_id,
            duration=15,
        )
    )

async def updateRoom(room_code: str, payload: dict):
    return await db.rooms.find_one_and_update(
        {"code": room_code},
        {"$set": payload},
        return_document=ReturnDocument.AFTER
    )

async def updateChooseWord(room_code: str, word: str):
    room = await db.rooms.find_one({"code": room_code})
    if not room:
        raise RoomNotFoundException(room_code=room_code)
    updated_room = await updateRoom(room_code=room_code, payload={
        "game_state.round_started_at": datetime.now(timezone.utc).isoformat(),
        "game_state.round_duration": 120,
        "game_state.choose_word_started_at": None,
        "game_state.choose_word_duration": None,
        "game_state.choosed_word": word,
        "game_state.status": "ROUND_START",
        })
    
    playerInfo = next((player for player in updated_room["players"] if player['uuid'] == updated_room["game_state"]["artist_id"]), None)
    
    await manager.broadcast_to_room(room_code=room_code, message=Message(type="CHAT", content={"msg": f"Round {room["game_state"]["current_round"]} started", "color": "ORANGE"}))
    
    await manager.broadcast_to_room(room_code=room_code, message=Message(type="CHAT", content={"msg": f"{playerInfo["name"]} is drawing on canvas. Type to guess", "color": "GREEN"}))
    
    await manager.broadcast_to_room(room_code=room_code, message=Message(type="GAME_STATE", content={
            "game_state": updated_room["game_state"]["status"],
            "current_round": updated_room["game_state"]["current_round"],
            "total_rounds": updated_room["game_state"]["total_rounds"],
            "artist_id": updated_room["game_state"]["artist_id"],
            "round_duration": updated_room["game_state"]["round_duration"],
            "round_started_at": updated_room["game_state"]["round_started_at"],
            "choose_word_duration": updated_room["game_state"]["choose_word_duration"],
            "choose_word_started_at": updated_room["game_state"]["choose_word_started_at"],
            "choosed_word": updated_room["game_state"]["choosed_word"],
        }))
    
async def choose_word_timeout(room_code: str, phase_id: str, duration: int):
    await asyncio.sleep(duration)
    
    room = await getRoom(room_code)

    if not room:
        return
    
    game_state = room["game_state"]
    
    if game_state["status"] != "CHOOSING_WORD":
        return
    
    if game_state["phase_id"] != phase_id:
        return
    
    await updateChooseWord(
        room_code=room_code,
        word=choice(game_state["words"])
    )
