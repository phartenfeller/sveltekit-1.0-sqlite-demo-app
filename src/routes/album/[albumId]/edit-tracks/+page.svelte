<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { Grid } from 'ag-grid-community';
	import type { GridOptions } from 'ag-grid-community';
	import 'ag-grid-community/styles/ag-grid.css';
	import 'ag-grid-community/styles/ag-theme-alpine.css';

	export let data: PageData;
	const genreArray = data.genres.map((g) => g.genreName);

	let grid: Grid;

	const gridOptions: GridOptions = {
		defaultColDef: {
			sortable: true,
			filter: true,
			flex: 1,
			resizable: true,
			editable: true
		},
		columnDefs: [
			{ field: 'trackId', headerName: 'ID', editable: false },
			{ field: 'trackName', headerName: 'Tracks' },
			{
				field: 'trackMs',
				headerName: 'Duration',
				type: 'numericColumn',
				valueFormatter: (params) => (params?.value ? `${params?.value / 1000}` : '')
			},
			{ field: 'composer', headerName: 'Composer', cellEditor: 'agLargeTextCellEditor' },
			{
				field: 'genre',
				headerName: 'Genre',
				cellEditor: 'agSelectCellEditor',
				cellEditorParams: {
					values: genreArray
				}
			}
		],
		rowData: data.tracks
	};

	onMount(() => {
		const gridEl = document.getElementById('myGrid');
		if (!gridEl) {
			throw new Error('Grid element not found');
		}
		grid = new Grid(gridEl, gridOptions);
	});
</script>

<div class="px-4">
	<h1 class="is-size-1">Tracks for {data.album.albumTitle}</h1>

	<div id="myGrid" style="height: 500px; width: 100%;" class="ag-theme-alpine" />
</div>
