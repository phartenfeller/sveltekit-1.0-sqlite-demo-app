import genAlbumPdf from '$lib/server/pdf/generateAlbumPdf';
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

	const pdf = await genAlbumPdf(albumId);

	setHeaders({
		'Content-Type': 'application/pdf',
		'Content-Length': pdf.size.toString(),
		'Last-Modified': new Date().toUTCString(),
		'Cache-Control': 'public, max-age=600'
	});

	return new Response(pdf);
}) satisfies RequestHandler;
