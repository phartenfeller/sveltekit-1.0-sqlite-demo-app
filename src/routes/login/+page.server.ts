import { checkUserCredentials, createUser } from '$lib/server/db';
import { fail, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	register: async ({ request }) => {
		const data = await request.formData();
		const username = data.get('username')?.toString();
		const password = data.get('password')?.toString();

		if (username && password) {
			createUser(username, password);
		} else {
			return fail(400, { errorMessage: 'Missing username or password' });
		}
	},

	login: async ({ request }) => {
		const data = await request.formData();
		const username = data.get('username')?.toString();
		const password = data.get('password')?.toString();

		if (username && password) {
			const res = await checkUserCredentials(username, password);
			if (!res) {
				return fail(401, { errorMessage: 'Invalid username or password' });
			}
		} else {
			return fail(400, { errorMessage: 'Missing username or password' });
		}
	}
};
