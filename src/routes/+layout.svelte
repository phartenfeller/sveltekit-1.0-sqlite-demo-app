<script lang="ts">
	import type { LayoutServerData } from './$types';

	export let data: LayoutServerData;
</script>

<header>
	<nav class="navbar is-primary px-4" aria-label="main navigation">
		<div class="navbar-brand pr-4">
			<span class="is-size-3 has-text-weight-semibold">SvelteKit + SQLite</span>
		</div>
		<div class="navbar-menu">
			<div class="navbar-start">
				<a href="/" class="navbar-item">Home</a>
				{#if data?.username}
					<a href="/invoices" class="navbar-item">Invoices</a>
					<a href="/playlistTracks" class="navbar-item">Playlists</a>
				{/if}
			</div>
		</div>

		<div class="navbar-end">
			<div class="navbar-item">
				<div class="buttons">
					{#if data?.username}
						<a
							href="/logout"
							class="button is-primary"
							data-sveltekit-preload-data="off"
							data-sveltekit-reload>Hello {data.username}, Log out</a
						>
					{:else}
						<a href="/login" class="button is-primary">Log in</a>
					{/if}
				</div>
			</div>
		</div>
	</nav>
</header>
<slot />
