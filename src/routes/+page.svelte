<script lang="ts">
	import { locationStore } from '$lib/stores/location';
	import { notificationStore } from '$lib/stores/notifications';
	import { windowControlStore } from '$lib/stores/windowControl';
	import MainMap from '$lib/game/components/main-map/MainMap.svelte';

	function handleCityClick(cityName: string) {
		alert(`Clicked on city: ${cityName}`);
	}

	function friendRequestNotification() {
		notificationStore.add('Has recibido una solicitud de amistad', 'notification', true, () => {
			windowControlStore.openFriendsWindow('received');
		});
	}

	function testNotification() {
		notificationStore.add('Esta es una notificación', 'notification');
	}

	function testInfoNotification() {
		notificationStore.add('Esta es una notificación de información', 'info');
	}

	function testSuccessNotification() {
		notificationStore.add('¡Operación exitosa!', 'success');
	}

	function testWarningNotification() {
		notificationStore.add('¡Cuidado! Esto es una advertencia', 'warning');
	}

	function testErrorNotification() {
		notificationStore.add('¡Error! Algo salió mal', 'error');
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

	<!-- TEMPORAL BUTTONS -->
	<div style="position: fixed; top: 10px; right: 10px; display: flex; gap: 10px;">
		<button
			style="background-color: #007bff; color: white; padding: 10px 20px; border-radius: 5px;"
			onclick={friendRequestNotification}>Friend Request Notification</button
		>
		<button
			style="background-color: #007bff; color: white; padding: 10px 20px; border-radius: 5px;"
			onclick={testNotification}>Notification</button
		>
		<button
			style="background-color: #007bff; color: white; padding: 10px 20px; border-radius: 5px;"
			onclick={testInfoNotification}>Info</button
		>
		<button
			style="background-color: #007bff; color: white; padding: 10px 20px; border-radius: 5px;"
			onclick={testSuccessNotification}>Success</button
		>
		<button
			style="background-color: #007bff; color: white; padding: 10px 20px; border-radius: 5px;"
			onclick={testWarningNotification}>Warning</button
		>
		<button
			style="background-color: #007bff; color: white; padding: 10px 20px; border-radius: 5px;"
			onclick={testErrorNotification}>Error</button
		>
	</div>
</div>
