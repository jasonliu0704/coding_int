import time
from langchain.tools import tool

@tool
def web_search(query: str) -> str:
    """Performs a web search to find information on the internet.
    Use this tool when you need to verify facts or find up-to-date information.
    """
    # Simulate a search delay to make the "waiting" painful in the UI
    time.sleep(3.0) 
    
    return f"Search Results for '{query}':\n1. The Research Agent is a coding challenge designed to test full-stack AI skills.\n2. LangChain and FastAPI are popular tools for building AI backends.\n3. Next.js is a React framework for production."
