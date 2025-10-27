<script lang="ts">
	import { onMount } from 'svelte';
	import { contentLoadingStore } from '$lib/stores/contentLoading';
	import { translationStore } from '$lib/stores/translations';
	import { userConfigStore } from '$lib/stores/userConfig';
	import { goto } from '$app/navigation';
	import Credits from '$lib/components/common/Credits.svelte';
	import Loader from '$lib/components/common/Loader.svelte';

	onMount(() => {
		userConfigStore.init();
		translationStore.init();

		// Start content loading
		contentLoadingStore.startLoading();
	});

	$: progress = $contentLoadingStore.progress;
	$: currentFile = $contentLoadingStore.currentFile;
	$: totalFiles = $contentLoadingStore.totalFiles;
	$: loadedFiles = $contentLoadingStore.loadedFiles;
	$: isLoading = $contentLoadingStore.isLoading;
	$: isComplete = $contentLoadingStore.isComplete;
	$: error = $contentLoadingStore.error;
	$: failedFiles = $contentLoadingStore.failedFiles;

	// Redirect to main app when loading is complete
	$: if (isComplete && !isLoading) {
		setTimeout(() => {
			goto('/');
		}, 1000);
	}
</script>

<svelte:head>
	<title>Loading Content - Pokémon BattleBrawl</title>
</svelte:head>

<div
	class="flex min-h-screen items-center justify-center px-4"
	style="background-color: var(--bg-primary);"
>
	<div class="w-full max-w-md space-y-6">
		{#if error}
			<div class="text-center">
				<div class="mb-4">
					<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
						<svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							></path>
						</svg>
					</div>
				</div>
				<h2 class="mb-2 text-xl font-bold" style="color: var(--text-primary);">Loading Error</h2>
				<p class="mb-4 text-sm" style="color: var(--text-secondary);">
					{error}
				</p>
				<button
					class="rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white"
					style="background-color: var(--accent-primary);"
					on:click={() => contentLoadingStore.startLoading()}
				>
					Retry
				</button>
			</div>
		{:else}
			<div class="text-center">
				<div class="mb-6 flex justify-center">
					<Loader size="large" />
				</div>

				<!-- Progress Bar -->
				<div class="mb-4">
					<div class="mb-1 flex justify-between text-xs" style="color: var(--text-secondary);">
						<span>{progress}%</span>
						<span>{loadedFiles} / {totalFiles}</span>
					</div>
					<div class="h-2 w-full rounded-full bg-gray-200">
						<div
							class="h-2 rounded-full transition-all duration-300 ease-out"
							style="background-color: var(--game-red); width: {progress}%"
						></div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<Credits />
