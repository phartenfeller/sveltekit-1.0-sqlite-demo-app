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
		rowData: data.tracks,
		getRowId: (params) => params.data.trackId
	};

	onMount(() => {
		const gridEl = document.getElementById('myGrid');
		if (!gridEl) {
			throw new Error('Grid element not found');
		}
		grid = new Grid(gridEl, gridOptions);
	});

	function handleAddRow() {
		const rowcount = gridOptions.api?.getDisplayedRowCount();
		if (!rowcount) {
			console.error('Grid API not accessible');
			return;
		}

		let maxId = 0;
		gridOptions.api?.forEachNode((rowNode) => {
			if (rowNode.data.trackId > maxId) maxId = rowNode.data.trackId;
		});

		const newRow = {
			trackId: maxId + 1,
			trackName: '',
			trackMs: undefined,
			composer: '',
			genre: ''
		};

		gridOptions.api?.applyTransaction({
			add: [newRow],
			addIndex: rowcount
		});

		setTimeout(() => {
			const firstCol = gridOptions.columnApi?.getAllDisplayedColumns()[0];
			gridOptions.api?.ensureColumnVisible(firstCol!);
			gridOptions.api?.ensureIndexVisible(rowcount);
			gridOptions.api?.setFocusedCell(rowcount, firstCol!);
		}, 50);
	}
</script>

<div class="px-4">
	<h1 class="is-size-1">Tracks for {data.album.albumTitle}</h1>

	<div class="py-4 columns">
		<div id="myGrid" style="height: 500px;" class="ag-theme-alpine column is-10" />
		<div class="column">
			<button class="button" on:click={handleAddRow}>Add Row</button>
		</div>
	</div>
</div>
