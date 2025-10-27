<script lang="ts">
	import { userConfigStore } from '$lib/stores/userConfig';
	import { translationStore } from '$lib/stores/translations';
	import { locationStore } from '$lib/stores/location';
	import { onMount } from 'svelte';
	import MainMap from '$lib/game/components/main-map/MainMap.svelte';

	onMount(() => {
		userConfigStore.init();
		translationStore.init();
	});

	function handleCityClick(cityName: string) {
		alert(`Clicked on city: ${cityName}`);
	}
</script>

<svelte:head>
	<title>Pokémon BattleBrawl</title>
</svelte:head>

<div class="h-screen w-full">
	{#if $locationStore === 'MainMap'}
		<MainMap
			clickCorgo={() => handleCityClick('Corgo')}
			clickLanzada={() => handleCityClick('Lanzada')}
			clickToja={() => handleCityClick('Toja')}
			clickArdia={() => handleCityClick('Ardia')}
			clickSiradella={() => handleCityClick('Siradella')}
			clickBateria={() => handleCityClick('Bateria')}
			clickPipas={() => handleCityClick('Pipas')}
		/>
	{:else if $locationStore === 'Lobby1'}
		<div class="text-center text-2xl font-bold">Lobby1</div>
	{/if}
</div>
