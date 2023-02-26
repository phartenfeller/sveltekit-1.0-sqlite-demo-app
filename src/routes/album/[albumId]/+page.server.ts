import { getAlbumById, getAlbumTracks, mergeAlbumImage, updateAlbumTitle } from '$lib/server/db';
import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (({ params, locals }) => {
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
		tracks,
		isAdmin: locals?.roles?.includes('admin')
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	updateAlbumTitle: async ({ request, locals }) => {
		if (!locals.username || !locals?.roles?.includes('admin')) {
			throw error(401, {
				message: 'Unauthorized'
			});
		}

		const data = await request.formData();

		const albumIdStr = data.get('albumId')?.toString();
		const albumId = albumIdStr ? parseInt(albumIdStr) : null;

		const albumTitle = data.get('albumTitle')?.toString();

		if (!(albumId && albumTitle)) {
			throw error(400, 'AlbumId or AlbumTitle missing');
		}

		updateAlbumTitle(albumId, albumTitle);
	},
	updateAlbumImage: async ({ request, locals }) => {
		if (!locals.username || !locals?.roles?.includes('admin')) {
			throw error(401, {
				message: 'Unauthorized'
			});
		}

		const data = await request.formData();

		const albumIdStr = data.get('albumId')?.toString();
		const albumId = albumIdStr ? parseInt(albumIdStr) : null;

		if (!albumId) {
			throw error(400, 'AlbumId missing');
		}

		const albumImage = data.get('albumImage')?.valueOf() as File;
		console.log(
			albumId,
			'albumImage',
			albumImage,
			albumImage?.name,
			albumImage?.type,
			albumImage?.size,
			albumImage?.lastModified
		);

		mergeAlbumImage(albumId, albumImage);
	}
};
