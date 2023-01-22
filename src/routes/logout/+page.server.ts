import { deleteSession } from '$lib/server/sesstionStore';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

export const load = (({ cookies }) => {
	const sid = cookies.get('sid');
	if (sid) {
		cookies.delete('sid');
		deleteSession(sid);
	}

	throw redirect(303, '/');
}) satisfies PageServerLoad;
