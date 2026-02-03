<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import pbbLogo from '$lib/assets/pbb-logo.png';
	import { userConfigStore } from '$lib/stores/userConfig';
	import { translationStore } from '$lib/stores/translations';
	import { authApi } from '$lib/utils/api';
	import Credits from '$lib/components/common/overlays/Credits.svelte';

	let password = '';
	let confirmPassword = '';
	let isLoading = false;
	let error = '';
	let success = false;
	let tokenValid = false;
	let token = '';

	onMount(() => {
		userConfigStore.init();
		translationStore.init();

		// Get token from URL query parameter
		token = $page.url.searchParams.get('token') || '';

		if (token) {
			validateToken();
		} else {
			error = 'No reset token provided';
		}
	});

	async function validateToken() {
		try {
			const result = await authApi.validateResetToken(token);
			if (result.valid) {
				tokenValid = true;
			} else {
				error = result.message || 'Invalid or expired token';
			}
		} catch (err: any) {
			error = err.message || 'Failed to validate token';
		}
	}

	async function handleResetPassword() {
		if (!password || !confirmPassword) return;
		if (password !== confirmPassword) {
			error = 'Passwords do not match';
			return;
		}

		isLoading = true;
		error = '';

		try {
			const result = await authApi.resetPassword({
				token,
				newPassword: password
			});

			if (result.success) {
				success = true;
			} else {
				error = result.message || 'Failed to reset password';
			}
		} catch (err: any) {
			error = err.message || 'Failed to reset password. Please try again.';
		}

		isLoading = false;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleResetPassword();
		}
	}
</script>

<svelte:head>
	<title>Reset Password - Pokémon BattleBrawl</title>
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
				<h2 class="mb-2 text-2xl font-bold" style="color: var(--text-primary);">
					{$translationStore.translations?.resetPassword.passwordUpdated ||
						'Password updated successfully!'}
				</h2>
				<p class="mb-6 text-sm" style="color: var(--text-secondary);">
					{$translationStore.translations?.resetPassword.passwordUpdatedMessage ||
						'Your password has been updated. You can now sign in with your new password.'}
				</p>
				<a
					href="/login"
					class="inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white"
					style="background-color: var(--accent-primary);"
				>
					{$translationStore.translations?.common.signIn || 'Sign in'}
				</a>
			</div>
		{:else if !tokenValid && error}
			<div class="text-center">
				<div class="mb-4">
					<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
						<svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							></path>
						</svg>
					</div>
				</div>
				<h2 class="mb-2 text-2xl font-bold" style="color: var(--text-primary);">
					{$translationStore.translations?.resetPassword.invalidToken || 'Invalid or expired token'}
				</h2>
				<p class="mb-6 text-sm" style="color: var(--text-secondary);">
					{$translationStore.translations?.resetPassword.invalidTokenMessage ||
						'This password reset link is invalid or has expired. Please request a new one.'}
				</p>
				<div class="space-y-2">
					<a
						href="/forgot-password"
						class="inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white"
						style="background-color: var(--accent-primary);"
					>
						{$translationStore.translations?.resetPassword.requestNewLink ||
							'Request new reset link'}
					</a>
					<div>
						<a href="/login" class="text-sm font-medium" style="color: var(--accent-primary);">
							{$translationStore.translations?.common.backToLogin || 'Back to login'}
						</a>
					</div>
				</div>
			</div>
		{:else if tokenValid}
			<form class="mt-2 space-y-4" on:submit|preventDefault={handleResetPassword}>
				<div class="-space-y-px rounded-md shadow-sm">
					<div>
						<label for="password" class="sr-only">New Password</label>
						<input
							id="password"
							name="password"
							type="password"
							required
							class="relative block w-full appearance-none rounded-none rounded-t-md border px-3 py-3 focus:z-10 focus:outline-none sm:text-sm"
							style="border-color: var(--border-primary); background-color: var(--bg-secondary); color: var(--text-primary); --tw-placeholder-color: var(--text-tertiary);"
							placeholder={$translationStore.translations?.resetPassword.newPassword ||
								'New Password'}
							bind:value={password}
							on:keydown={handleKeydown}
							disabled={isLoading}
						/>
					</div>
					<div>
						<label for="confirmPassword" class="sr-only">Confirm New Password</label>
						<input
							id="confirmPassword"
							name="confirmPassword"
							type="password"
							required
							class="relative block w-full appearance-none rounded-none rounded-b-md border px-3 py-3 focus:z-10 focus:outline-none sm:text-sm"
							style="border-color: var(--border-primary); background-color: var(--bg-secondary); color: var(--text-primary); --tw-placeholder-color: var(--text-tertiary);"
							placeholder={$translationStore.translations?.resetPassword.confirmNewPassword ||
								'Confirm New Password'}
							bind:value={confirmPassword}
							on:keydown={handleKeydown}
							disabled={isLoading}
						/>
					</div>
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

				<div>
					<button
						type="submit"
						class="group relative flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
						style="background-color: var(--accent-primary);"
						on:mouseenter={(e) =>
							((e.target as HTMLElement).style.backgroundColor = 'var(--accent-hover)')}
						on:mouseleave={(e) =>
							((e.target as HTMLElement).style.backgroundColor = 'var(--accent-primary)')}
						disabled={isLoading || !password || !confirmPassword}
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
							? $translationStore.translations?.resetPassword.updatingPassword ||
								'Updating password...'
							: $translationStore.translations?.resetPassword.updatePassword || 'Update Password'}
					</button>
				</div>

				<div class="text-center">
					<p class="text-sm" style="color: var(--text-secondary);">
						Remember your password?
						<a href="/login" class="font-medium" style="color: var(--accent-primary);">
							{$translationStore.translations?.common.backToLogin || 'Back to login'}
						</a>
					</p>
				</div>
			</form>
		{/if}
	</div>
</div>

<Credits />
