<script lang="ts">
	import { onMount } from 'svelte';

	let nottifPermGranted: boolean | null = null;

	onMount(() => {
		nottifPermGranted = Notification.permission === 'granted';
	});

	function requestNotificationPermission() {
		Notification.requestPermission().then((permission) => {
			if (permission === 'granted') {
				new Notification('You are now subscribed to notifications!');
			}
		});
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
			{/if}
		</div>
	</div>
</div>
