<script lang="ts">
	// @ts-nocheck

	import './github-markdown-light.css';
	import Breadcrumb from './components/breadcrumb.svelte';

	export let title = 'Change me';
	export let breadcrumb = [];
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<Breadcrumb pathChain={breadcrumb} />
<main class="markdown-body" style="max-width: 60ch; margin: auto; padding-top: 2.5rem;">
	<h1>{title}</h1>
	<slot />
</main>
