from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from core.socket_connection_manager import manager, Message
from app.rooms.services import getRoom, removePlayerFromRoom
router = APIRouter(prefix='/ws', tags=['websocket'])


@router.websocket("/{room_code}")
async def websocket_endpoint(websocket: WebSocket, room_code: str):
    # 1. ALWAYS accept the handshake first!
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            print(data)
            if data["type"] == "JOIN":
                unique_user_id = data["content"]["unique_user_id"]
                manager.add_connection(websocket=websocket, room_code=room_code, unique_user_id=unique_user_id)
                roomInfo = await getRoom(room_code=room_code)
                await manager.broadcast_to_room(room_code=room_code, message=Message(type="PLAYERS", content={"players": roomInfo["players"] }))
            elif data["type"] == "DRAW":
                await manager.broadcast_to_room(room_code=room_code, message=Message(type="DRAW", content=data["content"]))
            
    except WebSocketDisconnect as e:
        # disconnecting client:
        player_uuid = await manager.remove_connection(room_code=room_code, websocket=websocket)
        if player_uuid: await removePlayerFromRoom(room_code=room_code, player_unique_id=player_uuid)
        roomInfo = await getRoom(room_code=room_code)
        await manager.broadcast_to_room(room_code=room_code, message=Message(type="PLAYERS", content={"players": roomInfo["players"] }))
        # Code 1000 = Normal disconnect
        print(f"Socket Client disconnected cleanly with code {e.code}")
    except Exception as e:
        # Optional: Catch any other JSON decoding or unexpected errors
        print(f"Error handling websocket: {e}")
        
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
        
