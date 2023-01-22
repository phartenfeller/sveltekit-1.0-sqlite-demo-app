import { getSession } from '$lib/server/sesstionStore';
import type { Handle } from '@sveltejs/kit';

export const handle = (async ({ event, resolve }) => {
	const { cookies } = event;
	const sid = cookies.get('sid');
	if (sid) {
		const session = getSession(sid);
		if (session) {
			event.locals.username = session.username;
			event.locals.roles = session.roles;
		}
	}

	const response = await resolve(event);
	return response;
}) satisfies Handle;
