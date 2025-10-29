import { writable } from 'svelte/store';

export type NotificationType = 'notification' | 'info' | 'warning' | 'error' | 'success';

export interface Notification {
	id: string;
	message: string;
	type: NotificationType;
	duration: number;
	isClickable: boolean;
	onClick?: () => void;
}

interface NotificationState {
	notifications: Notification[];
}

const defaultState: NotificationState = {
	notifications: []
};

function createNotificationStore() {
	const { subscribe, update } = writable<NotificationState>(defaultState);

	let notificationId = 0;

	return {
		subscribe,
		add: (
			message: string,
			type: NotificationType = 'info',
			isClickable: boolean = false,
			onClick?: () => void,
			duration: number = 5000
		): string => {
			const id = `notification-${++notificationId}`;

			update((state) => ({
				...state,
				notifications: [
					...state.notifications,
					{
						id,
						message,
						type,
						duration,
						isClickable,
						onClick
					}
				]
			}));

			if (duration > 0) {
				setTimeout(() => {
					notificationStore.remove(id);
				}, duration);
			}

			return id;
		},
		remove: (id: string) => {
			update((state) => ({
				...state,
				notifications: state.notifications.filter((n) => n.id !== id)
			}));
		},
		clear: () => {
			update(() => defaultState);
		}
	};
}

export const notificationStore = createNotificationStore();
