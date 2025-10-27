<script lang="ts">
	type LoaderSize = 'small' | 'medium' | 'large' | 'custom';

	interface LoaderProps {
		size?: LoaderSize;
		customSize?: number;
	}

	export let size: LoaderSize = 'medium';
	export let customSize: number | undefined = undefined;

	$: if (size === 'custom' && (customSize === undefined || customSize <= 0)) {
		console.warn(
			'Loader: customSize must be provided and > 0 when size is custom. Falling back to medium.'
		);
		size = 'medium';
	}

	$: actualSize = (() => {
		if (size === 'custom' && customSize && customSize > 0) {
			return customSize;
		}

		const sizeMap: Record<Exclude<LoaderSize, 'custom'>, number> = {
			small: 75,
			medium: 100,
			large: 150
		};

		return sizeMap[size as Exclude<LoaderSize, 'custom'>] || sizeMap.medium;
	})();
</script>

<div class="pokeball-container">
	<svg
		class="pokeball"
		width={actualSize}
		height={actualSize}
		viewBox="0 0 32 32"
		shape-rendering="crispEdges"
	>
		<rect x="2" y="6" width="2" height="2" fill="#000" />
		<rect x="4" y="4" width="2" height="2" fill="#000" />
		<rect x="6" y="3" width="2" height="1" fill="#000" />
		<rect x="8" y="2" width="16" height="1" fill="#000" />
		<rect x="24" y="3" width="2" height="1" fill="#000" />
		<rect x="26" y="4" width="2" height="2" fill="#000" />
		<rect x="28" y="6" width="2" height="2" fill="#000" />
		<rect x="29" y="8" width="1" height="16" fill="#000" />
		<rect x="28" y="24" width="2" height="2" fill="#000" />
		<rect x="26" y="26" width="2" height="2" fill="#000" />
		<rect x="24" y="28" width="2" height="1" fill="#000" />
		<rect x="8" y="29" width="16" height="1" fill="#000" />
		<rect x="6" y="28" width="2" height="1" fill="#000" />
		<rect x="4" y="26" width="2" height="2" fill="#000" />
		<rect x="2" y="24" width="2" height="2" fill="#000" />
		<rect x="2" y="8" width="1" height="16" fill="#000" />

		<rect x="6" y="4" width="20" height="1" fill="var(--game-red)" />
		<rect x="8" y="3" width="16" height="1" fill="var(--game-red)" />
		<rect x="24" y="4" width="2" height="1" fill="var(--game-red)" />
		<rect x="4" y="6" width="22" height="2" fill="var(--game-red)" />
		<rect x="26" y="6" width="2" height="2" fill="var(--game-red)" />
		<rect x="3" y="8" width="1" height="6" fill="var(--game-red)" />
		<rect x="28" y="8" width="1" height="6" fill="var(--game-red)" />
		<rect x="6" y="5" width="20" height="1" fill="var(--game-red)" />
		<rect x="8" y="6" width="16" height="1" fill="var(--game-red)" />
		<rect x="6" y="7" width="20" height="1" fill="var(--game-red)" />
		<rect x="4" y="8" width="24" height="6" fill="var(--game-red)" />

		<rect x="3" y="14" width="1" height="1" fill="var(--game-red)" />
		<rect x="28" y="14" width="1" height="1" fill="var(--game-red)" />
		<rect x="2" y="14" width="28" height="1" fill="#000" />
		<rect x="2" y="15" width="28" height="2" fill="#000" />

		<rect x="3" y="17" width="1" height="7" fill="#fff" />
		<rect x="28" y="17" width="1" height="7" fill="#fff" />
		<rect x="4" y="17" width="24" height="7" fill="#fff" />
		<rect x="4" y="24" width="2" height="2" fill="#fff" />
		<rect x="26" y="24" width="2" height="2" fill="#fff" />
		<rect x="6" y="24" width="20" height="2" fill="#fff" />
		<rect x="6" y="26" width="2" height="1" fill="#fff" />
		<rect x="24" y="26" width="2" height="1" fill="#fff" />
		<rect x="8" y="26" width="16" height="1" fill="#fff" />
		<rect x="8" y="27" width="16" height="1" fill="#fff" />

		<rect x="12" y="12" width="8" height="1" fill="#000" />
		<rect x="11" y="13" width="1" height="6" fill="#000" />
		<rect x="20" y="13" width="1" height="6" fill="#000" />
		<rect x="12" y="19" width="8" height="1" fill="#000" />

		<rect class="button" x="12" y="13" width="8" height="6" fill="#fff" />

		<!-- <rect x="15" y="15" width="2" height="2" fill="#fff" /> -->
	</svg>
</div>

<style>
	.pokeball {
		animation: shake 1.25s cubic-bezier(0.36, 0.07, 0.19, 0.97) infinite;
		overflow: visible;
		image-rendering: pixelated;
		image-rendering: -moz-crisp-edges;
		image-rendering: crisp-edges;
	}

	.button {
		animation: blink 0.5s alternate infinite;
	}

	@keyframes shake {
		0%,
		100% {
			transform: translate(0, 0) rotate(0);
		}
		20% {
			transform: translate(-5px, 0) rotate(-10deg);
		}
		30% {
			transform: translate(5px, 0) rotate(10deg);
		}
		50% {
			transform: translate(-5px, 0) rotate(-5deg);
		}
		60% {
			transform: translate(5px, 0) rotate(5deg);
		}
	}

	@keyframes blink {
		from {
			fill: #fff;
		}
		to {
			fill: var(--game-red);
		}
	}
</style>
