export type NotificationEventType =
	| 'notification'
	| 'info'
	| 'warning'
	| 'error'
	| 'success';

export interface NotificationEventPayload {
	id: string;
	message: string;
	type: NotificationEventType;
	createdAt: string;
}
