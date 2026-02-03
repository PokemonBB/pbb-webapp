<script lang="ts">
	import { locationStore } from '$lib/stores/location';
	import { notificationStore } from '$lib/stores/notifications';
	import { windowControlStore } from '$lib/stores/windowControl';
	import MainMap from '$lib/game/components/main-map/MainMap.svelte';

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
