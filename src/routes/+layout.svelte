<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/pokeball.png';
	import { authStore } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { userConfigStore } from '$lib/stores/userConfig';
	import { translationStore } from '$lib/stores/translations';
	import { contentLoadingStore } from '$lib/stores/contentLoading';
	import Loader from '$lib/components/common/Loader.svelte';
	import MainMenu from '$lib/components/main-menu/MainMenu.svelte';

	let { children } = $props();

	onMount(() => {
		// Initialize translations first
		translationStore.init();

		// Then check authentication
		authStore.checkAuth();
	});

	$effect(() => {
		if (typeof window !== 'undefined') {
			const currentPath = $page.url.pathname;
			const authPages = [
				'/login',
				'/register',
				'/forgot-password',
				'/reset-password',
				'/activate',
				'/activate/resend'
			];
			const isOnAuthPage = authPages.some((page) => currentPath.includes(page));
			const isOnContentLoading = currentPath === '/content-loading';

			if ($authStore.isAuthenticated === false && $authStore.isLoading === false) {
				// Not authenticated: redirect to login unless on auth pages
				if (!isOnAuthPage) {
					goto('/login');
				}
			} else if ($authStore.isAuthenticated === true && $authStore.isLoading === false) {
				// Initialize user configuration only when authenticated
				userConfigStore.init();

				// Authenticated: check content loading status
				if (!$contentLoadingStore.isComplete) {
					// Content not loaded: go to content loading
					if (!isOnContentLoading) {
						goto('/content-loading');
					}
				} else {
					// Content loaded: redirect away from auth pages and content loading
					if (isOnAuthPage || isOnContentLoading) {
						goto('/');
					}
				}
			}
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if $authStore.isLoading}
	<div
		class="flex min-h-screen items-center justify-center"
		style="background-color: var(--bg-primary);"
	>
		<Loader size="large" />
	</div>
{:else if $authStore.isAuthenticated}
	{@const currentPath = $page.url.pathname}
	{@const noHeaderPaths = [
		'/content-loading',
		'/login',
		'/register',
		'/forgot-password',
		'/reset-password',
		'/activate',
		'/activate/resend'
	]}
	{@const shouldHideHeader = noHeaderPaths.some((path) => currentPath.startsWith(path))}

	{#if shouldHideHeader}
		{@render children?.()}
	{:else}
		<div class="min-h-screen" style="background-color: var(--bg-primary);">
			<MainMenu />
			<main id="app-main" class="ml-16 min-h-screen" style="position: relative;">
				{@render children?.()}
			</main>
		</div>
	{/if}
{:else}
	{@render children?.()}
{/if}
