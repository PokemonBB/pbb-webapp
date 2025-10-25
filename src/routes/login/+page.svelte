<script lang="ts">
	import { authStore } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import pbbLogo from '$lib/assets/pbb-logo.png';
	import { userConfigStore } from '$lib/stores/userConfig';
	import { translationStore } from '$lib/stores/translations';

	let username = '';
	let password = '';
	let rememberMe = false;
	let isLoading = false;

	$: authState = $authStore;

	onMount(() => {
		if ($authStore.isAuthenticated) {
			goto('/');
		}
		// Initialize browser configuration for login page
		userConfigStore.init();
		translationStore.init();
	});

	async function handleLogin() {
		if (!username || !password) return;

		isLoading = true;
		const result = await authStore.login({
			username,
			password,
			rememberMe
		});

		isLoading = false;

		if (result.success) {
			goto('/');
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleLogin();
		}
	}
</script>

<svelte:head>
	<title>Login - Pokémon BattleBrawl</title>
</svelte:head>

<div
	class="flex min-h-screen items-start justify-center px-4 pt-32 sm:px-6 lg:px-8"
	style="background-color: var(--bg-primary);"
>
	<div class="w-full max-w-md space-y-4">
		<div class="text-center">
			<div class="mb-4 flex justify-center">
				<img src={pbbLogo} alt="Pokémon BattleBrawl Logo" class="h-64 w-64" />
			</div>
		</div>

		<form class="mt-2 space-y-4" on:submit|preventDefault={handleLogin}>
			<div class="-space-y-px rounded-md shadow-sm">
				<div>
					<label for="username" class="sr-only">Trainer Name</label>
					<input
						id="username"
						name="username"
						type="text"
						required
						class="relative block w-full appearance-none rounded-none rounded-t-md border px-3 py-3 focus:z-10 focus:outline-none sm:text-sm"
						style="border-color: var(--border-primary); background-color: var(--bg-secondary); color: var(--text-primary); --tw-placeholder-color: var(--text-tertiary);"
						placeholder={$translationStore.translations?.login.userOrEmail || 'User or Email'}
						bind:value={username}
						on:keydown={handleKeydown}
						disabled={isLoading}
					/>
				</div>
				<div>
					<label for="password" class="sr-only">Password</label>
					<input
						id="password"
						name="password"
						type="password"
						required
						class="relative block w-full appearance-none rounded-none rounded-b-md border px-3 py-3 focus:z-10 focus:outline-none sm:text-sm"
						style="border-color: var(--border-primary); background-color: var(--bg-secondary); color: var(--text-primary); --tw-placeholder-color: var(--text-tertiary);"
						placeholder={$translationStore.translations?.common.password || 'Password'}
						bind:value={password}
						on:keydown={handleKeydown}
						disabled={isLoading}
					/>
				</div>
			</div>

			<div class="flex items-center justify-between">
				<div class="flex items-center">
					<input
						id="remember-me"
						name="remember-me"
						type="checkbox"
						class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
						bind:checked={rememberMe}
						disabled={isLoading}
					/>
					<label for="remember-me" class="ml-2 block text-sm" style="color: var(--text-primary);">
						{$translationStore.translations?.common.rememberMe || 'Remember me'}
					</label>
				</div>
			</div>

			<div class="text-center">
				<a
					href="/forgot-password"
					class="text-sm font-medium"
					style="color: var(--accent-primary);"
				>
					{$translationStore.translations?.common.forgotPassword || 'Forgot password?'}
				</a>
			</div>

			{#if $authStore.error}
				<div class="rounded-md bg-red-50 p-4">
					<div class="flex">
						<div class="flex-shrink-0">
							<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
						<div class="ml-3">
							<h3 class="text-sm font-medium text-red-800">
								{$authStore.error}
							</h3>
						</div>
					</div>
				</div>
			{/if}

			<div>
				<button
					type="submit"
					class="group relative flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
					style="background-color: var(--accent-primary);"
					on:mouseenter={(e) =>
						((e.target as HTMLElement).style.backgroundColor = 'var(--accent-hover)')}
					on:mouseleave={(e) =>
						((e.target as HTMLElement).style.backgroundColor = 'var(--accent-primary)')}
					disabled={isLoading || !username || !password}
				>
					{#if isLoading}
						<svg
							class="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
					{/if}
					{isLoading
						? $translationStore.translations?.common.signingIn || 'Signing in...'
						: $translationStore.translations?.common.play || 'Start Adventure'}
				</button>
			</div>

			<div class="text-center">
				<p class="text-sm" style="color: var(--text-secondary);">
					{$translationStore.translations?.common.dontHaveAccount || "Don't have an account?"}
					<a href="/register" class="font-medium" style="color: var(--accent-primary);">
						{$translationStore.translations?.common.createOneHere || 'Create one here'}
					</a>
				</p>
			</div>
		</form>
	</div>
</div>
