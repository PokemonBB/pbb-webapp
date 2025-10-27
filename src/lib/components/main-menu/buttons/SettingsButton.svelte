<script lang="ts">
	import MainMenuButton from '$lib/components/main-menu/MainMenuButton.svelte';
	import SettingsWindow from '$lib/components/window/windows/SettingsWindow.svelte';
	import { translationStore } from '$lib/stores/translations';

	let open = $state(false);
</script>

<MainMenuButton
	icon="gear"
	active={open}
	tooltip={$translationStore.translations?.settings.title || 'Settings'}
	onclick={() => (open = !open)}
/>

<SettingsWindow visible={open} on:close={() => (open = false)} />
