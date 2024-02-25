import { notifUser } from '$lib/server/db/subscriptionDb';
import { error, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	testNotification: async ({ locals }) => {
		const username = locals.username;
		if (!username) {
			throw error(400, 'Not logged in');
		}

		notifUser(username, 'This is a test notification');
	}
};
