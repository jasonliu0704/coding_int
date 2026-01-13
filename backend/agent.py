import os
from google import genai
from google.genai import types
from backend.tools import web_search
import logging

# Configure logging
logger = logging.getLogger(__name__)

def run_agent(message: str) -> str:
    """
    Runs the agent synchronously and returns the final result using google-genai SDK.
    """
    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        logger.error("GOOGLE_API_KEY not found in environment variables.")
        return "Error: GOOGLE_API_KEY not set."

    client = genai.Client(api_key=api_key)
    
    # System instruction for the agent
    system_instruction = "You are a helpful and precise research assistant. You MUST use the web_search tool to answer questions."
    
    try:
        # The new SDK enables automatic tool execution when tools are provided
        response = client.models.generate_content(
            model='gemini-1.5-flash',
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
        
        return response.text
        
    except Exception as e:
        logger.error(f"Error executing agent: {e}")
        return f"An error occurred: {str(e)}"
