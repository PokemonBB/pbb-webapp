import { io, type Socket } from 'socket.io-client';
import { config } from '$lib/config/environment';
import { notificationStore } from '$lib/stores/notifications';
import { windowControlStore } from '$lib/stores/windowControl';
import { NOTIFICATION } from './events';
import type { NotificationEventPayload } from './events';

const ACTION_HANDLERS: Record<string, () => void> = {
	FRIEND_REQUEST_RECEIVED: () => windowControlStore.openFriendsWindow('received')
};

let socket: Socket | null = null;

function getSocketUrl(): string {
	const base = config.API_BASE_URL;
	try {
		const url = new URL(base);
		return url.origin;
	} catch {
		return base;
	}
}

function setupNotificationListener(sock: Socket): void {
	sock.on(NOTIFICATION, (payload: NotificationEventPayload) => {
		const handler = payload.action ? ACTION_HANDLERS[payload.action] : undefined;
		notificationStore.add(
			payload.message,
			payload.type,
			!!handler,
			handler,
			5000,
			payload.id
		);
	});
}

export const socketService = {
	connect(): void {
		if (typeof window === 'undefined' || socket) return;
		const url = getSocketUrl();
		socket = io(url, {
			withCredentials: true,
			autoConnect: true
		});
		socket.on('connect', () => {
			console.log('[Socket] Connected to', url);
		});
		socket.on('connect_error', (err) => {
			console.log('[Socket] Connection error:', err.message);
		});
		setupNotificationListener(socket);
	},

	disconnect(): void {
		if (socket) {
			socket.removeAllListeners();
			socket.disconnect();
			socket = null;
		}
	},

	get isConnected(): boolean {
		return socket?.connected ?? false;
	}
};
