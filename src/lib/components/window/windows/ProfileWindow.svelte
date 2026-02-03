<script lang="ts">
	import Window from '$lib/components/window/Window.svelte';
	import { translationStore } from '$lib/stores/translations';
	import { createEventDispatcher } from 'svelte';
	import { globalZIndex } from '$lib/components/window/zindex';
	import { userApi, type UserProfile } from '$lib/utils/api';

	let user = $state<UserProfile | null>(null);

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
		userApi.getProfile().then((response) => {
			user = response.user;
		});
	});
</script>

{#if visible}
	<Window
		title={$translationStore.translations?.profile.windowTitle || 'User Profile'}
		icon="user"
		{width}
		{height}
		{left}
		{top}
		{visible}
		on:close={handleClose}
	>
		<div class="p-6" style="color: var(--text-primary);">
			<h2 class="mb-4 text-xl font-semibold">
				{$translationStore.translations?.profile.title || 'Profile'}
			</h2>
			<p class="mb-4">
				Username: {user?.username}
			</p>
			<p class="mb-4">
				Email: {user?.email}
			</p>
			<p class="mb-4">
				Role: {user?.role}
			</p>
			<p class="mb-4">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
				labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
				laboris nisi ut aliquip ex ea commodo consequat.
			</p>
			<p class="mb-4">
				Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
				pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
				mollit anim id est laborum.
			</p>
			<p>
				Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
				laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
				architecto beatae vitae dicta sunt explicabo.
			</p>
		</div>
	</Window>
{/if}
