<script lang="ts">
	import { userConfigStore, type Language } from '$lib/stores/userConfig';
	import { translationStore } from '$lib/stores/translations';
	import Icon from '$lib/components/common/Icon.svelte';

	function setLanguage(language: Language) {
		userConfigStore.setLanguage(language);
	}

	function getLanguageName(language: Language): string {
		return language === 'en'
			? $translationStore.translations?.settings.languageEnglish || 'English'
			: $translationStore.translations?.settings.languageSpanish || 'Español';
	}
</script>

<div class="language-toggle">
	<div class="language-bar">
		<button
			type="button"
			class="language-option {$userConfigStore.language === 'en' ? 'active' : ''}"
			onclick={() => setLanguage('en')}
			aria-label="English language"
		>
			<Icon name="flag-us" size="small" />
			<span class="name">{getLanguageName('en')}</span>
		</button>

		<button
			type="button"
			class="language-option {$userConfigStore.language === 'es' ? 'active' : ''}"
			onclick={() => setLanguage('es')}
			aria-label="Español language"
		>
			<Icon name="flag-es" size="small" />
			<span class="name">{getLanguageName('es')}</span>
		</button>
	</div>
</div>

<style>
	.language-toggle {
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: 100%;
		container-type: inline-size;
	}

	.language-bar {
		display: flex;
		background: var(--bg-tertiary);
		border-radius: 8px;
		padding: 4px;
		border: 1px solid var(--border-primary);
		gap: 2px;
		width: 100%;
	}

	.language-option {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
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

	.language-option:hover {
		background: var(--bg-secondary);
		color: var(--text-primary);
	}

	.language-option.active {
		background: var(--bg-primary);
		color: var(--text-primary);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.language-option.active:hover {
		background: var(--bg-primary);
	}

	.name {
		font-size: 14px;
		font-weight: 500;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	@container (max-width: 280px) {
		.name {
			display: none !important;
		}

		.language-option {
			padding: 8px 4px;
			gap: 0;
		}
	}

	@container (max-width: 400px) {
		.language-option {
			padding: 6px 2px;
			gap: 3px;
		}

		.name {
			font-size: 11px;
		}
	}

	@container (max-width: 500px) {
		.language-option {
			padding: 6px 4px;
			gap: 4px;
		}

		.name {
			font-size: 12px;
		}
	}

	@container (min-width: 501px) {
		.language-option {
			padding: 10px 8px;
			gap: 8px;
		}

		.name {
			font-size: 15px;
		}
	}
</style>
