import { getInvoices } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (({ locals }) => {
	if (!locals?.roles?.includes('admin')) {
		throw error(404, 'Unauthorized');
	}

	const invoices = getInvoices();

	return {
		invoices
	};
}) satisfies PageServerLoad;
