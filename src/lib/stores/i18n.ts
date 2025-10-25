// This file is deprecated. Use userConfigStore instead.
// Keeping for backward compatibility during migration.

import { userConfigStore } from './userConfig';

export const i18nStore = {
	subscribe: userConfigStore.subscribe,
	setLanguage: userConfigStore.setLanguage,
	init: userConfigStore.init
};
