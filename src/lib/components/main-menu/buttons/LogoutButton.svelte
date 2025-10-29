<script lang="ts">
	import { authStore } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { translationStore } from '$lib/stores/translations';
	import MainMenuButton from '$lib/components/main-menu/MainMenuButton.svelte';

	async function handleLogout() {
		await authStore.logout();
		goto('/login');
	}
</script>

<MainMenuButton
	icon="log-out"
	hoverClass="hover:bg-[var(--game-red)]/20 dark:hover:bg-[var(--game-red)]/20"
	tooltip={$translationStore.translations?.common.logout || 'Logout'}
	onclick={handleLogout}
/>
