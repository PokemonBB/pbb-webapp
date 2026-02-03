import { writable } from 'svelte/store';

interface WindowControlState {
	openFriendsWindow?: {
		tab: string;
	};
}

const initialState: WindowControlState = {};

function createWindowControlStore() {
	const { subscribe, set, update } = writable<WindowControlState>(initialState);

	return {
		subscribe,

		openFriendsWindow: (tab: string = 'friends') => {
			update((state) => ({
				...state,
				openFriendsWindow: { tab }
			}));
		},

		reset: () => {
			set(initialState);
		}
	};
}

export const windowControlStore = createWindowControlStore();
