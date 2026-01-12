# The Practical Challenge: "The Research Agent" (60 Minutes)

This repository contains a basic FastAPI backend and a React (Next.js) frontend. 

**The Goal:** The agent successfully uses a "web_search" tool, but the implementation is buggy and provides a poor user experience. Your job is to fix the schema issues and upgrade the system to support real-time streaming of "thoughts" and answers.

## 1. Python Backend Task (25 Minutes)

**Scenario:** The agent uses a `web_search` tool. However, it often fails to use it correctly or crashes. Additionally, the user has to wait ~3 seconds staring at a spinner before seeing any text.

**The Tasks:**
1.  **Fix the Bug:** The agent configuration for the `web_search` tool seems to have a definition issue. debug and fix the schema so the LLM correctly parses the "query" argument.
2.  **Streaming Upgrade:** Refactor the endpoint (`backend/main.py` and `backend/agent.py`) to stream the agent's execution. 
    *   The backend should yield events for "thoughts" (e.g. when the tool starts/ends).
    *   It should yield "answer" events as the token stream arrives.

## 2. React Frontend Task (20 Minutes)

**Scenario:** The UI currently just shows a loading spinner until the full text arrives (blocking HTTP request).

**The Tasks:**
1.  **Handle Streaming:** Modify `frontend/app/hooks/useChat.ts` to consume the streamed response instead of awaiting the full text.
2.  **Visual Feedback:** Implement the `ThoughtTrace` component (`frontend/app/components/ThoughtTrace.tsx`).
    *   It should display a status (with a small animation) when the agent is "thinking" or searching.
    *   It should update accordingly when the task is complete.

## 3. Evaluation Criteria (15 Minutes Code Walkthrough)

*   **Error Resilience:** Does the frontend crash if a chunk is malformed?
*   **Context Awareness:** (Bonus/Discussion) How would you persist this conversation? Redis? Postgres?
*   **Streaming Implementation:** Did you correctly handle the HTTP stream?

## Setup

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# Create .env with OPENAI_API_KEY=...
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Good luck!
# coding_int
