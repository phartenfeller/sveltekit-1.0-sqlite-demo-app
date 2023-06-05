import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { updateInvoice } from '$lib/server/db';
import type { Invoice } from '$lib/server/db/types';

export const POST = (async ({ locals, request }) => {
	if (!locals?.roles?.includes('admin')) {
		throw error(401, 'Unauthorized');
	}

	const data = await request.json();

	// TODO some typechecking here

	try {
		for (const [key, value] of Object.entries(data)) {
			console.log(key, value);
			updateInvoice(value as Invoice);
		}
	} catch (e) {
		return json({ ok: false, error: e }, { status: 500 });
	}

	return json({ ok: true });
}) satisfies RequestHandler;
