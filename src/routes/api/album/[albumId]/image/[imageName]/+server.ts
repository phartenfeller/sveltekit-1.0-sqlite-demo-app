import { getAlbumImage } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async ({ params, setHeaders }) => {
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

	const img = getAlbumImage(albumId, params.imageName);
	if (!img || !img.data) {
		throw error(404, 'Image not found');
	}

	setHeaders({
		'Content-Type': img.mimeType,
		'Content-Length': img.size.toString(),
		'Last-Modified': new Date(img.lastModified).toUTCString(),
		'Cache-Control': 'public, max-age=600'
	});

	return new Response(img.data);
}) satisfies RequestHandler;
