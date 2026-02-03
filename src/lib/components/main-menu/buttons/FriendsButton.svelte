<script lang="ts">
	import MainMenuButton from '$lib/components/main-menu/MainMenuButton.svelte';
	import FriendsWindow from '$lib/components/window/windows/FriendsWindow.svelte';
	import { translationStore } from '$lib/stores/translations';
	import { windowControlStore } from '$lib/stores/windowControl';

	let open = $state(false);
	let initialTab = $state('friends');

	export function openFriendsWindow(tab: string = 'friends') {
		initialTab = tab;
		open = true;
	}

	$effect(() => {
		const unsubscribe = windowControlStore.subscribe((state) => {
			if (state.openFriendsWindow) {
				openFriendsWindow(state.openFriendsWindow.tab);
				windowControlStore.reset();
			}
		});

		return unsubscribe;
	});
</script>

<MainMenuButton
	icon="users"
	active={open}
	tooltip={$translationStore.translations?.friends.title || 'Friends'}
	onclick={() => (open = !open)}
/>

<FriendsWindow
	visible={open}
	{initialTab}
	on:close={() => {
		open = false;
		initialTab = 'friends';
	}}
/>
