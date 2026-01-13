import os
from dotenv import load_dotenv
from google import genai
from google.genai import types
from backend.tools import web_search
import logging
import json

load_dotenv()

# Configure logging
logger = logging.getLogger(__name__)

async def run_agent_stream(message: str):
    """
    Runs the agent with streaming support and yields events.
    Yields:
        - {"type": "thought", "status": "tool_start", "tool": tool_name}
        - {"type": "thought", "status": "tool_end", "tool": tool_name, "result": result}
        - {"type": "answer", "text": token}
    """
    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        logger.error("GOOGLE_API_KEY not found in environment variables.")
        yield {"type": "answer", "text": "Error: GOOGLE_API_KEY not set."}
        return

    client = genai.Client(api_key=api_key)
    
    # System instruction for the agent
    system_instruction = "You are a helpful and precise research assistant. You MUST use the web_search tool to answer questions."
    
    try:
        response = client.models.generate_content_stream(
            model="gemini-2.5-flash",
            contents=message,
            config=types.GenerateContentConfig(
                tools=[web_search],
                system_instruction=system_instruction,
                temperature=0,
                automatic_function_calling=types.AutomaticFunctionCallingConfig(
                    disable=False,
                    maximum_remote_calls=3
                )
            )
        )

        
        # Process the streaming response
        for chunk in response:
            # Handle text content
            if chunk.text:
                for char in chunk.text:
                    yield {"type": "answer", "text": char}
        
    except Exception as e:
        logger.error(f"Error executing agent: {e}")
        error_msg = f"An error occurred: {str(e)}"
        for char in error_msg:
            yield {"type": "answer", "text": char}
