import { createAnthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

import { CLAUDE_API_KEY } from '$env/static/private';
import getTools from '$lib/server/ai/tools';

const anthropic = createAnthropic({ apiKey: CLAUDE_API_KEY });

export async function POST({ request, locals }) {
	const { messages } = await request.json();

	const { username } = locals;

	const result = await streamText({
		model: anthropic('claude-3-haiku-20240307'),
		system: `You are an assistant that helps employees of an online music store to run their business. Please help with inquiries about the store, its customers and music library. You are friendly and helpful.
      
       The user you are talking to is ${username}. His email addres is "this-works@hartenfeller.dev".
      `,
		messages,
		tools: getTools(),
		// max number of sequential LLM calls
		maxSteps: 5
	});

	return result.toDataStreamResponse();
}
