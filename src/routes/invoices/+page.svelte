<script lang="ts">
	import type { PageData } from './$types';
	import type { Invoice } from '$lib/server/db/types';
	import {
		createSvelteTable,
		flexRender,
		getCoreRowModel,
		getSortedRowModel,
		type SortDirection
	} from '@tanstack/svelte-table';
	import { writable } from 'svelte/store';
	import type { ColumnDef, TableOptions } from '@tanstack/svelte-table';

	export let data: PageData;

	const numFormat = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });

	function getSortSymbol(isSorted: boolean | SortDirection) {
		return isSorted ? (isSorted === 'asc' ? '🔼' : '🔽') : '';
	}

	const defaultColumns: ColumnDef<Invoice>[] = [
		{
			accessorKey: 'id',
			header: 'ID',
			cell: (info) => info.getValue()
		},
		{
			accessorKey: 'date',
			id: 'Date',
			cell: (info) => new Date(info.getValue() as string).toLocaleString(),
			header: () => 'Date'
		},
		{
			accessorKey: 'country',
			header: 'Country',
			cell: (info) => info.getValue()
		},
		{
			accessorFn: (row) => (row.state ? row.state.toString() : '-'),
			id: 'state',
			header: 'State',
			cell: (info) => info.getValue()
		},
		{
			accessorKey: 'city',
			header: 'City',
			cell: (info) => info.getValue()
		},
		{
			accessorKey: 'address',
			header: 'Address',
			cell: (info) => info.getValue(),
			enableSorting: false
		},
		{
			accessorKey: 'total',
			header: 'Total',
			cell: (info) => numFormat.format(info.getValue() as number)
		}
	];

	const options = writable<TableOptions<Invoice>>({
		data: data.invoices,
		columns: defaultColumns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel()
	});

	const table = createSvelteTable(options);
</script>

<div class="px-4">
	<h1 class="is-size-1">Invoices</h1>

	<table class="table">
		<thead>
			{#each $table.getHeaderGroups() as headerGroup}
				<tr>
					{#each headerGroup.headers as header}
						<th colSpan={header.colSpan}>
							{#if !header.isPlaceholder}
								<button
									class="button is-white"
									class:is-disabled={!header.column.getCanSort()}
									disabled={!header.column.getCanSort()}
									on:click={header.column.getToggleSortingHandler()}
								>
									<svelte:component
										this={flexRender(header.column.columnDef.header, header.getContext())}
									/>
									<span class="pl-1">
										{getSortSymbol(header.column.getIsSorted())}
									</span>
								</button>
							{/if}
						</th>
					{/each}
				</tr>
			{/each}
		</thead>

		<tbody>
			{#each $table.getRowModel().rows as row}
				<tr>
					{#each row.getVisibleCells() as cell}
						<td>
							<svelte:component this={flexRender(cell.column.columnDef.cell, cell.getContext())} />
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
