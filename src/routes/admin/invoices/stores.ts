import type { Invoice } from '$lib/server/db/types';
import { writable } from 'svelte/store';

export const rowChanges = writable<{ [key: number]: Invoice }>({});

export function resetTableChanges() {
	rowChanges.set({});
}
