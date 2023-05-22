import { queryPlaylistTracks, type QueryPlaylistTracksArgs } from '$lib/server/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (({ url }) => {
	const sortCol = url.searchParams.get('sortCol')?.toString();
	const sortDir = url.searchParams.get('sortDir')?.toString();
	console.log('sortCol', sortCol);

	const page = parseInt(url.searchParams.get('page')?.toString() ?? '-1');
	const pageSize = parseInt(url.searchParams.get('pageSize')?.toString() ?? '-1');

	if (!pageSize || !page || page < 1 || pageSize < 1) {
		return json({ error: 'Invalid page or pageSize' }, { status: 400 });
	}

	const search = url.searchParams.get('search')?.toString();

	const colFilters = url.searchParams.get('colFilters')?.toString();

	const args: QueryPlaylistTracksArgs = {
		pagination: { page, pageSize }
	};

	if (sortCol) {
		args.sort = { col: sortCol, dir: sortDir ?? 'asc' };
	}

	if (search) {
		args.search = search;
	}

	if (colFilters) {
		args.colFilters = JSON.parse(colFilters);
	}

	const data = queryPlaylistTracks(args);
	return json(data);
}) satisfies RequestHandler;
