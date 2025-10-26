<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import pbbLogo from '$lib/assets/pbb-logo.png';
	import { userConfigStore } from '$lib/stores/userConfig';
	import { translationStore } from '$lib/stores/translations';
	import { activationApi } from '$lib/utils/api';
	import Credits from '$lib/components/common/Credits.svelte';
	import Loader from '$lib/components/common/Loader.svelte';

	let email = '';
	let isLoading = false;
	let isResending = false;
	let error = '';
	let success = false;
	let message = '';

	onMount(() => {
		userConfigStore.init();
		translationStore.init();
	});

	async function handleResend() {
		if (!email) {
			error = 'Email is required';
			return;
		}

		isResending = true;
		error = '';
		success = false;

		try {
			const response = await activationApi.resend({ email });

			if (response.success) {
				success = true;
				message = response.message || 'Activation code sent successfully!';
			} else {
				error = response.message || 'Failed to send activation code. Please try again.';
			}
		} catch (err) {
			error = 'Failed to send activation code. Please check your email and try again.';
		}

		isResending = false;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleResend();
		}
	}
</script>

<svelte:head>
	<title>Resend Activation Code - Pokémon BattleBrawl</title>
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

		{#if success}
			<div class="text-center">
				<div class="mb-4">
					<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
						<svg
							class="h-6 w-6 text-green-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							></path>
						</svg>
					</div>
				</div>
				<h2 class="mb-2 text-xl font-bold" style="color: var(--text-primary);">
					{$translationStore.translations?.activate.codeSent || 'Code Sent!'}
				</h2>
				<p class="mb-4 text-sm" style="color: var(--text-secondary);">
					{message}
				</p>
				<div class="space-y-2">
					<button
						on:click={() => goto('/activate')}
						class="w-full rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:ring-2 focus:ring-offset-2 focus:outline-none"
						style="background-color: var(--accent-primary);"
					>
						{$translationStore.translations?.activate.activateAccount || 'Activate Account'}
					</button>
					<button
						on:click={() => {
							success = false;
							message = '';
						}}
						class="w-full rounded-md border px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:outline-none"
						style="border-color: var(--border-primary); color: var(--text-primary);"
					>
						{$translationStore.translations?.activate.resendAnother || 'Resend Another'}
					</button>
				</div>
			</div>
		{:else}
			<div class="space-y-4">
				<div class="text-center">
					<h2 class="text-2xl font-bold" style="color: var(--text-primary);">
						{$translationStore.translations?.activate.resendCode || 'Resend Activation Code'}
					</h2>
					<p class="mt-2 text-sm" style="color: var(--text-secondary);">
						{$translationStore.translations?.activate.enterEmail ||
							'Enter your email to receive a new activation code'}
					</p>
				</div>

				<form on:submit|preventDefault={handleResend}>
					<div class="space-y-2">
						<label
							for="email"
							class="block text-sm font-medium"
							style="color: var(--text-primary);"
						>
							{$translationStore.translations?.common.email || 'Email'}
						</label>
						<input
							id="email"
							name="email"
							type="email"
							required
							class="relative block w-full appearance-none rounded-md border px-3 py-3 focus:z-10 focus:outline-none sm:text-sm"
							style="border-color: var(--border-primary); background-color: var(--bg-secondary); color: var(--text-primary); --tw-placeholder-color: var(--text-tertiary);"
							placeholder={$translationStore.translations?.common.email || 'Enter your email'}
							bind:value={email}
							on:keydown={handleKeydown}
							disabled={isResending}
						/>
					</div>

					{#if error}
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
										{error}
									</h3>
								</div>
							</div>
						</div>
					{/if}

					<div class="mt-4">
						<button
							type="submit"
							class="group relative flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
							style="background-color: var(--accent-primary);"
							on:mouseenter={(e) =>
								((e.target as HTMLElement).style.backgroundColor = 'var(--accent-hover)')}
							on:mouseleave={(e) =>
								((e.target as HTMLElement).style.backgroundColor = 'var(--accent-primary)')}
							disabled={isResending || !email}
						>
							{#if isResending}
								<Loader size="small" />
								<span class="ml-2"
									>{$translationStore.translations?.activate.sending || 'Sending...'}</span
								>
							{:else}
								{$translationStore.translations?.activate.resendCode || 'Resend Code'}
							{/if}
						</button>
					</div>
				</form>

				<div class="text-center">
					<p class="text-sm" style="color: var(--text-secondary);">
						{$translationStore.translations?.activate.alreadyHaveCode ||
							'Already have an activation code?'}
						<a href="/activate" class="font-medium" style="color: var(--accent-primary);">
							{$translationStore.translations?.activate.activateHere || 'Activate here'}
						</a>
					</p>
				</div>
			</div>
		{/if}
	</div>
</div>

<Credits />
