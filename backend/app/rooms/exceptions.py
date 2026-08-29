from app.exceptions.base import NotFoundException, ConflictError

class RoomNotFoundException(NotFoundException):
    def __init__(self, room_code: str):
        super().__init__(detail=f"Room with code '{room_code}' not found.")
        

class InsufficientPlayers(ConflictError):
    def __init__(self):
        super().__init__(detail=f"Not enough players to start the game")
        
class RoomFullError(ConflictError):
    def __init__(self):
        super().__init__("The requested room is already full.")