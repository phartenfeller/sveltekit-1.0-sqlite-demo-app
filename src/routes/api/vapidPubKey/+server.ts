import { VAPID_PUBLIC_KEY } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET = (() => {
	return json({ data: VAPID_PUBLIC_KEY });
}) satisfies RequestHandler;
