from pydantic import BaseModel, Field

class RoomCreateSchema(BaseModel):
    name: str = Field(..., description="The name of the room to be created")
    max_players: int = Field(default=2, description="The maximum number of players allowed in the room", ge=2,le=10)

class JoinRoomSchema(BaseModel):
    player_name: str = Field(..., description="The name of the player to join the room", min_length=3, max_length=20)
    code: str = Field(..., description="The unique code of the room to join", min_length=6, max_length=6,   pattern="^[A-Z0-9]+$")