import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
    name: "mcp-spykerel04d-test",
    version: "1.0.0",
    description: "Playground mcp test",
});

server.tool(
	"echo", 
	"Echo a message", 
	{ 
		message: z.string().describe("The message to echo")
	},
	async ({ message }) => {
		return {
			content: [
				{
					type: "text",
					text: message
				}
			]
		}
	}
);

const transport = new StdioServerTransport();
await server.connect(transport);
