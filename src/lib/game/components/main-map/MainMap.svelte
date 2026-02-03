<script lang="ts">
	import MapSVG from './Map.svg';
	import CityMarker from './CityMarker.svelte';

	export let clickCorgo = () => {};
	export let clickLanzada = () => {};
	export let clickToja = () => {};
	export let clickArdia = () => {};
	export let clickSiradella = () => {};
	export let clickBateria = () => {};
	export let clickPipas = () => {};

	export let size = '100%';
	let originalWidth = 4961;
	let originalHeight = 3508;
	let width: string;
	let height: string;

	$: {
		width = size;
		height = size;
	}
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	{width}
	{height}
	viewBox="0 0 4961 3508"
	style="background-color: var(--sea);"
>
	<image href={MapSVG} width={originalWidth} height={originalHeight} />

	<!-- Paths -->
	<rect x="3425" y="575" width="50" height="550" opacity="0.7" fill="#e0a000" />
	<rect x="3425" y="1200" width="50" height="500" opacity="0.7" fill="#e0a000" />
	<rect x="3475" y="950" width="450" height="50" opacity="0.7" fill="#e0a000" />
	<rect x="3875" y="650" width="50" height="300" opacity="0.7" fill="#e0a000" />
	<rect x="3925" y="650" width="100" height="50" opacity="0.7" fill="#e0a000" />
	<rect x="3225" y="525" width="250" height="50" opacity="0.7" fill="#e0a000" />
	<rect x="2725" y="525" width="500" height="50" opacity="0.7" fill="#e0a000" />
	<rect x="2675" y="525" width="50" height="700" opacity="0.7" fill="#e0a000" />
	<rect x="2225" y="1175" width="450" height="50" opacity="0.7" fill="#e0a000" />
	<rect x="2225" y="1225" width="50" height="300" opacity="0.7" fill="#e0a000" />
	<rect x="2575" y="1225" width="50" height="475" opacity="0.7" fill="#e0a000" />
	<rect x="1800" y="1475" width="425" height="50" opacity="0.7" fill="#e0a000" />
	<rect x="1775" y="1500" width="50" height="575" opacity="0.7" fill="#e0a000" />
	<rect x="1200" y="2075" width="1725" height="50" opacity="0.7" fill="#e0a000" />
	<rect x="2925" y="1900" width="50" height="225" opacity="0.7" fill="#e0a000" />
	<rect x="3225" y="1700" width="250" height="50" opacity="0.7" fill="#e0a000" />
	<rect x="3175" y="1700" width="50" height="200" opacity="0.7" fill="#e0a000" />
	<rect x="2975" y="1900" width="250" height="50" opacity="0.7" fill="#e0a000" />
	<rect x="2825" y="2125" width="50" height="575" opacity="0.7" fill="#e0a000" />
	<rect x="1150" y="2075" width="50" height="250" opacity="0.7" fill="#e0a000" />
	<rect x="700" y="2325" width="500" height="50" opacity="0.7" fill="#e0a000" />

	<CityMarker x={3200} y={500} onClick={clickCorgo} name="Corgo" />

	<CityMarker x={4020} y={620} onClick={clickToja} name="Toja" active={false} />

	<CityMarker x={3400} y={1100} onClick={clickArdia} name="Ardia" active={false} />

	<CityMarker x={2550} y={1700} onClick={clickSiradella} name="Siradella" active={false} />

	<CityMarker x={650} y={2300} onClick={clickBateria} name="Bateria" active={false} />

	<CityMarker x={1750} y={1450} onClick={clickPipas} name="Pipas" active={false} />

	<CityMarker x={2800} y={2600} onClick={clickLanzada} name="Lanzada" active={false} />
</svg>
