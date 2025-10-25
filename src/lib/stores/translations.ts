import { writable } from 'svelte/store';
import { userConfigStore, type Language } from './userConfig';

interface Translations {
	common: {
		login: string;
		logout: string;
		welcome: string;
		appName: string;
		signIn: string;
		signingIn: string;
		username: string;
		password: string;
		email: string;
		confirmPassword: string;
		rememberMe: string;
		play: string;
		battle: string;
		trainer: string;
		pokemon: string;
		createAccount: string;
		creatingAccount: string;
		sendInstructions: string;
		sending: string;
		forgotPassword: string;
		dontHaveAccount: string;
		createOneHere: string;
		rememberPassword: string;
		backToLogin: string;
	};
	login: {
		userOrEmail: string;
		signInToAccount: string;
		authenticationSuccessful: string;
		sessionActive: string;
	};
	register: {
		createAccount: string;
		joinAdventure: string;
		alreadyHaveAccount: string;
		signInHere: string;
		registrationSuccessful: string;
		accountCreated: string;
	};
	forgotPassword: {
		resetPassword: string;
		enterEmail: string;
		backToLogin: string;
		emailSent: string;
		checkEmail: string;
	};
	resetPassword: {
		resetYourPassword: string;
		enterNewPassword: string;
		passwordReset: string;
		passwordUpdated: string;
		passwordUpdatedMessage: string;
		invalidToken: string;
		invalidTokenMessage: string;
		requestNewLink: string;
		newPassword: string;
		confirmNewPassword: string;
		updatePassword: string;
		updatingPassword: string;
	};
	main: {
		welcomeToApp: string;
		loggedInAs: string;
		readyToBattle: string;
		catchEmAll: string;
	};
	theme: {
		light: string;
		dark: string;
		system: string;
	};
}

interface TranslationState {
	translations: Translations | null;
	isLoading: boolean;
	error: string | null;
}

const defaultState: TranslationState = {
	translations: null,
	isLoading: false,
	error: null
};

function createTranslationStore() {
	const { subscribe, update } = writable<TranslationState>(defaultState);

	let currentLanguage: Language = 'en';

	const loadTranslations = async (language: Language): Promise<Translations> => {
		try {
			const response = await fetch(`/src/lib/translations/${language}.json`);
			if (!response.ok) {
				throw new Error(`Failed to load translations for ${language}`);
			}
			return await response.json();
		} catch (error) {
			console.error(`Error loading translations for ${language}:`, error);
			// Fallback to English if the requested language fails
			if (language !== 'en') {
				return await loadTranslations('en');
			}
			throw error;
		}
	};

	return {
		subscribe,
		loadLanguage: async (language: Language) => {
			update((state) => ({ ...state, isLoading: true, error: null }));

			try {
				const translations = await loadTranslations(language);
				currentLanguage = language;

				update((state) => ({
					...state,
					translations,
					isLoading: false,
					error: null
				}));
			} catch (error) {
				update((state) => ({
					...state,
					isLoading: false,
					error: `Failed to load translations: ${error}`
				}));
			}
		},
		init: async () => {
			// Get current language from userConfigStore
			let currentState: { language: Language } = { language: 'en' };
			const unsubscribe = userConfigStore.subscribe((state) => {
				currentState = { language: state.language };
			});
			unsubscribe();

			await translationStore.loadLanguage(currentState.language);
		},
		getCurrentLanguage: () => currentLanguage
	};
}

export const translationStore = createTranslationStore();
