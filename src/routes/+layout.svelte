<script lang="ts">
	import { page } from '$app/stores';
	import type { LayoutServerData } from './$types';
	import { onNavigate } from '$app/navigation';

	onNavigate((navigation) => {
		if (!(document as any).startViewTransition) return;

		return new Promise((resolve) => {
			(document as any).startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	export let data: LayoutServerData;
</script>

<header>
	<nav class="navbar is-primary px-4" aria-label="main navigation">
		<div class="navbar-brand pr-4">
			<span class="is-size-3 has-text-weight-semibold">SvelteKit + SQLite</span>
		</div>
		<div class="navbar-menu">
			<div class="navbar-start">
				<a
					aria-current={$page.url.pathname === '/' ? 'page' : undefined}
					href="/"
					class="navbar-item">Home</a
				>
				{#if data?.username}
					<div
						aria-current={$page.url.pathname.startsWith('/admin') ? 'page' : undefined}
						class="navbar-item has-dropdown is-hoverable"
					>
						<span class="navbar-link"> Admin </span>

						<div class="navbar-dropdown">
							<a href="/admin/invoices" class="navbar-item">Invoices</a>
							<a href="/admin/playlistTracks" class="navbar-item">Playlists</a>
							<a href="/admin/charts_css" class="navbar-item">Charts.css</a>
						</div>
					</div>
				{/if}

				<a
					aria-current={$page.url.pathname === '/about' ? 'page' : undefined}
					href="/about"
					class="navbar-item">About</a
				>
			</div>
		</div>

		<div class="navbar-end">
			{#if data?.username}
				<div
					aria-current={$page.url.pathname.startsWith('/user') ? 'page' : undefined}
					class="navbar-item has-dropdown is-hoverable"
				>
					<span class="navbar-link"> {data.username} </span>

					<div class="navbar-dropdown">
						<a href="/user/settings" class="navbar-item">Settings</a>
						<a
							href="/logout"
							class="navbar-item"
							data-sveltekit-preload-data="off"
							data-sveltekit-reload>Log out</a
						>
					</div>
				</div>
			{/if}
			<div class="navbar-item">
				<div class="buttons">
					{#if !data?.username}
						<a href="/login" class="button is-primary">Log in</a>
					{/if}
				</div>
			</div>
		</div>
	</nav>
</header>
<slot />

<style>
	.navbar-item {
		display: flex;
		align-items: center;
	}

	.navbar-item[aria-current='page']::before {
		content: '●';
		font-size: 0.7rem;
		color: #46fde1;
		padding-right: 2px;
		view-transition-name: active-page;
	}
</style>
