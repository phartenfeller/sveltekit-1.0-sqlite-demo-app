<script lang="ts">
	import { onMount } from 'svelte';
	import type { ActionData } from './$types';

	let username = 'philipp';
	let password = 'philipp';

	export let form: ActionData;
</script>

<div class="container" style="max-width: 55ch;">
	<h1 class="is-size-3 has-text-weight-semibold my-4">Login or Register</h1>
	<form method="post" action="?/login">
		<input
			class="input my-2"
			type="text"
			placeholder="Username"
			name="username"
			value={username}
			required
		/>
		<input
			class="input my-2"
			type="password"
			placeholder="Password"
			name="password"
			value={password}
			required
		/>
		{#if form?.errorMessage}
			<div class="has-text-danger my-2">{form.errorMessage}</div>
		{/if}
		<button class="button is-primary mt-4 is-fullwidth" type="submit" formaction="?/login"
			>Login</button
		>
		<hr />
		<button class="button mt-4 mr-3 is-fullwidth" type="submit" formaction="?/register"
			>Register</button
		>
	</form>
</div>
