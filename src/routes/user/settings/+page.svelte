<script lang="ts">
	import { onMount } from 'svelte';

	let nottifPermGranted: boolean | null = null;
	let isSubscribed = false;

	onMount(async () => {
		nottifPermGranted = Notification.permission === 'granted';

		if (nottifPermGranted) {
			isSubscribed = await checkSubscriptionStatus();

			if (!isSubscribed) {
				await subscribeUser();
			}
		}
	});

	function requestNotificationPermission() {
		Notification.requestPermission().then((permission) => {
			if (permission === 'granted') {
				new Notification('You are now subscribed to notifications!');
			}
		});
	}

	async function sendSubscriptionToServer(subscription: PushSubscription) {
		try {
			const res = await fetch('/api/addSubscription', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ subscription })
			});
			if (!res.ok)
				throw new Error(`Error saving subscription on server: ${res.statusText} (${res.status})`);
		} catch (error) {
			console.error('Error saving subscription on server:', error);
			unsubscribe();
		}
	}

	async function checkSubscriptionStatus() {
		if ('serviceWorker' in navigator) {
			const registration = await navigator.serviceWorker.ready;
			const subscription = await registration.pushManager.getSubscription();
			console.log('Subscription:', subscription);
			const exists = subscription !== null;
			if (exists) {
				// just to make sure the subscription is saved on the server
				sendSubscriptionToServer(subscription);
			}
			return exists;
		}
		return false;
	}

	async function subscribeUser() {
		if ('serviceWorker' in navigator) {
			try {
				const res = await fetch('/api/vapidPubKey');
				const { data } = await res.json();

				const registration = await navigator.serviceWorker.ready;
				const subscription = await registration.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey: data
				});
				isSubscribed = true;
				console.log('Subscription:', JSON.stringify(subscription));
				sendSubscriptionToServer(subscription);
			} catch (err) {
				console.error('Error subscribing:', err);
			}
		}
	}

	async function unsubscribe() {
		if ('serviceWorker' in navigator) {
			const registration = await navigator.serviceWorker.ready;
			const subscription = await registration.pushManager.getSubscription();
			if (subscription) {
				await subscription.unsubscribe();
				isSubscribed = false;
			}
		}
	}
</script>

<div class="px-4">
	<h1 class="is-size-1">Settings</h1>

	<div class="mt-4">
		<h2 class="is-size-3">Push Notifications</h2>
		<p>Receive notifications when albums are updated.</p>
		<div class="mt-3">
			{#if nottifPermGranted === null}
				<p>Checking permissions...</p>
			{:else if nottifPermGranted === false}
				<button class="button" type="button" on:click={requestNotificationPermission}
					>Enable notifications</button
				>
			{:else}
				<p>
					You have enabled notification permissions. Remove the permission in your browser
					settings...
				</p>
				<p>Subscribed to push notifications: <b>{isSubscribed}</b></p>
				{#if isSubscribed}
					<div>
						<button class="button" type="button" on:click={unsubscribe}>Unsubscribe</button>
					</div>
				{/if}
			{/if}
		</div>
	</div>
</div>
