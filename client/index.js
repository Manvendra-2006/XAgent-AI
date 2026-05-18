import { config } from 'dotenv'
import readline from 'readline/promises'
import Groq from 'groq-sdk'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js'
config()

let tools = []  // is line mcp server main jitne tools hain vo sab is array ke andar store honge 

const groq = new Groq({ // yaha hum grok setup kar rhe han
    apiKey: process.env.GROQ_API_KEY
})

const mcpClient = new Client({ // yaha hum mcp client setup kar rhe hain 
    name: 'example-client',
    version: '1.0.0'
})

const chatHistory = [] // is array ke andar chathistory dal rhe hain 

const rl = readline.createInterface({  // ye user se terminal main input/output lene ke liye use kiya jaa rha hain 
    input: process.stdin,
    output: process.stdout
})

mcpClient.connect( // ye mcp client ko mcp server se connect krne ke liye use ho rha hain 
    new SSEClientTransport(
        new URL('http://localhost:3001/sse')
    )
)
.then(async () => {

    console.log('Connected to MCP Server')

   
    const mcpTools = await mcpClient.listTools() // ye pure ke pure mcp tools ko fetch karga 

  
    tools = mcpTools.tools.map(tool => { // jo mcp tools ange unko Grok/Open Ai ke compatible format main convert krenge 

        return {
            name: tool.name,
            description: tool.description,
            parameters: {
                type: tool.inputSchema.type,
                properties: tool.inputSchema.properties,
                required: tool.inputSchema.required
            }
        }
    })

    console.log('Available Tools:', tools)


    chatLoop()

})
.catch(error => {
    console.log('MCP Connection Error:', error)
})

async function chatLoop(toolCall) {

    try {

        // If AI requested tool
        if (toolCall) {

            console.log('Calling Tool:', toolCall.function.name)

            // Store assistant tool call
            chatHistory.push({
                role: 'assistant',
                tool_calls: [toolCall]
            })

            // Execute MCP Tool
            const toolResult = await mcpClient.callTool({
                name: toolCall.function.name,
                arguments: JSON.parse(toolCall.function.arguments)
            })

            // Store tool result
            chatHistory.push({
                role: 'tool',
                tool_call_id: toolCall.id,
                content: toolResult.content[0].text
            })

        }
        else {

            // User input
            const question = await rl.question('You: ')

            // Store user message
            chatHistory.push({
                role: 'user',
                content: question
            })
        }

        // Send request to Groq
        const response = await groq.chat.completions.create({

            model: 'llama-3.3-70b-versatile',

            messages: chatHistory.slice(-10),

            tools: tools.map(tool => ({
                type: 'function',
                function: tool
            })),

            tool_choice: 'auto'
        })

        // Extract tool call
        const functionCall =
            response.choices[0].message.tool_calls?.[0]

        // Extract text response
        const responseText =
            response.choices[0].message.content

        // If AI wants tool
        if (functionCall) {
            return chatLoop(functionCall)
        }

        // Store final AI response
        chatHistory.push({
            role: 'assistant',
            content: responseText
        })

        // Print final answer
        console.log(`AI: ${responseText}`)

        return chatLoop()

    }
    catch (error) {

        console.log('Error:', error.message)

        return chatLoop()
    }
}