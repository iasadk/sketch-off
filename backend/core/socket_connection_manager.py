from fastapi import WebSocket
from  collections import defaultdict
from pydantic import BaseModel

class Message(BaseModel):
    type: str
    content: str
class WebsocketConnectionManager:
    def __init__(self):
        self.rooms: dict[str, set[WebSocket]] = defaultdict(set)
    
    async def add_connection(self, room_code: str, websocket: WebSocket):
        self.rooms[room_code].add(websocket)
        print(f"Client added in room {room_code} current connections: {len(self.rooms[room_code])}")
    
    async def remove_connection(self, room_code: str, websocket: WebSocket):
        try:
            self.rooms[room_code].remove(websocket)
            print(f"Client removed from room {room_code}")
            
            if not self.rooms[room_code]:
                del self.rooms[room_code]
        except KeyError as e:
            print("Connection not found in set")
    
    async def get_connections(self, room_code: str) -> list[WebSocket]:
        return list(self.rooms[room_code])
    
    async def boadcast_to_all(self, message: Message):
        room_clients = [socket for socket_list in self.rooms.values() for socket in socket_list]
        print(f"Sending message to all {len(room_clients)}")
        for i, connection in enumerate(room_clients):
            try:
                await connection.send_json(message)
            except Exception:
                print(f"Failed to send message to connection at pos: {i}")
    
    async def broadcast_to_room(self, room_code: str, message: Message):
        # loop over connections over a room and send message to all connected users of that room:
        print(f"Sending message to total {len(self.rooms.get(room_code, []))} clients in a room")
        for i, connection in enumerate(list(self.rooms.get(room_code, []))):
            try:
                await connection.send_json(message)
            except Exception:
                print(f"Failed to send message to connection at pos: {i}")
                
manager = WebsocketConnectionManager()