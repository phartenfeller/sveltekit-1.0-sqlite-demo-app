<script lang="ts">
	export let question: string;
	export let options: Array<{ text: string; correct: boolean }>;

	let selected = false;
	let selectedOption: { text: string; correct: boolean } | null = null;

	const selectOption = (option: { text: string; correct: boolean }): void => {
		selected = true;
		selectedOption = option;
	};

	function shuffleArray(
		arr: Array<{ text: string; correct: boolean }>
	): Array<{ text: string; correct: boolean }> {
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}

		return arr;
	}

	const shuffled = shuffleArray(options);
</script>

<div class="has-background-light mt-6 mb-6 p-3">
	<p class="mb-0">Question:</p>
	<p class="is-size-3 has-text-weight-bold">{question}</p>
	<div class="is-flex is-justify-content-space-evenly">
		{#each shuffled as option, i (i)}
			<button
				class="button"
				class:is-success={selected && option.correct}
				class:is-danger={selected && !option.correct && selectedOption === option}
				on:click={() => selectOption(option)}
				disabled={selected}
			>
				{option.text}
			</button>
		{/each}
	</div>
</div>

<style>
	.button:disabled {
		opacity: 1;
	}
</style>
