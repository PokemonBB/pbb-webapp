<script lang="ts">
	interface Props {
		text: string;
		children: any;
	}

	let { text, children }: Props = $props();

	let showTooltip = $state(false);

	function handleMouseEnter() {
		showTooltip = true;
	}

	function handleMouseLeave() {
		showTooltip = false;
	}
</script>

{@render children?.({
	onmouseenter: handleMouseEnter,
	onmouseleave: handleMouseLeave,
	onmouseover: handleMouseEnter,
	onmouseout: handleMouseLeave,
	onfocus: handleMouseEnter,
	onblur: handleMouseLeave
})}

<div class="tooltip-wrapper" class:show={showTooltip}>
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
		top: 100%;
		left: 50%;
		margin-left: -5px;
		border-width: 5px;
		border-style: solid;
		border-color: var(--bg-primary) transparent transparent transparent;
	}
</style>
