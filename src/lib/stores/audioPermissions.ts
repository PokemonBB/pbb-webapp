import { writable } from 'svelte/store';

interface AudioPermissionsState {
	isPermitted: boolean;
	hasRequested: boolean;
	error: string | null;
}

const initialState: AudioPermissionsState = {
	isPermitted: false,
	hasRequested: false,
	error: null
};

function createAudioPermissionsStore() {
	const { subscribe, update, set } = writable<AudioPermissionsState>(initialState);

	return {
		subscribe,

		requestPermission: async (): Promise<boolean> => {
			update((state) => ({ ...state, hasRequested: true, error: null }));

			try {
				const audioContextConstructor: typeof AudioContext | undefined =
					window.AudioContext ||
					((window as unknown as { webkitAudioContext: typeof AudioContext })
						.webkitAudioContext as unknown as typeof AudioContext);

				if (!audioContextConstructor) {
					throw new Error('AudioContext not supported');
				}

				const audioContext = new audioContextConstructor();

				if (audioContext.state === 'suspended') {
					await audioContext.resume();
				}

				update((state) => ({ ...state, isPermitted: true }));
				return true;
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Failed to initialize audio';
				update((state) => ({ ...state, isPermitted: false, error: errorMessage }));
				return false;
			}
		},

		reset: () => {
			set(initialState);
		}
	};
}

export const audioPermissionsStore = createAudioPermissionsStore();
