<script>
	import { page } from '$app/stores';
</script>

<h1 class="is-size-1 has-text-danger">Ooopsie Whooopsie</h1>
<p>{$page.status}: {$page?.error?.message}</p>
