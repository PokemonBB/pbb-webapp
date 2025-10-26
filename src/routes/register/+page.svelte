<script lang="ts">
	import { authStore } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import pbbLogo from '$lib/assets/pbb-logo.png';
	import { userConfigStore } from '$lib/stores/userConfig';
	import { translationStore } from '$lib/stores/translations';
	import Credits from '$lib/components/common/Credits.svelte';

	let username = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let invitationCode = '';
	let isCodeFromUrl = false;
	let isLoading = false;
	let error = '';
	let registrationSuccess = false;

	$: authState = $authStore;

	onMount(() => {
		if ($authStore.isAuthenticated) {
			goto('/');
		}
		userConfigStore.init();
		translationStore.init();

		// Get invitation code from URL
		const urlCode = $page.url.searchParams.get('code');
		if (urlCode) {
			invitationCode = urlCode;
			isCodeFromUrl = true;
		}
	});

	async function handleRegister() {
		if (!username || !email || !password || !confirmPassword || !invitationCode) return;
		if (password !== confirmPassword) {
			error = 'Passwords do not match';
			return;
		}

		// Clear any previous errors
		authStore.clearError();

		try {
			const result = await authStore.register({
				username,
				email,
				password,
				invitationCode
			});

			if (result.success) {
				registrationSuccess = true;
			}
		} catch (err) {
			error = 'Registration failed. Please try again.';
		}

		isLoading = false;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleRegister();
		}
	}
</script>

<svelte:head>
	<title>Register - Pokémon BattleBrawl</title>
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

		{#if registrationSuccess}
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
					{$translationStore.translations?.register.registrationSuccessful ||
						'Registration Successful!'}
				</h2>
				<p class="mb-4 text-sm" style="color: var(--text-secondary);">
					{$translationStore.translations?.register.activationEmailSent ||
						"We've sent you an activation email. Please check your inbox and click the activation link to complete your registration."}
				</p>
				<div class="space-y-2">
					<button
						on:click={() => goto('/login')}
						class="w-full rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:ring-2 focus:ring-offset-2 focus:outline-none"
						style="background-color: var(--accent-primary);"
					>
						{$translationStore.translations?.register.backToLogin || 'Back to login'}
					</button>
					<button
						on:click={() => {
							registrationSuccess = false;
							error = '';
						}}
						class="w-full rounded-md border px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:outline-none"
						style="border-color: var(--border-primary); color: var(--text-primary);"
					>
						Register Another Account
					</button>
				</div>
			</div>
		{:else}
			<form class="mt-2 space-y-4" on:submit|preventDefault={handleRegister}>
				<!-- Invitation Code Section -->
				<div class="space-y-2">
					<label
						for="invitationCode"
						class="block text-sm font-medium"
						style="color: var(--text-primary);"
					>
						{$translationStore.translations?.common.invitationCode || 'Invitation Code'}
					</label>
					<input
						id="invitationCode"
						name="invitationCode"
						type="text"
						required
						class="relative block w-full appearance-none rounded-md border px-3 py-3 focus:z-10 focus:outline-none sm:text-sm"
						style="border-color: var(--border-primary); background-color: var(--bg-secondary); color: var(--text-primary); --tw-placeholder-color: var(--text-tertiary);"
						placeholder={$translationStore.translations?.common.enterInvitationCode ||
							'Enter your invitation code'}
						bind:value={invitationCode}
						on:keydown={handleKeydown}
						disabled={isLoading || isCodeFromUrl}
						readonly={isCodeFromUrl}
					/>
				</div>

				<!-- User Information Section -->
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
							placeholder={$translationStore.translations?.common.username || 'Username'}
							bind:value={username}
							on:keydown={handleKeydown}
							disabled={isLoading}
						/>
					</div>
					<div>
						<label for="email" class="sr-only">Email</label>
						<input
							id="email"
							name="email"
							type="email"
							required
							class="relative block w-full appearance-none rounded-none border px-3 py-3 focus:z-10 focus:outline-none sm:text-sm"
							style="border-color: var(--border-primary); background-color: var(--bg-secondary); color: var(--text-primary); --tw-placeholder-color: var(--text-tertiary);"
							placeholder={$translationStore.translations?.common.email || 'Email'}
							bind:value={email}
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
							class="relative block w-full appearance-none rounded-none border px-3 py-3 focus:z-10 focus:outline-none sm:text-sm"
							style="border-color: var(--border-primary); background-color: var(--bg-secondary); color: var(--text-primary); --tw-placeholder-color: var(--text-tertiary);"
							placeholder={$translationStore.translations?.common.password || 'Password'}
							bind:value={password}
							on:keydown={handleKeydown}
							disabled={isLoading}
						/>
					</div>
					<div>
						<label for="confirmPassword" class="sr-only">Confirm Password</label>
						<input
							id="confirmPassword"
							name="confirmPassword"
							type="password"
							required
							class="relative block w-full appearance-none rounded-none rounded-b-md border px-3 py-3 focus:z-10 focus:outline-none sm:text-sm"
							style="border-color: var(--border-primary); background-color: var(--bg-secondary); color: var(--text-primary); --tw-placeholder-color: var(--text-tertiary);"
							placeholder={$translationStore.translations?.common.confirmPassword ||
								'Confirm Password'}
							bind:value={confirmPassword}
							on:keydown={handleKeydown}
							disabled={isLoading}
						/>
					</div>
				</div>

				{#if error || $authStore.error}
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
									{error || $authStore.error}
								</h3>
								{#if (error || $authStore.error) === 'Invalid or expired invitation code'}
									<div class="mt-2 text-sm text-red-700">
										<p>
											{$translationStore.translations?.common.invalidInvitationCodeMessage ||
												'The invitation code you entered is invalid or has expired. Please contact the person who invited you for a new code.'}
										</p>
									</div>
								{/if}
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
						disabled={$authStore.isLoading ||
							!username ||
							!email ||
							!password ||
							!confirmPassword ||
							!invitationCode}
					>
						{#if $authStore.isLoading}
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
						{$authStore.isLoading
							? $translationStore.translations?.common.creatingAccount || 'Creating account...'
							: $translationStore.translations?.common.createAccount || 'Create Account'}
					</button>
				</div>

				<div class="text-center">
					<p class="text-sm" style="color: var(--text-secondary);">
						{$translationStore.translations?.register.alreadyHaveAccount ||
							'Already have an account?'}
						<a href="/login" class="font-medium" style="color: var(--accent-primary);">
							{$translationStore.translations?.register.signInHere || 'Sign in here'}
						</a>
					</p>
				</div>
			</form>
		{/if}
	</div>
</div>

<Credits />
