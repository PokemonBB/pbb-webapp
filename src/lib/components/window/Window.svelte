<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import { globalZIndex } from './zindex';
	import Icon from '$lib/components/common/Icon.svelte';

	interface Props {
		left?: number;
		top?: number;
		title?: string;
		icon?: string;
		visible?: boolean;
		width?: number;
		height?: number;
		minWidth?: number;
		minHeight?: number;
		class?: string;
		style?: string;
		maximized?: boolean;
	}

	let {
		left = 0,
		top = 0,
		title = '',
		icon = '',
		visible = true,
		width = 640,
		height = 400,
		minWidth = 320,
		minHeight = 200,
		class: className = '',
		style: inlineStyle = '',
		maximized = false,
		children
	}: Props & { children?: any } = $props();

	const dispatch = createEventDispatcher<{
		close: void;
		positionChange: { left: number; top: number };
	}>();

	const MAIN_MENU_WIDTH = 64;

	let moving = $state(false);
	let element: HTMLElement | null = $state(null);
	let zIndex = $state($globalZIndex);
	let isMaximized = $state(maximized);

	let savedPosition = $state<{
		left: number;
		top: number;
		width: number;
		height: number;
	} | null>(null);

	onMount(() => {
		if (isMaximized) {
			maximizeWindow();
		} else if (left === 0 && top === 0 && element) {
			const rect = element.getBoundingClientRect();
			left = Math.max(MAIN_MENU_WIDTH, (window.innerWidth - rect.width) / 2);
			top = Math.max(0, (window.innerHeight - rect.height) / 2);
		}
	});

	function bringToFront() {
		globalZIndex.update((n) => n + 1);
		zIndex = $globalZIndex;
	}

	function onMouseDown(e: MouseEvent) {
		e.stopPropagation();
		if (!isMaximized) {
			moving = true;
		}
		bringToFront();
	}

	function onWindowClick() {
		bringToFront();
	}

	let resizing = $state<null | {
		edge: string;
		startX: number;
		startY: number;
		startLeft: number;
		startTop: number;
		startW: number;
		startH: number;
	}>(null);

	function onMouseMove(e: MouseEvent) {
		if (moving) {
			left += e.movementX;
			top += e.movementY;
			if (top < 0) top = 0;
			const maxLeft = Math.max(0, window.innerWidth - width);
			const maxTop = Math.max(0, window.innerHeight - height);
			if (left < 0) left = 0;
			if (left > maxLeft) left = maxLeft;
			if (top > maxTop) top = maxTop;
			dispatch('positionChange', { left, top });
		}

		if (resizing) {
			const dx = e.clientX - resizing.startX;
			const dy = e.clientY - resizing.startY;

			let newLeft = resizing.startLeft;
			let newTop = resizing.startTop;
			let newW = resizing.startW;
			let newH = resizing.startH;

			if (resizing.edge.includes('e')) newW = Math.max(minWidth, resizing.startW + dx);
			if (resizing.edge.includes('s')) newH = Math.max(minHeight, resizing.startH + dy);
			if (resizing.edge.includes('w')) {
				newW = Math.max(minWidth, resizing.startW - dx);
				newLeft = resizing.startLeft + dx;
				if (newW === minWidth) newLeft = resizing.startLeft + (resizing.startW - minWidth);
			}
			if (resizing.edge.includes('n')) {
				const proposedTop = resizing.startTop + dy;
				if (proposedTop < 0) {
					const dyClamped = -resizing.startTop;
					newH = Math.max(minHeight, resizing.startH - dyClamped);
					newTop = 0;
				} else {
					newH = Math.max(minHeight, resizing.startH - dy);
					newTop = proposedTop;
					if (newH === minHeight) newTop = resizing.startTop + (resizing.startH - minHeight);
				}
			}

			// Clamp to viewport on right and bottom
			const viewportW = window.innerWidth;
			const viewportH = window.innerHeight;
			if (newLeft + newW > viewportW) {
				newW = Math.max(minWidth, viewportW - newLeft);
			}
			if (newTop + newH > viewportH) {
				newH = Math.max(minHeight, viewportH - newTop);
			}
			// Clamp to viewport on left
			if (newLeft < 0) {
				const reduce = -newLeft;
				newLeft = 0;
				newW = Math.max(minWidth, newW - reduce);
			}
			// Clamp to top already handled above, but ensure non-negative
			if (newTop < 0) {
				newH = Math.max(minHeight, newH + newTop); // newTop negative reduces height
				newTop = 0;
			}

			left = newLeft;
			top = newTop;
			width = newW;
			height = newH;
		}
	}

	function onMouseUp() {
		moving = false;
		resizing = null;
	}

	function maximizeWindow() {
		if (!isMaximized) {
			savedPosition = { left, top, width, height };
			left = MAIN_MENU_WIDTH;
			top = 0;
			width = window.innerWidth - MAIN_MENU_WIDTH;
			height = window.innerHeight;
			isMaximized = true;
		}
	}

	function restoreWindow() {
		if (isMaximized && savedPosition) {
			left = savedPosition.left;
			top = savedPosition.top;
			width = savedPosition.width;
			height = savedPosition.height;
			isMaximized = false;
		}
	}

	function toggleMaximize(e: MouseEvent) {
		e.stopPropagation();
		if (isMaximized) {
			restoreWindow();
		} else {
			maximizeWindow();
		}
	}

	function closeWindow(e: MouseEvent) {
		e.stopPropagation();
		visible = false;
		dispatch('close');
	}

	function startResize(edge: string, e: MouseEvent) {
		e.stopPropagation();
		if (isMaximized) return;
		bringToFront();
		resizing = {
			edge,
			startX: e.clientX,
			startY: e.clientY,
			startLeft: left,
			startTop: top,
			startW: width,
			startH: height
		};
	}
