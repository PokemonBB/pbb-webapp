<script lang="ts">
	interface Props {
		text: string;
		children: any;
		position?: 'top' | 'bottom' | 'left' | 'right';
	}

	let { text, children, position = 'top' }: Props = $props();

	let showTooltip = $state(false);
	let tooltipElement: HTMLDivElement | null = $state(null);
	let triggerElement: HTMLDivElement | null = $state(null);
	let tooltipStyle = $state('');

	function updateTooltipPosition() {
		if (!tooltipElement || !triggerElement) return;

		const triggerRect = triggerElement.getBoundingClientRect();
		const tooltipRect = tooltipElement.getBoundingClientRect();

		let top: number = 0;
		let left: number = 0;
		const offset = 8;

		switch (position) {
			case 'right':
				top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
				left = triggerRect.right + offset;
				break;
			case 'left':
				top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
				left = triggerRect.left - tooltipRect.width - offset;
				break;
			case 'bottom':
				top = triggerRect.bottom + offset;
				left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
				break;
			case 'top':
			default:
				top = triggerRect.top - tooltipRect.height - offset;
				left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
				break;
		}

		tooltipStyle = `top: ${top}px; left: ${left}px;`;
	}

	function handleMouseEnter() {
		showTooltip = true;
		setTimeout(() => updateTooltipPosition(), 0);
	}

	function handleMouseLeave() {
		showTooltip = false;
	}

	function handleMouseMove() {
		if (showTooltip) {
			updateTooltipPosition();
		}
	}
</script>

<div bind:this={triggerElement} onmousemove={handleMouseMove} role="tooltip">
	{@render children?.({
		onmouseenter: handleMouseEnter,
		onmouseleave: handleMouseLeave,
		onmouseover: handleMouseEnter,
		onmouseout: handleMouseLeave,
		onfocus: handleMouseEnter,
		onblur: handleMouseLeave
	})}
</div>

<div
	bind:this={tooltipElement}
	class="tooltip-wrapper"
	class:show={showTooltip}
	class:position-top={position === 'top'}
	class:position-bottom={position === 'bottom'}
	class:position-left={position === 'left'}
	class:position-right={position === 'right'}
	style={tooltipStyle}
>
	<span class="tooltip-text">{text}</span>
</div>

<style>
	.tooltip-wrapper {
		position: fixed;
		pointer-events: none;
		z-index: 1000;
	}

	.tooltip-text {
		visibility: hidden;
		width: max-content;
		max-width: 200px;
		background-color: var(--bg-primary);
		color: var(--text-primary);
		text-align: center;
		border-radius: 6px;
		padding: 8px 12px;
		opacity: 0;
		transition: opacity 0.3s;
		border: 1px solid var(--border-primary);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		font-size: 14px;
		white-space: nowrap;
		display: inline-block;
	}

	.tooltip-wrapper.show .tooltip-text {
		visibility: visible;
		opacity: 1;
	}

	.tooltip-text::after {
		content: '';
		position: absolute;
		border-width: 5px;
		border-style: solid;
	}

	.tooltip-wrapper.position-top .tooltip-text::after {
		bottom: -10px;
		left: 50%;
		margin-left: -5px;
		border-color: var(--bg-primary) transparent transparent transparent;
	}

	.tooltip-wrapper.position-bottom .tooltip-text::after {
		top: -10px;
		left: 50%;
		margin-left: -5px;
		border-color: transparent transparent var(--bg-primary) transparent;
	}

	.tooltip-wrapper.position-left .tooltip-text::after {
		right: -10px;
		top: 50%;
		margin-top: -5px;
		border-color: transparent transparent transparent var(--bg-primary);
	}

	.tooltip-wrapper.position-right .tooltip-text::after {
		left: -10px;
		top: 50%;
		margin-top: -5px;
		border-color: transparent var(--bg-primary) transparent transparent;
	}
</style>
