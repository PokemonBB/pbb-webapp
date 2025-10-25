// This file is deprecated. Use userConfigStore instead.
// Keeping for backward compatibility during migration.

import { userConfigStore } from './userConfig';

export const themeStore = {
	subscribe: userConfigStore.subscribe,
	setTheme: userConfigStore.setTheme,
	init: userConfigStore.init,
	toggleTheme: userConfigStore.toggleTheme
};
