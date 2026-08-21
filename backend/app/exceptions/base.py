from fastapi import status
class AppException(Exception):
    def __init__(self, message: str, status_code: int = 400, code: str = "BAD_REQUEST"):
        self.message = message
        self.status_code = status_code
        self.code = code
        super().__init__(message)
        
class NotFoundException(AppException):
    def __init__(self, detail = None):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, message=detail, code="NOT_FOUND")
        
class ConflictError(AppException):
    def __init__(self, detail: str):
        super().__init__(status_code=status.HTTP_409_CONFLICT, message=detail , code="CONFLICT")

class BadRequestError(AppException):
    def __init__(self, detail: str):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, message=detail, code="BAD_REQUEST")