<script lang="ts">
	import { notificationStore } from '$lib/stores/notifications';
	import Notification from './Notification.svelte';
	import { globalZIndex } from '$lib/components/window/zindex';
</script>

<div class="notifications-container" style="z-index: {$globalZIndex + 1000};">
	{#each $notificationStore.notifications as notification (notification.id)}
		<Notification {notification} />
	{/each}
</div>

<style>
	.notifications-container {
		position: fixed;
		top: 20px;
		right: 20px;
		max-width: 400px;
		pointer-events: auto;
	}
</style>
