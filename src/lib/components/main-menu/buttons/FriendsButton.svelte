<script lang="ts">
	import MainMenuButton from '$lib/components/main-menu/MainMenuButton.svelte';
	import FriendsWindow from '$lib/components/window/windows/FriendsWindow.svelte';
	import { translationStore } from '$lib/stores/translations';

	let open = $state(false);
</script>

<MainMenuButton
	icon="users"
	active={open}
	tooltip={$translationStore.translations?.friends.title || 'Friends'}
	onclick={() => (open = !open)}
/>

<FriendsWindow visible={open} on:close={() => (open = false)} />
