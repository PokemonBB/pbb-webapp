import { writable } from 'svelte/store';
import { userConfigStore, type Language } from './userConfig';

interface Translations {
	common: {
		login: string;
		logout: string;
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
		invitationCode: string;
		enterInvitationCode: string;
		invalidInvitationCode: string;
		invalidInvitationCodeMessage: string;
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
		checkEmail: string;
		activationEmailSent: string;
		backToLogin: string;
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
	activate: {
		activateAccount: string;
		enterCode: string;
		activationCode: string;
		enterActivationCode: string;
		activating: string;
		activateAccountButton: string;
		accountActivated: string;
		activationSuccess: string;
		redirecting: string;
		noCode: string;
		contactSupport: string;
		resendCode: string;
		enterEmail: string;
		codeSent: string;
		resendAnother: string;
		sending: string;
		alreadyHaveCode: string;
		activateHere: string;
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
			const module = await import(`../translations/${language}.json`);
			return module.default as Translations;
		} catch (error) {
			console.error(`Error loading translations for ${language}:`, error);
			if (language !== 'en') {
				const module = await import(`../translations/en.json`);
				return module.default as Translations;
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
