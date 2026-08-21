from typing import Generic, TypeVar, Optional
from pydantic import BaseModel


T = TypeVar("T")

class SuccessResponse(BaseModel, Generic[T]):
    success: bool = True
    data: T
    code: int = 200
    message: str