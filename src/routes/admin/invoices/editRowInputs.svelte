<script lang="ts">
	import type { Invoice } from '$lib/server/db/types';
	import { rowChanges } from './stores';
	import type { TableEditT } from './types';

	export let id: number;
	export let colId: string;
	export let editT: TableEditT;
	export let initVal: any;

	let rInEdit = false;
	let changedRow = <Invoice>{};
	rowChanges.subscribe((r) => {
		if (r[id]) {
			rInEdit = true;
		} else {
			rInEdit = false;
		}

		changedRow = r[id] ?? {};
	});
</script>

{#if rInEdit !== true}
	<span>{initVal}</span>
{:else if editT === 'text'}
	<input type="text" bind:value={changedRow[colId]} />
{:else if editT === 'number'}
	<input type="number" bind:value={changedRow[colId]} />
{:else}
	<span>{initVal}</span>
{/if}
