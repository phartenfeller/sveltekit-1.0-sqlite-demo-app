import { getAlbumTracksSlow } from '$lib/server/db';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async ({ locals, params }) => {
	if (!locals?.roles?.includes('admin')) {
		throw error(401, 'Unauthorized');
	}

	const albumId = parseInt(params.albumId);
	console.log('albumId', albumId);
	if (!albumId) {
		throw error(404, {
			message: 'Album not found'
		});
	}

	const tracks = await getAlbumTracksSlow(albumId);

	return json({ tracks });
}) satisfies RequestHandler;
