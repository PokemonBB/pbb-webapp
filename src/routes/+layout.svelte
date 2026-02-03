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
	import { audioPermissionsStore } from '$lib/stores/audioPermissions';
	import Loader from '$lib/components/common/utils/Loader.svelte';
	import ContentLoader from '$lib/components/common/utils/ContentLoader.svelte';
	import MainMenu from '$lib/components/main-menu/MainMenu.svelte';
	import NotificationsContainer from '$lib/components/common/notifications/NotificationsContainer.svelte';

	let { children } = $props();

	let contentLoadingStarted = $state(false);

	onMount(() => {
		translationStore.init();
		authStore.checkAuth();
		audioPermissionsStore.requestPermission();
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

			if ($authStore.isAuthenticated === false && $authStore.isLoading === false) {
				if (!isOnAuthPage) {
					goto('/login');
				}
			} else if ($authStore.isAuthenticated === true && $authStore.isLoading === false) {
				userConfigStore.init();

				if (!contentLoadingStarted && !$contentLoadingStore.isComplete) {
					contentLoadingStarted = true;
					userConfigStore.init();
					translationStore.init();
					contentLoadingStore.startLoading();
				}

				if (isOnAuthPage) {
					goto('/');
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
		'/login',
		'/register',
		'/forgot-password',
		'/reset-password',
		'/activate',
		'/activate/resend'
	]}
	{@const shouldHideHeader = noHeaderPaths.some((path) => currentPath.startsWith(path))}

	{#if !$contentLoadingStore.isComplete}
		<ContentLoader {contentLoadingStarted} />
	{:else if shouldHideHeader}
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

<NotificationsContainer />
