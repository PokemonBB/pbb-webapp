<script lang="ts">
	import { userConfigStore, type Language } from '$lib/stores/userConfig';

	let isOpen = false;

	function setLanguage(language: Language) {
		userConfigStore.setLanguage(language);
		isOpen = false;
	}

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.language-toggle')) {
			isOpen = false;
		}
	}

	function getLanguageFlag(language: Language): string {
		return language === 'en' ? '🇺🇸' : '🇪🇸';
	}

	function getLanguageName(language: Language): string {
		return language === 'en' ? 'English' : 'Español';
	}
</script>

<svelte:window on:click={handleClickOutside} />

<div class="language-toggle relative">
	<button
		on:click={toggleDropdown}
		class="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
		style="border-color: var(--border-primary); background-color: var(--bg-secondary); color: var(--text-primary);"
		type="button"
	>
		<span class="mr-2 text-lg">{getLanguageFlag($userConfigStore.language)}</span>
		<span>{getLanguageName($userConfigStore.language)}</span>
		<svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
		</svg>
	</button>

	{#if isOpen}
		<div
			class="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md shadow-lg ring-1 ring-black focus:outline-none"
			style="background-color: var(--bg-secondary); border-color: var(--border-primary);"
		>
			<div class="py-1">
				<button
					on:click={() => setLanguage('en')}
					class="flex w-full items-center px-4 py-2 text-sm hover:opacity-80 {$userConfigStore.language ===
					'en'
						? 'opacity-100'
						: 'opacity-70'}"
					style="color: var(--text-primary);"
				>
					<span class="mr-3 text-lg">🇺🇸</span>
					English
				</button>
				<button
					on:click={() => setLanguage('es')}
					class="flex w-full items-center px-4 py-2 text-sm hover:opacity-80 {$userConfigStore.language ===
					'es'
						? 'opacity-100'
						: 'opacity-70'}"
					style="color: var(--text-primary);"
				>
					<span class="mr-3 text-lg">🇪🇸</span>
					Español
				</button>
			</div>
		</div>
	{/if}
</div>
