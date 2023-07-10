<script lang="ts">
	import type { BreadcrumbItem } from './types';

	export let pathChain: BreadcrumbItem[];
</script>

<nav class="breadcrumb mt-3 ml-3" aria-label="breadcrumbs">
	<ul>
		<li><a href="/about">About</a></li>
		{#each pathChain as { label, href }, i}
			{#if i === pathChain.length - 1}
				<li class="is-active"><a {href} aria-current="page">{label}</a></li>
			{:else}
				<li><a {href}>{label}</a></li>
			{/if}
		{/each}
	</ul>
</nav>
