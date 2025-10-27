import { writable } from 'svelte/store';
import { authApi, type LoginRequest, type RegisterRequest, type ApiError } from '$lib/utils/api';
import { userConfigStore } from './userConfig';

interface User {
	id: string;
	username: string;
	email: string;
	role: string;
}

interface AuthState {
	isAuthenticated: boolean;
	user: User | null;
	isLoading: boolean;
	error: string | null;
}

const initialState: AuthState = {
	isAuthenticated: false,
	user: null,
	isLoading: false,
	error: null
};

function createAuthStore() {
	const { subscribe, update } = writable<AuthState>(initialState);

	let hasCheckedAuth = false;

	return {
		subscribe,
		login: async (credentials: LoginRequest) => {
			update((state) => ({ ...state, isLoading: true, error: null }));

			try {
				const response = await authApi.login(credentials);

				if (response.message === 'Login successful' && response.user) {
					update((state) => ({
						...state,
						isAuthenticated: true,
						user: response.user as User,
						isLoading: false,
						error: null
					}));

					// Initialize user configuration after successful login
					await userConfigStore.initializeUserConfig();

					return { success: true };
				} else {
					update((state) => ({
						...state,
						isLoading: false,
						error: response.message || 'Login failed'
					}));
					return { success: false, error: response.message };
				}
			} catch (error) {
				const apiError = error as ApiError;
				update((state) => ({
					...state,
					isLoading: false,
					error: apiError.message || 'Network error'
				}));
				return { success: false, error: apiError.message };
			}
		},
		register: async (userData: RegisterRequest) => {
			update((state) => ({ ...state, isLoading: true, error: null }));

			try {
				const response = await authApi.register(userData);

				if (response.message === 'User registered successfully') {
					update((state) => ({
						...state,
						isLoading: false,
						error: null
					}));
					return { success: true, message: response.message };
				} else {
					update((state) => ({
						...state,
						isLoading: false,
						error: response.message || 'Registration failed'
					}));
					return { success: false, message: response.message };
				}
			} catch (error) {
				const apiError = error as ApiError;
				update((state) => ({
					...state,
					isLoading: false,
					error: apiError.message || 'Network error'
				}));
				return { success: false, message: apiError.message };
			}
		},
		logout: async () => {
			update((state) => ({ ...state, isLoading: true }));

			try {
				await authApi.logout();
			} catch (error) {
				console.warn('Logout API call failed:', error);
			}

			update((state) => ({
				...state,
				isAuthenticated: false,
				user: null,
				isLoading: false,
				error: null
			}));
		},
		checkAuth: async () => {
			if (hasCheckedAuth) return;
			hasCheckedAuth = true;

			update((state) => ({ ...state, isLoading: true }));

			try {
				const response = await authApi.verify();
				if (
					(response.message === 'Login successful' ||
						response.message === 'Authentication verified') &&
					response.user
				) {
					update((state) => ({
						...state,
						isAuthenticated: true,
						user: response.user as User,
						isLoading: false,
						error: null
					}));
				} else {
					update((state) => ({
						...state,
						isAuthenticated: false,
						user: null,
						isLoading: false,
						error: null
					}));
				}
			} catch {
				update((state) => ({
					...state,
					isAuthenticated: false,
					user: null,
					isLoading: false,
					error: null
				}));
			}
		},
		clearError: () => {
			update((state) => ({ ...state, error: null }));
		}
	};
}

export const authStore = createAuthStore();
