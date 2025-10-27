<script lang="ts">
	interface Props {
		name?: string;
		x?: number;
		y?: number;
		width?: number;
		height?: number;
		fill?: string;
		desactiveFill?: string;
		active?: boolean;
		onClick?: () => void;
		onKeyDown?: (event: KeyboardEvent) => void;
	}

	let {
		name = '',
		x = 0,
		y = 0,
		width = 100,
		height = 100,
		fill = 'var(--game-red)',
		desactiveFill = 'grey',
		active = true,
		onClick = () => {},
		onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Enter' || event.key === ' ') {
				onClick();
			}
		}
	}: Props = $props();

	let showTooltip = $state(false);

	// Calcular ancho dinámicamente: 50px por carácter + padding
	const tooltipWidth = Math.max(300, name.length * 50 + 60);
	const tooltipHeight = 120;
</script>

<g
	role="presentation"
	onmouseenter={() => (showTooltip = true)}
	onmouseleave={() => (showTooltip = false)}
>
	<rect
		{x}
		{y}
		{width}
		{height}
		fill={active ? fill : desactiveFill}
		stroke="black"
		stroke-width="10"
		onclick={onClick}
		onkeydown={onKeyDown}
		tabindex="0"
		role="button"
		class={active ? 'city-active' : 'city-inactive'}
	/>

	{#if showTooltip}
		<foreignObject
			x={x + width / 2 - tooltipWidth / 2}
			y={y - 150}
			width={tooltipWidth}
			height={tooltipHeight}
		>
			<div class="tooltip-container" xmlns="http://www.w3.org/1999/xhtml">
				<span class="tooltip-text">{name}</span>
			</div>
		</foreignObject>
	{/if}
</g>

<style>
	rect {
		cursor: pointer;
		transition: fill 0.3s ease;
	}

	rect.city-active {
		cursor: pointer;
	}

	rect.city-active:hover {
		fill: #b5b5b5;
	}

	rect.city-inactive {
		cursor: not-allowed;
	}

	.tooltip-container {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--bg-primary);
		border: 1px solid var(--border-primary);
		border-radius: 25px;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
		padding: 16px;
		box-sizing: border-box;
		overflow: hidden;
	}

	.tooltip-text {
		color: var(--text-primary);
		font-size: 48px;
		font-weight: 600;
		text-align: center;
		display: block;
		word-wrap: break-word;
		overflow-wrap: break-word;
		word-break: break-word;
		line-height: 1.3;
		max-width: 100%;
	}
</style>
