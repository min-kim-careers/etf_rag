from fastapi import APIRouter, Body
from pydantic import EmailStr

from api.app.core.schemas.inbound import InboundBase


router = APIRouter("/user")


class NewUser(InboundBase):
    email: EmailStr
    password: str
    name: str


@router.post("/create")
def create_user(new_user: NewUser):
    pass
