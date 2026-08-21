from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from core.socket_connection_manager import manager

router = APIRouter(prefix='/ws', tags=['websocket'])


@router.websocket("/{room_code}")
async def websocket_endpoint(websocket: WebSocket, room_code: str):
    # 1. ALWAYS accept the handshake first!
    await websocket.accept()
    
    await manager.add_connection(websocket=websocket, room_code=room_code)
    
    await manager.broadcast_to_room(room_code=room_code, message={"type": "Announcement", "message": "A new user joined this room"})
    
    try:
        while True:
            data = await websocket.receive_json()
            await manager.broadcast_to_room(room_code=room_code, message=data)
    except WebSocketDisconnect as e:
        # disconnecting client:
        await manager.remove_connection(room_code=room_code, websocket=websocket)
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
        
