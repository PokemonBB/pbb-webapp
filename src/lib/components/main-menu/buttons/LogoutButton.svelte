<script lang="ts">
	import { authStore } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import MainMenuButton from '$lib/components/main-menu/MainMenuButton.svelte';

	async function handleLogout() {
		await authStore.logout();
		goto('/login');
	}
</script>

<MainMenuButton
	icon="log-out"
	loading={$authStore.isLoading}
	disabled={$authStore.isLoading}
	hoverClass="hover:bg-red-50 dark:hover:bg-red-900/20"
	onclick={handleLogout}
/>
