<script lang="ts">
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<div class="container">
	<h1 class="is-size-3 has-text-weight-semibold my-4">Login or Register</h1>
	<form method="post">
		<input class="input my-2" type="text" placeholder="Username" name="username" required />
		<input class="input my-2" type="password" placeholder="Password" name="password" required />
		{#if form?.errorMessage}
			<div class="has-text-danger my-2">{form.errorMessage}</div>
		{/if}
		<button class="button mt-4 mr-3" type="submit" formaction="?/register">Register</button>
		<button class="button is-primary mt-4" type="submit" formaction="?/login">Login</button>
	</form>
</div>
