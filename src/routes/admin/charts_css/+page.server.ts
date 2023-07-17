import { getChartsData } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (() => {
	const chartData = getChartsData();

	return {
		chartData
	};
}) satisfies PageServerLoad;
