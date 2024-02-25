import { addUserDevice, addUserToChannel } from '$lib/server/db/subscriptionDb';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const POST = (async ({ locals, request }) => {
	const username = locals?.username;

	if (!username) {
		console.log('No username passed to addSubscription');
		throw error(401, 'Unauthorized');
	}

	const data = await request.json();

	if (!data.subscription) {
		console.log('No subscription passed to addSubscription', data);
		throw error(400, 'Bad Request');
	}

	addUserDevice(username, data.subscription);
	addUserToChannel(username, 'album-updates');

	return json({ success: true });
}) satisfies RequestHandler;
