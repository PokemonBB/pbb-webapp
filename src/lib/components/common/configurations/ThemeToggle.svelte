<script lang="ts">
	import { userConfigStore, type Theme } from '$lib/stores/userConfig';
	import { translationStore } from '$lib/stores/translations';
	import Icon from '$lib/components/common/utils/Icon.svelte';

	function setTheme(theme: Theme) {
		userConfigStore.setTheme(theme);
	}
</script>

<div class="theme-toggle">
	<div class="theme-bar">
		<button
			type="button"
			class="theme-option {$userConfigStore.theme === 'light' ? 'active' : ''}"
			onclick={() => setTheme('light')}
			aria-label="Light theme"
		>
			<Icon name="sun" size="small" />&nbsp;
			<span class="text-label"
				>{$translationStore.translations?.settings.themeLight || 'Light'}</span
			>
		</button>

		<button
			type="button"
			class="theme-option {$userConfigStore.theme === 'dark' ? 'active' : ''}"
			onclick={() => setTheme('dark')}
			aria-label="Dark theme"
		>
			<Icon name="moon" size="small" />&nbsp;
			<span class="text-label">{$translationStore.translations?.settings.themeDark || 'Dark'}</span>
		</button>

		<button
			type="button"
			class="theme-option {$userConfigStore.theme === 'system' ? 'active' : ''}"
			onclick={() => setTheme('system')}
			aria-label="System theme"
		>
			<Icon name="monitor" size="small" />&nbsp;
			<span class="text-label"
				>{$translationStore.translations?.settings.themeSystem || 'System'}</span
			>
		</button>
	</div>
</div>

<style>
	.theme-toggle {
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: 100%;
		container-type: inline-size;
	}

	.theme-bar {
		display: flex;
		background: var(--bg-tertiary);
		border-radius: 8px;
		padding: 4px;
		border: 1px solid var(--border-primary);
		gap: 2px;
		width: 100%;
	}

	.theme-option {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 8px 6px;
		border-radius: 6px;
		border: none;
		background: transparent;
		cursor: pointer;
		transition: all 0.2s ease;
		color: var(--text-secondary);
		min-width: 0;
		max-width: 100%;
		overflow: hidden;
	}

	.theme-option:hover {
		background: var(--bg-secondary);
		color: var(--text-primary);
	}

	.theme-option.active {
		background: var(--bg-primary);
		color: var(--text-primary);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.theme-option.active:hover {
		background: var(--bg-primary);
	}

	@container (max-width: 280px) {
		.text-label {
			display: none !important;
		}

		.theme-option {
			padding: 8px 4px;
			gap: 0;
		}
	}

	@container (max-width: 400px) {
		.theme-option {
			padding: 6px 2px;
			font-size: 11px;
		}
	}

	@container (max-width: 500px) {
		.theme-option {
			padding: 6px 4px;
			font-size: 12px;
		}
	}

	@container (min-width: 501px) {
		.theme-option {
			padding: 10px 8px;
		}
	}
</style>
