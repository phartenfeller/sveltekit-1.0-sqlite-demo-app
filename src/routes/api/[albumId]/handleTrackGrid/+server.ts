import { saveGridTracks } from '$lib/server/db';
import type { TracksGridSaveData } from '$lib/server/db/types';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST = (async ({ locals, request, params }) => {
	if (!locals?.roles?.includes('admin')) {
		throw error(401, 'Unauthorized');
	}

	if (!params.albumId) {
		throw error(404, {
			message: 'Album not found'
		});
	}

	const albumId = parseInt(params.albumId);
	console.log('albumId', albumId);
	if (!albumId) {
		throw error(404, {
			message: 'Album not found'
		});
	}

	const data = await request.json();
	data.albumId = albumId;

	try {
		saveGridTracks(data as TracksGridSaveData);

		return json({ success: true });
	} catch (e) {
		console.log('error saving grid tracks', e);
		throw error(500, 'Error saving grid tracks');
	}
}) satisfies RequestHandler;
