<script lang="ts">
	import type { PageData } from './$types';
	import type { Invoice } from '$lib/server/db/types';
	import {
		createSvelteTable,
		flexRender,
		getCoreRowModel,
		getSortedRowModel,
		getFilteredRowModel,
		getFacetedRowModel,
		getFacetedUniqueValues,
		getFacetedMinMaxValues,
		getPaginationRowModel,
		type SortDirection,
		type FilterFn,
		renderComponent
	} from '@tanstack/svelte-table';
	import { rankItem } from '@tanstack/match-sorter-utils';
	import { writable } from 'svelte/store';
	import type { ColumnDef, TableOptions } from '@tanstack/svelte-table';
	import FacetCheckboxes from '$lib/components/tanstackTable/FacetCheckboxes.svelte';
	import FacetMinMax from '$lib/components/tanstackTable/FacetMinMax.svelte';
	import exportExcel from '$lib/excelExport';
	import InvEmailBtn from './invEmailBtn.svelte';
	import type { InvoiceTableColMeta } from './types';

	export let data: PageData;

	const numFormat = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });

	function getSortSymbol(isSorted: boolean | SortDirection) {
		return isSorted ? (isSorted === 'asc' ? '🔼' : '🔽') : '';
	}

	const globalFilterFn: FilterFn<any> = (row, columnId, value, addMeta) => {
		if (Array.isArray(value)) {
			if (value.length === 0) return true;
			return value.includes(row.getValue(columnId));
		}

		// Rank the item
		const itemRank = rankItem(row.getValue(columnId), value);

		// Store the itemRank info
		addMeta({
			itemRank
		});

		// Return if the item should be filtered in/out
		return itemRank.passed;
	};

	const defaultColumns: ColumnDef<Invoice>[] = [
		{
			accessorKey: 'id',
			header: 'ID',
			cell: (info) => (info.getValue() as number).toString()
		},
		{
			accessorKey: 'date',
			id: 'Date',
			cell: (info) => new Date(info.getValue() as string).toLocaleString(),
			header: 'Date'
		},
		{
			accessorKey: 'country',
			header: 'Country',
			cell: (info) => info.getValue(),
			filterFn: globalFilterFn
		},
		{
			accessorFn: (row) => (row.state ? row.state.toString() : '-'),
			id: 'state',
			header: 'State',
			cell: (info) => info.getValue(),
			filterFn: globalFilterFn
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
		},
		{
			header: 'Mail Receipt',
			cell: (info) => renderComponent(InvEmailBtn, { id: parseInt(info.row.getValue('id')) }),
			meta: {
				noExport: true
			} as InvoiceTableColMeta
		}
	];

	let globalFilter = '';

	const options = writable<TableOptions<Invoice>>({
		data: data.invoices,
		columns: defaultColumns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		globalFilterFn: globalFilterFn,
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getFacetedMinMaxValues: getFacetedMinMaxValues(),
		getPaginationRowModel: getPaginationRowModel(),
		state: {
			globalFilter,
			pagination: {
				pageSize: 7,
				pageIndex: 0
			}
		},
		enableGlobalFilter: true
	});

	const table = createSvelteTable(options);

	function setGlobalFilter(filter: string) {
		globalFilter = filter;
		options.update((old) => {
			return {
				...old,
				state: {
					...old.state,
					globalFilter: filter
				}
			};
		});
	}

	function setCurrentPage(page: number) {
		options.update((old: any) => {
			return {
				...old,
				state: {
					...old.state,
					pagination: {
						...old.state?.pagination,
						pageIndex: page
					}
				}
			};
		});
	}

	function setPageSize(e: Event) {
		const target = e.target as HTMLInputElement;
		options.update((old: any) => {
			return {
				...old,
				state: {
					...old.state,
					pagination: {
						...old.state?.pagination,
						pageSize: parseInt(target.value)
					}
				}
			};
		});
	}

	let timer: NodeJS.Timeout;
	function handleSearch(e: Event) {
		clearTimeout(timer);
		timer = setTimeout(() => {
			const target = e.target as HTMLInputElement;
			setGlobalFilter(target.value);
		}, 300);
	}

	function handleCurrPageInput(e: Event) {
		const target = e.target as HTMLInputElement;
		setCurrentPage(parseInt(target.value) - 1);
	}

	const noTypeCheck = (x: any) => x;

	let headerGroups = $table.getHeaderGroups();

	function clickDownload() {
		exportExcel($table, 'invoices', true);
	}
