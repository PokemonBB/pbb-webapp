import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { userApi, type UserConfiguration } from '$lib/utils/api';
import { translationStore } from './translations';

export type Language = 'en' | 'es';
export type Theme = 'light' | 'dark' | 'system';

interface UserConfigState {
	language: Language;
	theme: Theme;
	isLoading: boolean;
	error: string | null;
}

const defaultConfig: UserConfigState = {
	language: 'en',
	theme: 'system',
	isLoading: false,
	error: null
};

function createUserConfigStore() {
	const { subscribe, update } = writable<UserConfigState>(defaultConfig);

	const applyTheme = (theme: Theme) => {
		if (!browser) return;

		const html = document.documentElement;
		html.classList.remove('light', 'dark');

		if (theme === 'system') {
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			if (prefersDark) {
				html.classList.add('dark');
			} else {
				html.classList.add('light');
			}
		} else {
			html.classList.add(theme);
		}
	};

	const getBrowserLanguage = (): Language => {
		if (!browser) return 'en';
		const browserLang = navigator.language.split('-')[0];
		return browserLang === 'es' ? 'es' : 'en';
	};

	const getBrowserTheme = (): Theme => {
		if (!browser) return 'system';
		return 'system'; // Always use system preference before login
	};

	return {
		subscribe,
		init: async () => {
			if (!browser) return;

			// Get current state without subscribing
			let currentState: UserConfigState = defaultConfig;
			const unsubscribe = subscribe((state) => {
				currentState = state;
			});
			unsubscribe();

			// Prevent multiple simultaneous initializations
			if (currentState.isLoading) {
				console.log('Already loading user configuration, skipping...');
				return;
			}

			update((state) => ({ ...state, isLoading: true, error: null }));

			try {
				const response = await userApi.getProfile();
				const config = response.user.configuration;

				update((state) => ({
					...state,
					language: config.language as Language,
					theme: config.theme as Theme,
					isLoading: false,
					error: null
				}));

				// Load translations for the user's language
				await translationStore.loadLanguage(config.language as Language);

				applyTheme(config.theme as Theme);
			} catch (error) {
				console.warn('Failed to load user configuration, using browser defaults:', error);

				// Use browser configuration as fallback
				const browserLanguage = getBrowserLanguage();
				const browserTheme = getBrowserTheme();

				update((state) => ({
					...state,
					language: browserLanguage,
					theme: browserTheme,
					isLoading: false,
					error: null
				}));

				// Load translations for browser language
				await translationStore.loadLanguage(browserLanguage);
				applyTheme(browserTheme);
			}
		},
		setLanguage: async (language: Language) => {
			update((state) => ({ ...state, isLoading: true, error: null }));

			try {
				// Get current state
				let currentState: UserConfigState = defaultConfig;
				const unsubscribe = subscribe((state) => {
					currentState = state;
				});
				unsubscribe();

				const newConfig: UserConfiguration = {
					language,
					theme: currentState.theme
				};

				await userApi.updateConfiguration(newConfig);

				// Load translations for the new language
				await translationStore.loadLanguage(language);

				update((state) => ({
					...state,
					language,
					isLoading: false,
					error: null
				}));
			} catch (error) {
				console.error('Failed to update language:', error);
				update((state) => ({
					...state,
					isLoading: false,
					error: 'Failed to update language'
				}));
			}
		},
		setTheme: async (theme: Theme) => {
			update((state) => ({ ...state, isLoading: true, error: null }));

			try {
				// Get current state
				let currentState: UserConfigState = defaultConfig;
				const unsubscribe = subscribe((state) => {
					currentState = state;
				});
				unsubscribe();

				const newConfig: UserConfiguration = {
					language: currentState.language,
					theme
				};

				await userApi.updateConfiguration(newConfig);

				update((state) => ({
					...state,
					theme,
					isLoading: false,
					error: null
				}));

				applyTheme(theme);
			} catch (error) {
				console.error('Failed to update theme:', error);
				update((state) => ({
					...state,
					isLoading: false,
					error: 'Failed to update theme'
				}));
			}
		},
		toggleTheme: async () => {
			// Get current state
			let currentState: UserConfigState = defaultConfig;
			const unsubscribe = subscribe((state) => {
				currentState = state;
			});
			unsubscribe();

			let newTheme: Theme;
			if (currentState.theme === 'light') {
				newTheme = 'dark';
			} else if (currentState.theme === 'dark') {
				newTheme = 'system';
			} else {
				newTheme = 'light';
			}

			await userConfigStore.setTheme(newTheme);
		},
		clearError: () => {
			update((state) => ({ ...state, error: null }));
		},
		initializeUserConfig: async () => {
			// This method is called after successful login to initialize user configuration
			if (!browser) return;

			try {
				// Try to get user profile first
				const response = await userApi.getProfile();
				const config = response.user.configuration;

				// If user has configuration, use it
				update((state) => ({
					...state,
					language: config.language as Language,
					theme: config.theme as Theme,
					isLoading: false,
					error: null
				}));

				await translationStore.loadLanguage(config.language as Language);
				applyTheme(config.theme as Theme);
			} catch {
				// If user has no configuration, initialize with browser settings
				console.log('User has no configuration, initializing with browser settings');

				const browserLanguage = getBrowserLanguage();
				const browserTheme = getBrowserTheme();

				// Send browser configuration to API to initialize user
				const initialConfig: UserConfiguration = {
					language: browserLanguage,
					theme: browserTheme
				};

				try {
					await userApi.updateConfiguration(initialConfig);
					console.log('User configuration initialized with browser settings');
				} catch (apiError) {
					console.warn('Failed to initialize user configuration:', apiError);
				}

				// Apply browser configuration locally
				update((state) => ({
					...state,
					language: browserLanguage,
					theme: browserTheme,
					isLoading: false,
					error: null
				}));

				await translationStore.loadLanguage(browserLanguage);
				applyTheme(browserTheme);
			}
		}
	};
}

export const userConfigStore = createUserConfigStore();
