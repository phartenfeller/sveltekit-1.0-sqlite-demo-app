<script lang="ts">
	import type { PageData } from './$types';

	import 'charts.css';

	export let data: PageData;

	function getMax(arr: any[], accessor: string) {
		return Math.max(...arr.map((a) => a[accessor] as number));
	}

	const genreSalesMax = getMax(data.chartData.genreSales, 'salesTotal');
	let customerCountMax = getMax(data.chartData.customerCount, 'customerCount');
	let trackCountMax = getMax(data.chartData.tracksByMediaType, 'trackCount');
	let salesPerMonthMax = getMax(data.chartData.salesTotalByMonth, 'salesTotal');
</script>

<div class="px-4">
	<div class="is-flex is-justify-content-space-between is-align-items-center">
		<h1 class="is-size-1">Charts.css</h1>
	</div>
</div>

<div class="mx-4">
	<div>
		<table
			class="charts-css bar show-heading show-labels data-spacing-5"
			style="--labels-size: 150px"
		>
			<caption>Sales Total by Genre</caption>
			<thead>
				<th scope="col">Genre</th>
				<th scope="col">Sales Total</th>
			</thead>
			<tbody>
				{#each data.chartData.genreSales as g}
					<tr>
						<th scope="row">{g.genre}</th>
						<td style="--size: calc({g.salesTotal} / {genreSalesMax});">
							<span class="data">${g.salesTotal}</span>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="mt-6">
		<table class="charts-css column show-heading show-labels data-spacing-5" style="height: 200px">
			<caption>Customer count By Country</caption>
			<thead>
				<th scope="col">Country</th>
				<th scope="col">Customer Count</th>
			</thead>
			<tbody>
				{#each data.chartData.customerCount as c}
					<tr>
						<th scope="row">{c.country}</th>
						<td style="--size: calc({c.customerCount} / {customerCountMax});">
							<span class="data">{c.customerCount}</span>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="mt-6">
		<table class="charts-css area show-heading show-labels" style="height: 200px">
			<caption>Sales Total by Month</caption>
			<thead>
				<th scope="col">Country</th>
				<th scope="col">Customer Count</th>
			</thead>
			<tbody>
				{#each data.chartData.salesTotalByMonth as m, i}
					<tr>
						<th scope="row">{m.month}</th>
						<td
							style="--start: calc({data.chartData.salesTotalByMonth[i - 1]?.salesTotal ??
								0} / {salesPerMonthMax}); --size: calc({m.salesTotal} / {salesPerMonthMax});"
						>
							<span class="data">{m.salesTotal}</span>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
