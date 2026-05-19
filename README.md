# XAGent 🤖

An **MCP-based Autonomous AI Agent** built with Node.js, Groq LLM, and SSE (Server-Sent Events) transport. XAGent uses a custom MCP (Model Context Protocol) client-server architecture to enable dynamic tool calling, recursive reasoning, and external API integrations.

---

## 🧠 What is XAGent?

XAGent is an autonomous agent that thinks, plans, and acts — it can call external tools dynamically, reason recursively over results, and integrate with APIs through a structured MCP pipeline.

> **Note:** The Xdeveloper API integration is currently using **mock/simulated responses** as the paid version is not yet active. The architecture is fully wired and ready to swap in live responses.

---

## ✨ Features

- 🔌 **MCP Client-Server Architecture** — Clean separation between the reasoning layer (client) and tool execution layer (server)
- ⚡ **Groq LLM Integration** — Fast inference using Groq's API for agent reasoning
- 📡 **SSE Transport** — Real-time, streaming communication between client and server via Server-Sent Events
- 🔧 **Dynamic Tool Calling** — Agent discovers and calls tools at runtime based on task requirements
- 🔁 **Recursive Reasoning** — Agent loops over tool results, re-reasons, and takes follow-up actions until the task is complete
- 🌐 **External API Integrations** — Easily extendable with new MCP tools for any external service
- 🧪 **Mock Mode** — Simulated Xdeveloper responses for local development and testing

---

## 📁 Folder Structure

```
XAGent/
├── index.js              # MCP Client — Agent entry point, Groq LLM reasoning loop
├── package.json
├── package-lock.json
├── .gitignore
│
└── server/
    ├── index.js          # MCP Server — SSE transport, tool registry, request handler
    ├── mcp.tool.js       # Tool definitions — all MCP tools (including Xdeveloper mock)
    ├── package.json
    ├── package-lock.json
    └── .gitignore
```

### File Responsibilities

| File | Role |
|------|------|
| `index.js` (root) | MCP Client: initializes Groq LLM, sends prompts, handles tool call responses, drives the recursive reasoning loop |
| `server/index.js` | MCP Server: sets up SSE endpoint, receives tool call requests from client, routes to correct tool |
| `server/mcp.tool.js` | Defines all available MCP tools — their names, descriptions, input schemas, and handler logic (Xdeveloper calls are mocked here) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- A [Groq API Key](https://console.groq.com/)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/Manvendra-2006/XAGent.git
cd XAGent
```

**2. Install client dependencies**
```bash
npm install
```

**3. Install server dependencies**
```bash
cd server
npm install
cd ..
```

**4. Set up environment variables**

Create a `.env` file in the root:
```env
GROQ_API_KEY=your_groq_api_key_here
```

Create a `.env` file in `server/`:
```env
PORT=3001
```

---

## ▶️ Running XAGent

**Start the MCP Server first:**
```bash
cd server
node index.js
```

**Then start the MCP Client (Agent):**
```bash
# In root directory
node index.js
```

The agent will connect to the server via SSE, receive available tools, and begin the autonomous reasoning loop.

---

## 🔄 How It Works

```
User Prompt
    │
    ▼
MCP Client (index.js)
 └─ Sends prompt to Groq LLM
 └─ Groq responds with tool_call or final answer
    │
    ├── If tool_call ──► SSE Request to MCP Server
    │                        └─ server/index.js routes to mcp.tool.js
    │                        └─ Tool executes (mock/live API)
    │                        └─ Result streamed back via SSE
    │
    └── Result fed back into Groq context
         └─ Loop continues until final answer
              │
              ▼
         Final Response to User
```

---

## 🧪 Mock Mode (Xdeveloper)

Since the Xdeveloper paid API is not yet active, all Xdeveloper tool calls return **simulated responses** defined in `server/mcp.tool.js`. The structure mirrors the real API response so swapping in live calls requires only updating the handler logic.

---

## 🗺️ Roadmap

- [ ] Activate live Xdeveloper API integration
- [ ] Add memory/context persistence across sessions
- [ ] Web UI for agent interaction
- [ ] Support multiple concurrent agent sessions
- [ ] Add more MCP tool integrations (search, code execution, etc.)

---

> Built with ❤️ using Node.js · Groq · MCP · SSE
