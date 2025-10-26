<script lang="ts">
	import { authStore } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import Icon from '../common/Icon.svelte';
	import Loader from '../common/Loader.svelte';

	async function handleLogout() {
		await authStore.logout();
		goto('/login');
	}
</script>

<button
	on:click={handleLogout}
	class="flex w-full cursor-pointer items-center justify-center rounded-lg p-3 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-900/20"
	style="color: var(--text-primary);"
	disabled={$authStore.isLoading}
>
	{#if $authStore.isLoading}
		<Loader size="small" />
	{:else}
		<Icon name="log-out" size="medium" />
	{/if}
</button>
