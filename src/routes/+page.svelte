<script lang="ts">
	import type { PageData } from './$types';
	import VinylImgMeta from '$lib/assets/img/erik-mclean-QzpgqElvSiA-unsplash.jpg?w=200;400;800&format=avif;webp;jpg&as=picture';
	import Picture from '$lib/components/img/picture.svelte';
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
	{#if !data.loggedIn}
		<div class="mt-3 mb-2"><a href="/login">Login</a> to see protected routes...</div>
	{/if}
	<h1 class="is-size-1 mb-5">Tracks</h1>
	<div class="is-flex">
		<div>
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
		<div class="ml-6 is-flex-shrink-1">
			<Picture meta={VinylImgMeta} alt="Vinyls" sizes="33vw" />
		</div>
	</div>
</div>
