<script lang="ts">
	import { userConfigStore } from '$lib/stores/userConfig';
	import { translationStore } from '$lib/stores/translations';
	import { onMount } from 'svelte';

	onMount(() => {
		userConfigStore.init();
		translationStore.init();
	});
</script>

<svelte:head>
	<title>Pokémon BattleBrawl</title>
</svelte:head>

<div class="px-4 py-6 sm:px-0"></div>
