import { getAlbumById, getAlbumTracks, updateAlbumTitle } from '$lib/server/db';
import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (({ params }) => {
	const albumId = parseInt(params.albumId);

	if (!albumId) {
		throw error(404, 'Album not found');
	}

	const album = getAlbumById(albumId);

	if (!album) {
		throw error(404, 'Album not found');
	}

	const tracks = getAlbumTracks(albumId);

	return {
		album,
		tracks
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	updateAlbumTitle: async ({ request }) => {
		const data = await request.formData();

		const albumIdStr = data.get('albumId')?.toString();
		const albumId = albumIdStr ? parseInt(albumIdStr) : null;

		const albumTitle = data.get('albumTitle')?.toString();

		if (!(albumId && albumTitle)) {
			throw error(400, 'AlbumId or AlbumTitle missing');
		}

		updateAlbumTitle(albumId, albumTitle);
	}
};
