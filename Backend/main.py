import nest_asyncio
from dotenv import load_dotenv
from fastmcp import Client
import os
from google import genai
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any

nest_asyncio.apply()
load_dotenv()
os.environ["GEMINI_API_KEY"] = os.getenv("GEMINI_API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

messages = []
mcp_client = Client(os.getenv("MCP_BASE_URL"), auth="oauth")
gemini_client = genai.Client()

def extract_function_calls(response) -> List[Dict[str, Any]]:
    """Extract function calls from the automaticFunctionCallingHistory"""
    function_calls = []
    
    if hasattr(response, 'automatic_function_calling_history'):
        for turn in response.automatic_function_calling_history:
            if turn.role == "model":
                for part in turn.parts:
                    if hasattr(part, 'function_call') and part.function_call:
                        function_calls.append({
                            "function_name": part.function_call.name,
                            "parameters": dict(part.function_call.args) if part.function_call.args else {}
                        })
    
    return function_calls

@app.get("/messages")
async def get_messages():
    """Get all conversation messages"""
    # Convert backend format to frontend format
    ui_messages = []
    for msg in messages:
        ui_messages.append({
            "role": msg["role"],
            "content": msg["content"],
            "function_calls": msg.get("function_calls", [])
        })
    
    return {"messages": ui_messages}

@app.get("/query")
async def process_query(q: str = Query(..., description="The query to process")):
    async with mcp_client:
        await mcp_client.ping()
        
        # Store user message properly
        messages.append({"role": "user", "content": q})
        
        response = await gemini_client.aio.models.generate_content(
            model="gemini-2.5-pro",
            config=genai.types.GenerateContentConfig(
                temperature=0.1,
                tools=[mcp_client.session],
                system_instruction=f"""
                You are a helpful corporate assistant with access to Google Workspace tools (Gmail, Calendar, Drive, Contacts, Tasks).
                CONVERSATION HISTORY:
                {messages}

                CORE RESPONSIBILITIES:
                1. Maintain natural conversation flow - REFERENCE previous messages when relevant
                2. PROACTIVELY use available tools to accomplish tasks
                3. If you encounter a NAME and you need their details, use tool "search_contacts" first
                4. If information is missing, ask CLARIFYING questions before taking action
                5. ALWAYS check for required PARAMETERS before calling tools
                6. Use MULTIPLE tools SEQUENTIALLY if necessary to fulfill user requests
                """,
                thinking_config=genai.types.ThinkingConfig(thinking_budget=-1)
            ),
            contents=q,  
        )
        
        # Extract function calls and response text
        function_calls = extract_function_calls(response)
        response_text = response.text
        
        # Store assistant response with metadata
        messages.append({
            "role": "assistant", 
            "content": response_text,
            "function_calls": function_calls
        })
        
        return {
            "response_text": response_text,
            "function_calls": function_calls
        }
    
@app.get("/ping")
async def ping():
    """Ping MCP server to execute the google sign on process"""
    async with mcp_client:
        await mcp_client.ping()

        return {
            "status": "success",
            "message": "Server login confirmed."
        }

@app.post("/reset")
async def reset():
    messages.clear()
    return {"status": "success", "message": "Messages cleared"}

@app.get("/")
async def health_check():
    """Health check endpoint for monitoring services."""
    return {
        "status": "healthy",
        "service": "llm-api",
        "message": "Server is running"
    }

@app.head("/")
async def health_check_head():
    """HEAD method for health checks."""
    return {"status": "ok"}