<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="px-4">
	<h1 class="is-size-1">{data.album.albumTitle}</h1>
	<p class="is-size-4">By {data.album.artistName}</p>

	<table class="table mt-6">
		<thead>
			<tr>
				<th>#</th>
				<th>Track</th>
				<th>Duration</th>
			</tr>
		</thead>
		<tbody>
			{#each data.tracks as track, i}
				<tr>
					<td>{i + 1}</td>
					<td>{track.trackName}</td>
					<td>{Math.floor(track.trackMs / 1000)} s</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<h2 class="is-size-3 mb-4 mt-6">Update Album Name</h2>
	<form method="post">
		<input
			class="input"
			type="text"
			name="albumTitle"
			value={data.album.albumTitle}
			style="max-width: 50ch;"
		/>
		<input type="hidden" name="albumId" value={data.album.albumId} />
		<button class="button is-primary" type="submit" formaction="?/updateAlbumTitle">Update</button>
	</form>
</div>
