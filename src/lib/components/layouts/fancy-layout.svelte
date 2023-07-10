<script lang="ts">
	import './github-markdown-light.css';
	export let title = 'Change me';
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<main class="markdown-body" style="max-width: 60ch; margin: auto; padding-top: 2.5rem;">
	<h1>{title}</h1>
	<slot />
</main>
