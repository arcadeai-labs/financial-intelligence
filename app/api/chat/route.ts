import { createMCPClient } from "@ai-sdk/mcp";
import { anthropic } from "@ai-sdk/anthropic";
import { streamText, stepCountIs, convertToModelMessages } from "ai";
import { SYSTEM_PROMPT } from "@/lib/prompts";

export const maxDuration = 120;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const client = await createMCPClient({
    transport: {
      type: "http",
      url: process.env.ARCADE_GATEWAY_URL!,
      headers: {
        Authorization: `Bearer ${process.env.ARCADE_API_KEY}`,
        "Arcade-User-ID": process.env.ARCADE_USER_ID || "default",
      },
    },
  });

  const tools = await client.tools();

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(15),
    onFinish: async () => {
      await client.close();
    },
    onError: async () => {
      await client.close();
    },
  });

  return result.toUIMessageStreamResponse();
}
