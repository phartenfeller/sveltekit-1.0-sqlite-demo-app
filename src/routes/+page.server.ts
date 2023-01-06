import { getInitialTracks } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (() => {
	const tracks = getInitialTracks();

	return {
		tracks
	};
}) satisfies PageServerLoad;