</script>

<div class="px-4">
	<div class="is-flex is-justify-content-space-between is-align-items-center">
		<h1 class="is-size-1">Invoices</h1>
		<div>
			<button class="button" on:click={clickDownload}>XLSX</button>
		</div>
	</div>

	<div class="columns">
		<div class="column is-one-fifth">
			<h2 class="is-size-3 mb-3">Filters</h2>

			{#each headerGroups as headerGroup}
				{#each headerGroup.headers as header}
					{#if header.column.id === 'country'}
						<details open>
							<summary>
								<h3 class="has-text-weight-semibold is-inline-block">Countries</h3></summary
							>

							<FacetCheckboxes table={$table} column={header.column} />
						</details>
					{:else if header.column.id === 'state'}
						<details open>
							<summary> <h3 class="has-text-weight-semibold is-inline-block">State</h3></summary>

							<FacetCheckboxes table={$table} column={header.column} />
						</details>
					{:else if header.column.id === 'total'}
						<details open>
							<summary> <h3 class="has-text-weight-semibold is-inline-block">Total</h3></summary>

							<FacetMinMax table={$table} column={header.column} />
						</details>
					{/if}
				{/each}
			{/each}
		</div>
		<div class="column">
			<input
				{...noTypeCheck(null)}
				type="search"
				class="input"
				on:keyup={handleSearch}
				on:search={handleSearch}
				placeholder="Search..."
			/>
			<table class="table">
				<thead>
					{#each headerGroups as headerGroup}
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
									<svelte:component
										this={flexRender(cell.column.columnDef.cell, cell.getContext())}
									/>
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
			<div class="is-flex is-align-items-center">
				<button
					class="button is-white"
					on:click={() => setCurrentPage(0)}
					class:is-disabled={!$table.getCanPreviousPage()}
					disabled={!$table.getCanPreviousPage()}
				>
					{'<<'}
				</button>
				<button
					class="button is-white"
					on:click={() => setCurrentPage($table.getState().pagination.pageIndex - 1)}
					class:is-disabled={!$table.getCanPreviousPage()}
					disabled={!$table.getCanPreviousPage()}
				>
					{'<'}
				</button>
				<span> Page </span>
				<input
					type="number"
					value={$table.getState().pagination.pageIndex + 1}
					min={0}
					max={$table.getPageCount() - 1}
					on:change={handleCurrPageInput}
					class="mx-1"
				/>
				<span>
					{' '}of{' '}
					{$table.getPageCount()}
				</span>
				<button
					class="button is-white"
					on:click={() => setCurrentPage($table.getState().pagination.pageIndex + 1)}
					class:is-disabled={!$table.getCanNextPage()}
					disabled={!$table.getCanNextPage()}
				>
					{'>'}
				</button>
				<button
					class="button is-white"
					on:click={() => setCurrentPage($table.getPageCount() - 1)}
					class:is-disabled={!$table.getCanNextPage()}
					disabled={!$table.getCanNextPage()}
				>
					{'>>'}
				</button>
				<span class="mx-2 has-text-weight-semibold">|</span>
				<select
					value={$table.getState().pagination.pageSize}
					on:change={setPageSize}
					class="select"
				>
					{#each [7, 10, 25, 50] as pageSize}
						<option value={pageSize}>
							Show {pageSize}
						</option>
					{/each}
				</select>
				<span class="mx-2 has-text-weight-semibold">|</span>
				<span>{$table.getPrePaginationRowModel().rows.length} total Rows</span>
			</div>
		</div>
	</div>
</div>
