<script lang="ts">
	import {
		notificationStore,
		type Notification,
		type NotificationType
	} from '$lib/stores/notifications';
	import Icon from '../utils/Icon.svelte';
	import { playSound } from '$lib/utils/audioPlayer';

	interface Props {
		notification: Notification;
	}

	let { notification }: Props = $props();

	let isClosing = $state(false);

	async function playNotificationSound() {
		await playSound('SOUNDS/notification.mp3', 0.5);
	}

	function closeNotification() {
		isClosing = true;
		setTimeout(() => {
			notificationStore.remove(notification.id);
		}, 300);
	}

	function handleClick() {
		if (notification.isClickable && notification.onClick) {
			notification.onClick();
		}
	}

	function getIconName(
		type: NotificationType
	): 'notification' | 'alert' | 'check-box' | 'info-box' {
		switch (type) {
			case 'notification':
				return 'notification';
			case 'error':
				return 'alert';
			case 'warning':
				return 'alert';
			case 'success':
				return 'check-box';
			case 'info':
			default:
				return 'info-box';
		}
	}

	$effect(() => {
		playNotificationSound();
	});
</script>

{#if notification.isClickable}
	<button
		type="button"
		class="notification notification-{notification.type}"
		class:closing={isClosing}
		onclick={handleClick}
	>
		<div class="notification-content" role="alert" aria-live="polite">
			<Icon name={getIconName(notification.type)} size="small" class="notification-icon" />
			<span class="notification-text">{notification.message}</span>
		</div>
		<div
			class="notification-close"
			role="button"
			tabindex="0"
			aria-label="Close notification"
			onclick={(e) => {
				e.stopPropagation();
				closeNotification();
			}}
			onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.stopPropagation();
					closeNotification();
				}
			}}
		>
			<Icon name="cross" size="small" />
		</div>
	</button>
{:else}
	<div
		class="notification notification-{notification.type}"
		class:closing={isClosing}
		role="alert"
		aria-live="polite"
	>
		<div class="notification-content">
			<Icon name={getIconName(notification.type)} size="small" class="notification-icon" />
			<span class="notification-text">{notification.message}</span>
		</div>
		<button
			type="button"
			class="notification-close"
			aria-label="Close notification"
			onclick={closeNotification}
		>
			<Icon name="cross" size="small" />
		</button>
	</div>
{/if}

<style>
	.notification {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 16px;
		border-radius: 8px;
		border-left: 4px solid;
		backdrop-filter: blur(10px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		margin-bottom: 12px;
		animation: slideIn 0.3s ease-out;
		transition: all 0.3s ease;
		cursor: default;
		background: none;
		border: none;
		text-align: left;
		width: 100%;
		padding: 12px 16px;
	}

	.notification[type='button'] {
		cursor: pointer;
	}

	.notification[type='button']:hover {
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
		transform: translateY(-2px);
	}

	.notification.closing {
		animation: slideOut 0.3s ease-out forwards;
		opacity: 0;
	}

	.notification-content {
		display: flex;
		align-items: center;
		gap: 12px;
		flex: 1;
		min-width: 0;
	}

	.notification-icon {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.notification-text {
		flex: 1;
		font-size: 14px;
		line-height: 1.5;
		word-break: break-word;
	}

	.notification-close {
		flex-shrink: 0;
		background: transparent;
		border: none;
		color: inherit;
		cursor: pointer;
		padding: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		transition: all 0.2s ease;
		margin-left: 12px;
	}

	.notification-close:hover {
		background: color-mix(in oklab, currentColor 10%, transparent);
	}

	button.notification-close {
		cursor: pointer;
	}

	.notification-info {
		background: color-mix(in oklab, var(--notification-info-bg) 15%, var(--bg-secondary));
		color: var(--notification-info-text);
		border-left-color: var(--notification-info-border);
	}

	.notification-success {
		background: color-mix(in oklab, var(--notification-success-bg) 15%, var(--bg-secondary));
		color: var(--notification-success-text);
		border-left-color: var(--notification-success-border);
	}

	.notification-warning {
		background: color-mix(in oklab, var(--notification-warning-bg) 15%, var(--bg-secondary));
		color: var(--notification-warning-text);
		border-left-color: var(--notification-warning-border);
	}

	.notification-error {
		background: color-mix(in oklab, var(--notification-error-bg) 15%, var(--bg-secondary));
		color: var(--notification-error-text);
		border-left-color: var(--notification-error-border);
	}

	.notification-notification {
		background: color-mix(in oklab, var(--notification-alert-bg) 15%, var(--bg-secondary));
		color: var(--notification-alert-text);
		border-left-color: var(--notification-alert-border);
	}

	@keyframes slideIn {
		from {
			transform: translateX(400px);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}

	@keyframes slideOut {
		from {
			transform: translateX(0);
			opacity: 1;
		}
		to {
			transform: translateX(400px);
			opacity: 0;
		}
	}
</style>
