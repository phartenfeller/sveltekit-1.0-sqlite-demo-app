import { getAlbumById, getAlbumTracksSlow, getGenres } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

export const load = (async ({ params, locals }) => {
	if (!locals?.roles?.includes('admin')) {
		throw error(404, 'Unauthorized');
	}

	const albumId = parseInt(params.albumId);

	if (!albumId) {
		throw error(404, 'Album not found');
	}

	const album = getAlbumById(albumId);

	if (!album) {
		throw error(404, 'Album not found');
	}

	const tracks = await getAlbumTracksSlow(albumId);
	const genres = getGenres();

	return {
		album,
		tracks,
		genres
	};
}) satisfies PageServerLoad;
