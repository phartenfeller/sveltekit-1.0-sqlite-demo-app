self.addEventListener('fetch', function () {
	return;
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
self.addEventListener('push', function (event: any) {
	const payload = event.data?.text() ?? 'no payload';
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const registration = (self as any).registration as ServiceWorkerRegistration;
	event.waitUntil(
		registration.showNotification('SvelteKit Music Store', {
			body: payload
		})
	);
} as EventListener);
