from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from core.socket_connection_manager import manager, Message
from app.rooms.services import getRoom, updateChooseWord, checkWord, updateScore, check_all_participants_gussed, round_over,get_player_name, handle_disconnect
import traceback
router = APIRouter(prefix='/ws', tags=['websocket'])


@router.websocket("/{room_code}")
async def websocket_endpoint(websocket: WebSocket, room_code: str):
    # 1. ALWAYS accept the handshake first!
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            if data["type"] == "JOIN":
                unique_user_id = data["content"]["unique_user_id"]
                manager.add_connection(websocket=websocket, room_code=room_code, unique_user_id=unique_user_id)
                roomInfo = await getRoom(room_code=room_code)
                playerInfo = next((player for player in roomInfo["players"] if player["uuid"] == unique_user_id), None)
                await manager.broadcast_to_room(
                    room_code=room_code, 
                    message=Message(
                        type="PLAYERS", 
                        content={"players": roomInfo["players"] 
                    }))
                await manager.broadcast_to_room(
                    room_code=room_code, 
                    message=Message(
                        type="GAME_STATE", 
                        content={
                        "game_state": roomInfo["game_state"]["status"],
                        "current_round": roomInfo["game_state"]["current_round"],
                        "total_rounds": roomInfo["game_state"]["total_rounds"],
                        "artist_id": roomInfo["game_state"]["artist_id"],
                        "round_duration": roomInfo["game_state"]["round_duration"],
                        "round_started_at": roomInfo["game_state"]["round_started_at"],
                        "choose_word_duration": roomInfo["game_state"]["choose_word_duration"],
                        "choose_word_started_at": roomInfo["game_state"]["choose_word_started_at"],
                        "choosed_word": roomInfo["game_state"]["choosed_word"],
                        
                    }))
                await manager.broadcast_to_room(
                    room_code=room_code, 
                    message=Message(
                        type="CHAT", 
                        content={
                            "msg": f"{playerInfo["name"] if playerInfo else "New Player"} Joined",
                            "color": "GREEN"
                    }))
            elif data["type"] == "DRAW":
                roomInfo = await getRoom(room_code=room_code)
                connection_info = manager.get_connection_info(room_code=room_code, websocket=websocket)
                # Only sending to other participants and only artist is allowed to propagate DRAW event to other
                if roomInfo["game_state"]["status"] == "ROUND_START" and connection_info["player_unique_id"] == roomInfo["game_state"]["artist_id"]:
                    await manager.selective_broadcast(room_code=room_code, message=Message(type="DRAW", content=data["content"]), selection_type="EXCLUDE", uuid=roomInfo["game_state"]["artist_id"])
            elif data["type"] == "WORD_SELECTED":
                roomInfo = await getRoom(room_code=room_code)
                connection_info = manager.get_connection_info(room_code=room_code, websocket=websocket)
                if roomInfo["game_state"]["status"] == "CHOOSING_WORD" and connection_info["player_unique_id"] == roomInfo["game_state"]["artist_id"]:
                    await updateChooseWord(room_code=room_code, word=data["content"]["word"])
            elif data["type"] == "CHAT":
                roomInfo = await getRoom(room_code=room_code)
                connection_info = manager.get_connection_info(room_code=room_code, websocket=websocket)
                playerInfo = next((player for player in roomInfo["players"] if player["uuid"] == connection_info["player_unique_id"]), None)
                if roomInfo["game_state"]["artist_id"] == connection_info["player_unique_id"]: 
                    return
                
                content = {"msg":f"{playerInfo["name"]}: {data["content"]["msg"]}", "color": "BLACK"}
                if roomInfo["game_state"]["status"] == "ROUND_START" and not playerInfo["is_guessed"]:
                    # Check if the word is matched or not:
                    isCorrect = await checkWord(room_code=room_code, word=data["content"]["msg"], phase_id=roomInfo["game_state"]["phase_id"])
                    if isCorrect:
                        updatedRoomInfo = await updateScore(room_code=room_code, player_unique_id=connection_info["player_unique_id"])
                        content["msg"] = f"{playerInfo["name"]}: Guessed the word"
                        content["color"] = "GREEN"
                        
                        await manager.broadcast_to_room(
                            room_code=room_code, 
                            message=Message(
                                type="PLAYERS", 
                                content={"players": updatedRoomInfo["players"] 
                            }))
                        if await check_all_participants_gussed(room_code=room_code):
                            await round_over(room_code=room_code)
                    else:
                        content["msg"] = f"{playerInfo["name"]}: {data["content"]["msg"]} (Incorrect Guess)"
                        content["color"] = "RED"
                await manager.broadcast_to_room(
                    room_code=room_code, 
                    message=Message(
                        type="CHAT", 
                        content=content)
                )
            elif data["type"] == "CLEAR_CANVAS":
                await manager.broadcast_to_room(room_code=room_code, message=Message(type="CLEAR_CANVAS", content={"msg": "Canvas cleared"}))
    except WebSocketDisconnect as e:
        # disconnecting client:
        player_uuid = await manager.remove_connection(room_code=room_code, websocket=websocket)
        player_name = await get_player_name(room_code=room_code, player_uuid=player_uuid)
        if player_uuid:
            await handle_disconnect(room_code=room_code, player_uuid=player_uuid)
        roomInfo = await getRoom(room_code=room_code)
        await manager.broadcast_to_room(room_code=room_code, message=Message(type="PLAYERS", content={"players": roomInfo["players"] }))
        if player_name:
            await manager.broadcast_to_room(room_code=room_code, message=Message(type="CHAT", content={"msg": f"{player_name} Left the room", "color": "RED"}))
        # Code 1000 = Normal disconnect
        print(f"Socket Client disconnected cleanly with code {e.code}")
    except Exception as e:
        # Optional: Catch any other JSON decoding or unexpected errors
        print(f"Error handling websocket: {e}")
        traceback.print_exc()
        
@router.websocket("/health")
async def websocket_health(websocket: WebSocket):
    await websocket.accept();
    
    await websocket.send_json({"message": "Welcome to the WebSocket!"})
    
    try:
        while True:
                data = await websocket.receive_json()
                await websocket.send_json({"message": f"You sent: {data}"})
    except WebSocketDisconnect as e:
        # Code 1000 = Normal disconnect
        print(f"Socket Client disconnected cleanly with code {e.code}")
    except Exception as e:
        # Optional: Catch any other JSON decoding or unexpected errors
        print(f"Error handling websocket: {e}")
        
