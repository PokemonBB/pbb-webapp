<script lang="ts">
	import Window from '$lib/components/window/Window.svelte';
	import { translationStore } from '$lib/stores/translations';
	import { createEventDispatcher } from 'svelte';
	import ThemeToggle from '$lib/components/common/ThemeToggle.svelte';
	import LanguageToggle from '$lib/components/common/LanguageToggle.svelte';
	import { globalZIndex } from '$lib/components/window/zindex';

	interface Props {
		visible?: boolean;
		width?: number;
		height?: number;
		left?: number;
		top?: number;
	}

	let { visible = false, width = 720, height = 480, left = 0, top = 0 }: Props = $props();

	const dispatch = createEventDispatcher<{ close: void }>();

	function handleClose() {
		dispatch('close');
	}

	// Bring window to front when it becomes visible
	$effect(() => {
		if (visible) {
			globalZIndex.update((n) => n + 1);
		}
	});
</script>

{#if visible}
	<Window
		title={$translationStore.translations?.settings.windowTitle || 'Settings'}
		icon="gear"
		{width}
		{height}
		{left}
		{top}
		{visible}
		on:close={handleClose}
	>
		<div class="p-6" style="color: var(--text-primary);">
			<div class="space-y-6">
				<div class="border-b border-gray-200 pb-4 dark:border-gray-700">
					<h3 class="mb-3 text-lg font-medium">
						{$translationStore.translations?.settings.theme || 'Theme'}
					</h3>
					<ThemeToggle />
				</div>
				<div class="border-b border-gray-200 pb-4 dark:border-gray-700">
					<h3 class="mb-2 text-lg font-medium">
						{$translationStore.translations?.settings.language || 'Language'}
					</h3>
					<LanguageToggle />
				</div>
			</div>
		</div>
	</Window>
{/if}
