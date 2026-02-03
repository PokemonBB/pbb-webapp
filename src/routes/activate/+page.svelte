<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import pbbLogo from '$lib/assets/pbb-logo.png';
	import { userConfigStore } from '$lib/stores/userConfig';
	import { translationStore } from '$lib/stores/translations';
	import { activationApi } from '$lib/utils/api';
	import Credits from '$lib/components/common/overlays/Credits.svelte';

	let activationCode = '';
	let isLoading = false;
	let isActivating = false;
	let error = '';
	let success = false;
	let message = '';
	let hasAttempted = false;

	onMount(() => {
		userConfigStore.init();
		translationStore.init();

		const urlCode = $page.url.searchParams.get('code');
		if (urlCode) {
			activationCode = urlCode;
			handleActivation();
		}
	});

	async function handleActivation() {
		if (!activationCode) {
			error = 'No activation code provided';
			return;
		}
		if (isActivating || success || hasAttempted) return;
		hasAttempted = true;

		isActivating = true;
		error = '';
		success = false;

		try {
			const sanitizedCode = activationCode.trim();
			const response = await activationApi.activate({ code: sanitizedCode });

			if (response.success) {
				success = true;
				message = response.message || 'Account activated successfully! You can now register.';
				const invitationCode = response.invitationCode || sanitizedCode;
				setTimeout(() => {
					goto(`/login`);
				}, 2000);
			} else {
				error = response.message || 'Activation failed. Please check your code and try again.';
			}
		} catch (err) {
			const apiErr = err as unknown as { message?: string; status?: number };
			const rawMsg = (apiErr?.message || '').toString();
			const msg = rawMsg.toLowerCase();
			const idempotentPatterns = [
				'already activated',
				'already-activated',
				'already active',
				'code already used',
				'already used',
				'ya activada',
				'ya activado',
				'ya esta activada',
				'ya está activada',
				'codigo ya usado',
				'código ya usado'
			];
			if (
				apiErr?.status === 409 ||
				apiErr?.status === 400 ||
				idempotentPatterns.some((p) => msg.includes(p))
			) {
				success = true;
				message = rawMsg || 'Account already activated. You can now register.';
				setTimeout(() => {
					goto('/login');
				}, 2000);
			} else {
				error = 'Activation failed. Please check your code and try again.';
				hasAttempted = false;
			}
		}

		isActivating = false;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleActivation();
		}
	}
</script>

<svelte:head>
	<title>Activate Account - Pokémon BattleBrawl</title>
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
					{$translationStore.translations?.activate.accountActivated || 'Account Activated!'}
				</h2>
				<p class="mb-4 text-sm" style="color: var(--text-secondary);">
					{message}
				</p>
				<p class="text-xs" style="color: var(--text-tertiary);">
					{$translationStore.translations?.activate.redirecting || 'Redirecting to registration...'}
				</p>
			</div>
		{:else}
			<div class="space-y-4">
				<div class="text-center">
					<h2 class="text-2xl font-bold" style="color: var(--text-primary);">
						{$translationStore.translations?.activate.activateAccount || 'Activate Your Account'}
					</h2>
					<p class="mt-2 text-sm" style="color: var(--text-secondary);">
						{$translationStore.translations?.activate.enterCode ||
							'Enter your activation code to continue'}
					</p>
				</div>

				<form on:submit|preventDefault={handleActivation}>
					<div class="space-y-2">
						<label
							for="activationCode"
							class="block text-sm font-medium"
							style="color: var(--text-primary);"
						>
							{$translationStore.translations?.activate.activationCode || 'Activation Code'}
						</label>
						<input
							id="activationCode"
							name="activationCode"
							type="text"
							required
							class="relative block w-full appearance-none rounded-md border px-3 py-3 focus:z-10 focus:outline-none sm:text-sm"
							style="border-color: var(--border-primary); background-color: var(--bg-secondary); color: var(--text-primary); --tw-placeholder-color: var(--text-tertiary);"
							placeholder={$translationStore.translations?.activate.enterActivationCode ||
								'Enter your activation code'}
							bind:value={activationCode}
							on:keydown={handleKeydown}
							disabled={isActivating}
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
							disabled={isActivating || !activationCode}
						>
							{#if isActivating}
								<span class="ml-2"
									>{$translationStore.translations?.activate.activating || 'Activating...'}</span
								>
							{:else}
								{$translationStore.translations?.activate.activateAccountButton ||
									'Activate Account'}
							{/if}
						</button>
					</div>
				</form>

				<div class="text-center">
					<p class="text-sm" style="color: var(--text-secondary);">
						{$translationStore.translations?.activate.noCode || "Don't have an activation code?"}
						<a href="/activate/resend" class="font-medium" style="color: var(--accent-primary);">
							{$translationStore.translations?.activate.contactSupport || 'Contact support'}
						</a>
					</p>
				</div>
			</div>
		{/if}
	</div>
</div>

<Credits />
