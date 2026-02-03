<script lang="ts">
	import { onMount } from 'svelte';

	let healthData = {
		status: 'ok',
		timestamp: ''
	};

	onMount(() => {
		healthData.timestamp = new Date().toISOString();
	});
</script>

<svelte:head>
	<title>Health Check</title>
</svelte:head>

{JSON.stringify(healthData, null, 2)}
