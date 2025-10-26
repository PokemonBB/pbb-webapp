<script lang="ts">
	import pbbLogo from '$lib/assets/pbb-logo.png';
	import LogoutButton from './LogoutButton.svelte';
	import ProfileButton from './ProfileButton.svelte';
	import SettingsButton from './SettingsButton.svelte';
</script>

<aside
	class="fixed top-0 left-0 z-50 h-full w-16 border-r transition-transform"
	style="background-color: var(--bg-secondary); border-color: var(--border-color);"
>
	<div class="flex h-full flex-col">
		<div
			class="flex items-center justify-center border-b py-4"
			style="border-color: var(--border-color);"
		>
			<img src={pbbLogo} alt="Pokémon BattleBrawl Logo" class="h-8 w-8" />
		</div>

		<div class="flex-1 space-y-2 p-2">
			<ProfileButton />
		</div>

		<div class="space-y-2 border-t p-2" style="border-color: var(--border-color);">
			<SettingsButton />
			<LogoutButton />
		</div>
	</div>
</aside>
