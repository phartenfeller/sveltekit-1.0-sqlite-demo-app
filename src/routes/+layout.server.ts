import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const { username } = locals;

	return { username };
}) satisfies LayoutServerLoad;
