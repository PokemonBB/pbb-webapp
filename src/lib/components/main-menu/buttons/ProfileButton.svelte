<script lang="ts">
	import MainMenuButton from '$lib/components/main-menu/MainMenuButton.svelte';
	import ProfileWindow from '$lib/components/window/windows/ProfileWindow.svelte';
	import { translationStore } from '$lib/stores/translations';

	let open = $state(false);
</script>

<MainMenuButton
	icon="user"
	active={open}
	tooltip={$translationStore.translations?.profile.title || 'Profile'}
	onclick={() => (open = !open)}
/>

<ProfileWindow visible={open} on:close={() => (open = false)} />
