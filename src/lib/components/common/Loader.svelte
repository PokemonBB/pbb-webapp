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
	<svg class="pokeball" width={actualSize} height={actualSize} viewBox="0 0 100 100">
		<defs>
			<clipPath id="top-clip">
				<rect x="0" y="0" width="100" height="50" />
			</clipPath>
		</defs>
		<circle class="ball" cx="50" cy="50" r="47" fill="white" stroke="black" stroke-width="2" />
		<circle class="top-half" cx="50" cy="50" r="46" fill="red" clip-path="url(#top-clip)" />
		<rect class="middle-line" x="2" y="48" width="95" height="4" fill="black" />
		<circle
			class="button-outline"
			cx="50"
			cy="50"
			r="15"
			fill="white"
			stroke="white"
			stroke-width="1"
		/>
		<circle class="button" cx="50" cy="50" r="8" fill="white" stroke="white" stroke-width="1" />
		<circle
			class="button-outline"
			cx="50"
			cy="50"
			r="15"
			fill="none"
			stroke="black"
			stroke-width="4"
		/>
		<circle
			class="button-outline"
			cx="50"
			cy="50"
			r="8"
			fill="none"
			stroke="black"
			stroke-width="1"
		/>
	</svg>
	<!-- <svg class="shadow-svg" width={size} height={size+80} viewBox="0 0 100 100">
    <ellipse class="shadow" cx="60" cy="95" rx="35" ry="10" fill="#373737" />
  </svg> -->
</div>

<style>
	.pokeball {
		animation: shake 1.25s cubic-bezier(0.36, 0.07, 0.19, 0.97) infinite;
		overflow: visible;
	}

	.button {
		animation: blink 0.5s alternate infinite;
	}

	/* .shadow {
    opacity: 0.5;
    animation: shadow-move 1.25s infinite;
  } */

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
			fill: #eee;
		}
		to {
			fill: #e74c3c;
		}
	}

	/* @keyframes shadow-move {
    from { transform: scale(1); }
    to { transform: scale(1.1); }
  } */
</style>
