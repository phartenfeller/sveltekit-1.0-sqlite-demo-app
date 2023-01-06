<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	let timer: NodeJS.Timeout;
	let searchTerm = '';

	function fetchTracks() {
		fetch(`/api/searchTracks?searchTerm=${searchTerm}`)
			.then((res) => res.json())
			.then((data) => {
				tracks = data;
			});
	}

	function handleSearch(e: Event) {
		clearTimeout(timer);
		timer = setTimeout(() => {
			const target = e.target as HTMLInputElement;
			searchTerm = target.value;
			fetchTracks();
		}, 300);
	}

	let tracks = data.tracks;
</script>

<div class="px-4">
	<h1 class="is-size-1 mb-5">Tracks</h1>

	<input
		type="search"
		placeholder="Search..."
		class="input mb-5"
		style="max-width: 80ch;"
		value={searchTerm}
		on:keyup={handleSearch}
	/>

	<table class="table">
		<thead>
			<tr>
				<th>Track</th>
				<th>Artist</th>
				<th>Album</th>
				<th>Genre</th>
			</tr>
		</thead>
		<tbody>
			{#each tracks as track}
				<tr>
					<td>{track.trackName}</td>
					<td>{track.artistName}</td>
					<td><a href={`/album/${track.albumId}`}>{track.albumTitle}</a></td>
					<td>{track.genre}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