</script>

{#if visible}
	<div
		bind:this={element}
		style="left: {left}px; top: {top}px; z-index: {zIndex}; width: {width}px; height: {height}px; {inlineStyle}"
		class="window {className}"
		role="dialog"
		tabindex="0"
		onclick={onWindowClick}
		onkeydown={(e) => e.key === 'Enter' && onWindowClick()}
	>
		<div class="titlebar" role="button" tabindex="0" onmousedown={onMouseDown}>
			<div class="title-content">
				{#if icon}
					<Icon name={icon as any} size="small" />
				{/if}
				<span>{title}</span>
			</div>
			<div class="titlebar-buttons">
				<button
					type="button"
					class="titlebar-button"
					aria-label={isMaximized ? 'Restore window' : 'Maximize window'}
					onclick={toggleMaximize}
				>
					<Icon name={isMaximized ? 'restore' : 'maximize'} size="small" />
				</button>
				<button
					type="button"
					class="titlebar-button close"
					aria-label="Close window"
					onclick={closeWindow}
				>
					<Icon name="cross" size="small" />
				</button>
			</div>
		</div>
		<div class="content">
			{@render children?.()}
		</div>

		{#if !isMaximized}
			<button
				type="button"
				class="handle n"
				aria-label="Resize north"
				onmousedown={(e) => startResize('n', e)}
			></button>
			<button
				type="button"
				class="handle e"
				aria-label="Resize east"
				onmousedown={(e) => startResize('e', e)}
			></button>
			<button
				type="button"
				class="handle s"
				aria-label="Resize south"
				onmousedown={(e) => startResize('s', e)}
			></button>
			<button
				type="button"
				class="handle w"
				aria-label="Resize west"
				onmousedown={(e) => startResize('w', e)}
			></button>
			<button
				type="button"
				class="handle ne"
				aria-label="Resize north-east"
				onmousedown={(e) => startResize('ne', e)}
			></button>
			<button
				type="button"
				class="handle nw"
				aria-label="Resize north-west"
				onmousedown={(e) => startResize('nw', e)}
			></button>
			<button
				type="button"
				class="handle se"
				aria-label="Resize south-east"
				onmousedown={(e) => startResize('se', e)}
			></button>
			<button
				type="button"
				class="handle sw"
				aria-label="Resize south-west"
				onmousedown={(e) => startResize('sw', e)}
			></button>
		{/if}
	</div>
{/if}

<svelte:window onmouseup={onMouseUp} onmousemove={onMouseMove} />

<style>
	.window {
		position: fixed;
		background: var(--bg-secondary);
		color: var(--text-primary);
		border: 1px solid var(--border-primary);
		border-radius: 8px;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
		user-select: none;
		overflow: hidden;
	}

	.titlebar {
		padding: 8px 10px;
		background: var(--bg-tertiary);
		border-bottom: 1px solid var(--border-primary);
		cursor: move;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-radius: 8px 8px 0 0;
	}

	.title-content {
		display: flex;
		align-items: center;
		gap: 8px;
		flex: 1;
		min-width: 0;
	}

	.title-content span {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.titlebar-buttons {
		display: flex;
		gap: 4px;
		align-items: center;
	}

	.titlebar-button {
		cursor: pointer;
		color: var(--text-primary);
		background: transparent;
		border: none;
		width: 28px;
		height: 28px;
		border-radius: 6px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.titlebar-button:hover {
		background: color-mix(in oklab, var(--text-primary) 10%, transparent);
	}

	.titlebar-button.close:hover {
		color: var(--game-red);
		background: color-mix(in oklab, var(--red) 20%, transparent);
	}

	.content {
		padding: 12px;
		height: calc(100% - 38px);
		/* Allow text selection and inputs to behave normally inside the window */
		user-select: text;
	}

	/* resize handles */
	.handle {
		position: absolute;
		background: transparent;
		border: none;
		padding: 0;
		margin: 0;
		outline: none;
	}
	.handle.n {
		top: -2px;
		left: 8px;
		right: 8px;
		height: 6px;
		cursor: ns-resize;
	}
	.handle.s {
		bottom: -2px;
		left: 8px;
		right: 8px;
		height: 6px;
		cursor: ns-resize;
	}
	.handle.e {
		right: -2px;
		top: 8px;
		bottom: 8px;
		width: 6px;
		cursor: ew-resize;
	}
	.handle.w {
		left: -2px;
		top: 8px;
		bottom: 8px;
		width: 6px;
		cursor: ew-resize;
	}
	.handle.ne {
		right: -2px;
		top: -2px;
		width: 10px;
		height: 10px;
		cursor: nesw-resize;
	}
	.handle.nw {
		left: -2px;
		top: -2px;
		width: 10px;
		height: 10px;
		cursor: nwse-resize;
	}
	.handle.se {
		right: -2px;
		bottom: -2px;
		width: 10px;
		height: 10px;
		cursor: nwse-resize;
	}
	.handle.sw {
		left: -2px;
		bottom: -2px;
		width: 10px;
		height: 10px;
		cursor: nesw-resize;
	}
</style>
