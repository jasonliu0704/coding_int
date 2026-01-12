from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str

class WebSearchSchema(BaseModel):
    query: str
