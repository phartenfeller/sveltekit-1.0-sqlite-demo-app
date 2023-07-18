<script lang="ts">
	import type { PlaylistTrack, PlaylistTrackResponse } from '$lib/server/db/types';
	import {
		createSvelteTable,
		flexRender,
		getCoreRowModel,
		type ColumnDef,
		type SortingState,
		type TableOptions
	} from '@tanstack/svelte-table';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	let data: PlaylistTrack[] = [];
	let sorting: SortingState = [];
	let host = '';
	let protocol = '';
	let page = 1;
	let maxPages = 1;
	const pageSize = 25;
	let search = '';
	let filters: Record<string, string> = {};
	const apiPath = '/api/playlistTracks';

	function requestData() {
		if (!host) return;
		let urlPath = host.startsWith('localhost')
			? `${host}${apiPath}`
			: `${protocol}//${host}${apiPath}`;

		const url = new URL(urlPath);

		if (sorting?.length > 0) {
			url.searchParams.set('sortCol', sorting[0].id);
			url.searchParams.set('sortDir', sorting[0].desc ? 'desc' : 'asc');
		}

		url.searchParams.set('page', page.toString());
		url.searchParams.set('pageSize', pageSize.toString());

		if (search) {
			url.searchParams.set('search', search);
		}

		if (Object.keys(filters).length > 0) {
			url.searchParams.set('colFilters', JSON.stringify(filters));
		}

		const dest = url.toString().replace(host, '');
		console.log('dest', dest);
		console.log('host', host);

		fetch(dest)
			.then((res) => res.json())
			.then((res: PlaylistTrackResponse) => {
				data = res.rows;
				maxPages = Math.ceil(res.count / pageSize);
				options.update((o) => ({ ...o, data }));
			});
	}

	const columns: ColumnDef<PlaylistTrack>[] = [
		{
			accessorKey: 'rowId',
			header: '#',
			meta: {
				sort: false
			}
		},
		{
			accessorKey: 'playlistName',
			header: 'Playlist',
			meta: {
				sort: true
			}
		},
		{
			accessorKey: 'trackName',
			header: 'Track',
			meta: {
				sort: true
			}
		},
		{
			accessorKey: 'artistName',
			header: 'Artist',
			meta: {
				sort: true
			}
		},
		{
			accessorKey: 'genre',
			header: 'Genre',
			meta: {
				sort: true
			}
		}
	];

	const setSorting = (updater: any) => {
		if (updater instanceof Function) {
			sorting = updater(sorting);
		} else {
			sorting = updater;
		}
		console.log('sorting', sorting);
		options.update((old) => ({
			...old,
			state: {
				...old.state,
				sorting
			}
		}));

		requestData();
	};

	const setPagination = (newPage: number) => {
		page = newPage;
		requestData();
	};

	let timer: NodeJS.Timeout;

	const setSearch = (newSearch: string) => {
		// depounce input
		clearTimeout(timer);
		timer = setTimeout(async () => {
			page = 1;
			search = newSearch;
			requestData();
		}, 250);
	};

	const setFilter = (col: string, newFilter: string) => {
		page = 1;
		filters[col] = newFilter;
		requestData();
	};

	const options = writable<TableOptions<PlaylistTrack>>({
		data,
		columns,
		state: {
			sorting
		},
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		manualSorting: true
	});

	const table = createSvelteTable(options);

	onMount(() => {
		host = window.location.host;
		protocol = window.location.protocol;
		requestData();
	});
</script>

<div class="px-4">
	<div class="is-flex is-justify-content-space-between is-align-items-center">
		<h1 class="is-size-1">Playlists</h1>
		<div />
	</div>

	<div class="column">
		<div>
			<input
				class="input"
				type="search"
				bind:value={search}
				on:input={() => setSearch(search)}
				placeholder="Search..."
			/>
		</div>
		<table class="table">
			<thead>
				{#each $table.getHeaderGroups() as headerGroup}
					<tr>
						{#each headerGroup.headers as header}
							<th colSpan={header.colSpan}>
								{#if !header.isPlaceholder}
									<button
										class="button is-white is-fullwidth has-text-weight-bold"
										class:is-disabled={!header.column.getCanSort()}
										disabled={!header.column.getCanSort()}
										on:click={header.column.getToggleSortingHandler()}
									>
										<svelte:component
											this={flexRender(header.column.columnDef.header, header.getContext())}
										/>
										<span class="pl-1">
											{{
												asc: ' 🔼',
												desc: ' 🔽'
											}[header.column.getIsSorted().toString()] ?? ''}
										</span>
									</button>

									{#if header.column.columnDef.meta?.sort}
										<input
											class="input is-small"
											type="search"
											bind:value={filters[header.column.id]}
											on:input={() => setFilter(header.column.id, filters[header.column.id])}
											placeholder={`Filter by ${header.column.columnDef.header}...`}
										/>
									{/if}
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

		<div class="pagination">
			<div>
				<button class="button" disabled={page <= 1} on:click={() => setPagination(1)}>{`<<`}</button
				>
				<button class="button" disabled={page <= 1} on:click={() => setPagination(page - 1)}>
					Previous
				</button>
			</div>
			<span>Page {page}</span>
			<div>
				<button class="button" disabled={page >= maxPages} on:click={() => setPagination(page + 1)}>
					Next
				</button>
				<button class="button" disabled={page >= maxPages} on:click={() => setPagination(maxPages)}
					>{`>>`}</button
				>
			</div>
		</div>
	</div>
</div>
