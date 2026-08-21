from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path
from typing import Literal
class Settings(BaseSettings):
    mongo_uri: str
    environment: Literal["local", "production"] = "local"
    model_config = SettingsConfigDict(env_file=Path(__file__).parent.parent / '.env')
    
settings = Settings()