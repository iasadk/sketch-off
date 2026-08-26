from fastapi import WebSocket
from  collections import defaultdict
from pydantic import BaseModel
from app.rooms.services import removePlayerFromRoom
from typing import Any, Literal
class Message(BaseModel):
    type: Literal["DRAW", "JOIN", "PLAYERS"]
    content: dict[str, Any]
class WebsocketConnectionManager:
    def __init__(self):
        self.rooms: dict[str, dict[WebSocket, str]] = defaultdict(dict)
    
    def add_connection(self, room_code: str, unique_user_id: str, websocket: WebSocket):
        self.rooms[room_code][websocket] = unique_user_id
        print(f"Client added in room {room_code} current connections: {len(self.rooms[room_code])}")
    
    async def remove_connection(self, room_code: str, websocket: WebSocket):
        try:
            room = self.rooms.get(room_code)
            if not room:
                return

            player_unique_id = room.get(websocket)
            self.rooms[room_code].pop(websocket)
            print(f"Client: {player_unique_id} removed from room {room_code}")
            await removePlayerFromRoom(room_code=room_code, player_unique_id=player_unique_id)
            if not self.rooms[room_code]:
                del self.rooms[room_code]
        except KeyError as e:
            print("Connection not found in set")
    
    def get_connections(self, room_code: str) -> dict[WebSocket, str]:
        return self.rooms.get(room_code, {})
    
    async def boadcast_to_all(self, message: Message):
        room_clients = [socket for room in self.rooms.values() for socket in room]
        print(f"Sending message to all {len(room_clients)}")
        for i, connection in enumerate(room_clients):
            try:
                await connection.send_json(message)
            except Exception:
                print(f"Failed to send message to connection at pos: {i}")
    
    async def broadcast_to_room(self, room_code: str, message: Message):
        connections = list(self.rooms.get(room_code, {}).keys())
        # loop over connections over a room and send message to all connected users of that room:
        print(f"Sending message to total {len(self.rooms.get(room_code, {}))} clients in a room")
        for i, connection in enumerate(connections):
            try:
                await connection.send_json(message.model_dump())
            except Exception as e:
                print(e)
                print(f"Failed to send message to connection at pos: {i} ${message.model_dump()}")
                
manager = WebsocketConnectionManager()