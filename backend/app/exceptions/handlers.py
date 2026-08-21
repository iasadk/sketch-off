from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from app.exceptions.base import AppException
from core.config import settings
async def app_exception_handler(request: Request, exeception: AppException):
    return JSONResponse(
        status_code=exeception.status_code,
        content={"success": False, "code": exeception.status_code, "message": exeception.message}
    )
    

async def validation_exception_handler(request: Request, exec: RequestValidationError):
    errors = [{"field": err["loc"][-1], "message": err["msg"]} for err in exec.errors()];
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
        content={
            "success": False,
            "code": status.HTTP_422_UNPROCESSABLE_CONTENT,
            "message": "Validation Failed",
            "errors": errors 
        }
    )

async def unhandled_exception_handler(request: Request, exc: Exception):
    message = (
        str(exc)
        if settings.environment == "local"
        else "Something went wrong"
    )
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"success": False, "code": status.HTTP_500_INTERNAL_SERVER_ERROR, "message": message}
    )
    

def register_exception_handlers(app: FastAPI) -> None:
    app.add_exception_handler(AppException, app_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, unhandled_exception_handler)