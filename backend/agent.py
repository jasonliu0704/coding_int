from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from backend.tools import web_search
import os

def get_agent_executor():
    llm = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0)
    
    tools = [web_search]
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a helpful and precise research assistant. You MUST use the web_search tool to answer questions."),
        ("user", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ])
    
    agent = create_tool_calling_agent(llm, tools, prompt)
    
    executor = AgentExecutor(agent=agent, tools=tools, verbose=True)
    return executor

def run_agent(message: str):
    """
    Runs the agent synchronously and returns the final result.
    """
    executor = get_agent_executor()
    
    result = executor.invoke({"input": message})
    return result["output"]
