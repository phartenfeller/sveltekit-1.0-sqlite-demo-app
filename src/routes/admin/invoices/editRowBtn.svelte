<script lang="ts">
	import type { Invoice } from '$lib/server/db/types.ts';
	import { rowChanges } from './stores.ts';

	export let row: Invoice;
	let isEdit = false;

	function setEditRow(id: number, val: boolean) {
		isEdit = val;
		rowChanges.update((rowChanges) => {
			const currState = { ...rowChanges };
			if (val === false && id in currState) {
				delete currState[id];
			} else {
				currState[id] = { ...row };
			}

			return currState;
		});
	}
</script>

{#if isEdit}
	<button class="button" on:click={() => setEditRow(row.id, false)}>❌️</button>
{:else}
	<button class="button" on:click={() => setEditRow(row.id, true)}>📝️</button>
{/if}
