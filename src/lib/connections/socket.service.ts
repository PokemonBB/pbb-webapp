import { io, type Socket } from 'socket.io-client';
import { config } from '$lib/config/environment';
import { notificationStore } from '$lib/stores/notifications';
import { NOTIFICATION } from './events';
import type { NotificationEventPayload } from './events';

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
		notificationStore.add(payload.message, 'notification');
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
