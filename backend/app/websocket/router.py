from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.websocket.service import handle_chat, handle_join, handle_draw, handle_word_selected, handle_clear_canvas
from core.socket_connection_manager import manager, Message
from app.rooms.services import getRoom, get_player_name, handle_disconnect
import traceback

MESSAGE_HANDLERS = {
    "JOIN": handle_join,
    "DRAW": handle_draw,
    "WORD_SELECTED": handle_word_selected,
    "CHAT": handle_chat,
}

router = APIRouter(prefix='/ws', tags=['websocket'])


@router.websocket("/{room_code}")
async def websocket_endpoint(websocket: WebSocket, room_code: str):
    # 1. ALWAYS accept the handshake first!
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            msg_type = data["type"]

            if msg_type == "CLEAR_CANVAS":
                await handle_clear_canvas(room_code)
            elif msg_type in MESSAGE_HANDLERS:
                await MESSAGE_HANDLERS[msg_type](websocket, room_code, data)
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
        
