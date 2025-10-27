import { writable } from 'svelte/store';

export type Location = 'MainMap' | 'Lobby1';

export const locationStore = writable<Location>('MainMap');

export const locationActions = {
	setLocation: (location: Location) => {
		locationStore.set(location);
	},

	goToMainMap: () => {
		locationStore.set('MainMap');
	},

	goToLobby1: () => {
		locationStore.set('Lobby1');
	}
};
