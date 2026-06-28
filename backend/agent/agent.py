from langchain_groq import ChatGroq
from langgraph.prebuilt import create_react_agent
from .tools import tools
import os
from langchain_core.messages import SystemMessage

SYSTEM_PROMPT = """You are AgentKit, a helpful AI assistant that can search the web, look up Wikipedia articles, and perform calculations.

When answering questions:
1. Break down complex questions into steps
2. Use the available tools to gather information
3. Show your reasoning process clearly
4. Provide accurate, well-structured answers

Always be concise but thorough. If a question requires multiple tools, use them in sequence to build your answer."""


def get_llm():
    return ChatGroq(
        model="qwen/qwen3-32b",
        temperature=0,
        api_key=os.getenv("GROQ_API_KEY"),
    )


def run_agent(user_input: str):
    llm = get_llm()
    agent_executor = create_react_agent(llm, tools)

    result = agent_executor.stream(
        {
            "messages": [
                SystemMessage(content=SYSTEM_PROMPT),
                ("user", user_input),
            ]
        },
        stream_mode="values",
    )

    steps = []
    final_answer = ""

    for chunk in result:
        messages = chunk.get("messages", [])
        if not messages:
            continue
        msg = messages[-1]

        if hasattr(msg, "tool_calls") and msg.tool_calls:
            for tc in msg.tool_calls:
                steps.append(
                    {
                        "type": "tool_use",
                        "tool": tc["name"],
                        "input": tc["args"],
                    }
                )
        elif hasattr(msg, "type") and msg.type == "tool":
            steps.append(
                {
                    "type": "tool_result",
                    "tool": msg.name,
                    "output": msg.content[:500] if msg.content else "",
                }
            )
        elif hasattr(msg, "content") and msg.content and msg.type == "ai":
            final_answer = msg.content

    return {"steps": steps, "answer": final_answer}
