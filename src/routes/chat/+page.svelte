<script lang="ts">
	import { Chat } from '@ai-sdk/svelte';

	const chat = new Chat({
		api: '/api/chat'
	});
</script>

<div class="container">
	<h1 class="is-size-1 mb-3">Chat with Claude</h1>

	<div class="box chat-box">
		<div class="chat-container">
			{#if chat.messages.length === 0}
				<div class="has-text-centered has-text-grey-light my-6">
					<p>No messages yet. Start a conversation!</p>
				</div>
			{:else}
				{#each chat.messages as message}
					<div class="message-wrapper {message.role === 'user' ? 'user' : 'ai'}">
						<div class="message-bubble">
							<div class="message-sender">
								<strong>{message.role}</strong>
							</div>
							{#each message.parts as part}
								{#if part.type === 'text'}
									<div class="message-content">
										{part.text}
									</div>
								{:else if part.type === 'tool-invocation'}
									<details style="margin-top: 3rem; margin-bottom: 3rem;">
										<summary>Tool Invocation</summary>
										<pre>{JSON.stringify(part.toolInvocation, null, 2)}</pre>
									</details>
									{#if part.toolInvocation.state === 'result'}
										<div class="message-content" style="margin-top: 3rem;">
											{@html part.toolInvocation.result}
										</div>
									{/if}
								{/if}
							{/each}
						</div>
					</div>
				{/each}
			{/if}
		</div>

		<form on:submit={chat.handleSubmit}>
			<div class="chat-input mt-4">
				<div class="field has-addons">
					<div class="control is-expanded">
						<textarea
							class="textarea"
							bind:value={chat.input}
							on:keypress={(e) => {
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault();
									chat.handleSubmit();
								}
							}}
							placeholder="Type your message here..."
							rows="1"
						></textarea>
					</div>
					<div class="control">
						<button class="button is-primary" type="submit" disabled={!chat.input.trim()}>
							<span class="icon"> 📧️ </span>
						</button>
					</div>
				</div>
			</div>
		</form>
	</div>
</div>

<style>
	.chat-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-height: 70vh;
		overflow-y: auto;
		padding: 1rem;
	}

	.message-wrapper {
		display: flex;
	}

	.message-wrapper.user {
		justify-content: flex-end;
	}

	.message-bubble {
		max-width: 80%;
		padding: 0.75rem;
		border-radius: 0.75rem;
	}

	.user .message-bubble {
		background-color: #4a9df6;
		color: white;
		border-bottom-right-radius: 0;

		& .message-sender > strong {
			color: white;
		}
	}

	.ai .message-bubble {
		background-color: #f0f0f0;
		border-bottom-left-radius: 0;
	}

	.message-sender {
		font-size: 0.8rem;
		margin-bottom: 0.3rem;
	}

	.message-content {
		word-wrap: break-word;
	}

	textarea {
		resize: none;
	}
</style>
