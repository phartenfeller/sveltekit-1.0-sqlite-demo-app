<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	let uploadedImage: string;

	function handleImageUpload(e: Event) {
		const image = (e.target as HTMLInputElement)?.files?.[0];
		if (!image) return;
		uploadedImage = URL.createObjectURL(image);
	}
</script>

<div class="px-4">
	<div class="columns">
		<div class="column is-three-quarters">
			<h1 class="is-size-1">{data.album.albumTitle}</h1>
			<p class="is-size-4">By {data.album.artistName}</p>
			<a
				href="/api/album/{data.album.albumId}/pdf/{data.album.albumTitle
					.toLowerCase()
					.replaceAll(' ', '-')}.pdf"
				class="button">Download Sheet</a
			>

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
		</div>
		<div class="column">
			{#if data.album.imgName}
				<img
					src={`/api/album/${data.album.albumId}/image/${data.album.imgName}`}
					alt=""
					class="mt-4 image"
					style="max-width: 250px;"
				/>
			{/if}
		</div>
	</div>

	{#if data.isAdmin}
		<a href={`/album/${data.album.albumId}/edit-tracks`} class="button is-primary">Edit Tracks</a>

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
			<button class="button is-primary" type="submit" formaction="?/updateAlbumTitle">Update</button
			>
		</form>

		<h2 class="is-size-3 mb-4 mt-6">Update Album Image</h2>
		<form method="post" enctype="multipart/form-data">
			<input type="hidden" name="albumId" value={data.album.albumId} />
			<input type="file" name="albumImage" accept="image/*" on:change={handleImageUpload} />

			{#if uploadedImage}
				<div class="mt-4">
					<img src={uploadedImage} style="max-width: 50ch;" alt="" />
				</div>
			{/if}

			<div class="mt-4 mb-6">
				<button
					class="button is-primary is-disabled"
					type="submit"
					formaction="?/updateAlbumImage"
					disabled={!uploadedImage ?? null}
					>Upload Image
				</button>
			</div>
		</form>
	{/if}
</div>
