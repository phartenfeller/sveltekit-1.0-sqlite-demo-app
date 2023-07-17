<script lang="ts">
	export let id: number;

	function sendEmail() {
		console.log(id);

		fetch(`/api/invoices/${id}/email`, {
			method: 'POST'
		})
			.then((res) => res.text())
			.then((data) => {
				console.log(data);
			});
	}
</script>

<button class="button" on:click={sendEmail}>📧</button>
