<script lang="ts">
	export let title = 'Change me';
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<main>
	<h1 class="is-size-3">{title}</h1>
	<slot />
</main>
