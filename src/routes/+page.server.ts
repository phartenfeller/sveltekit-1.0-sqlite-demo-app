import { getInitialTracks } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (({ locals }) => {
	const tracks = getInitialTracks();
	const { username } = locals;

	return {
		tracks,
		loggedIn: !!username
	};
}) satisfies PageServerLoad;
