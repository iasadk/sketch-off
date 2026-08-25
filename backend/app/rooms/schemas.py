from pydantic import BaseModel, Field

class RoomCreateSchema(BaseModel):
    room_name: str = Field(..., description="The name of the room to be created")
    player_name: str = Field(..., description="The name of the player is required")
    unique_player_id: str = Field(..., description="A unique player id is required")
    max_players: int = Field(default=2, description="The maximum number of players allowed in the room", ge=2,le=10)

class JoinRoomSchema(BaseModel):
    player_name: str = Field(..., description="The name of the player to join the room", min_length=3, max_length=20)
    unique_player_id: str = Field(..., description="A unique player id is required")
    room_code: str = Field(..., description="The unique code of the room to join", min_length=6, max_length=6,   pattern="^[A-Z0-9]+$")