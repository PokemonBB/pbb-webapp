<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/pokeball.png';
	import pbbLogo from '$lib/assets/pbb-logo.png';
	import { authStore } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import LogoutButton from '$lib/components/LogoutButton.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import LanguageToggle from '$lib/components/LanguageToggle.svelte';
	import { userConfigStore } from '$lib/stores/userConfig';
	import { translationStore } from '$lib/stores/translations';

	let { children } = $props();

	onMount(() => {
		// Initialize browser configuration first (before login)
		userConfigStore.init();
		translationStore.init();

		// Then check authentication
		authStore.checkAuth();
	});

	$effect(() => {
		if (typeof window !== 'undefined') {
			const currentPath = window.location.pathname;
			const authPages = ['/login', '/register', '/forgot-password', '/reset-password'];
			const isOnAuthPage = authPages.some((page) => currentPath.includes(page));

			if ($authStore.isAuthenticated === false && $authStore.isLoading === false) {
				// Redirect to login if not authenticated and not on auth pages
				if (!isOnAuthPage) {
					goto('/login');
				}
			} else if ($authStore.isAuthenticated === true && $authStore.isLoading === false) {
				// Redirect to home if authenticated and on auth pages
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
	<div class="flex min-h-screen items-center justify-center">
		<div class="h-32 w-32 animate-spin rounded-full border-b-2 border-indigo-600"></div>
	</div>
{:else if $authStore.isAuthenticated}
	<div class="min-h-screen" style="background-color: var(--bg-primary);">
		<nav
			class="shadow"
			style="background-color: var(--bg-secondary); box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);"
		>
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="flex h-16 justify-between">
					<div class="flex items-center space-x-3">
						<img src={pbbLogo} alt="Pokémon BattleBrawl Logo" class="h-8 w-8" />
						<h1 class="text-xl font-semibold" style="color: var(--text-primary);">
							{$translationStore.translations?.common.appName || 'Pokémon BattleBrawl'}
						</h1>
					</div>
					<div class="flex items-center space-x-4">
						<LanguageToggle />
						<ThemeToggle />
						<span class="text-sm" style="color: var(--text-secondary);"
							>{$translationStore.translations?.common.welcome || 'Welcome'}, {$translationStore
								.translations?.common.trainer || 'Trainer'}
							{$authStore.user?.username}</span
						>
						<LogoutButton />
					</div>
				</div>
			</div>
		</nav>
		<main class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
			{@render children?.()}
		</main>
	</div>
{:else}
	{@render children?.()}
{/if}
