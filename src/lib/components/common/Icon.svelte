<script lang="ts">
	import { onMount } from 'svelte';

	type IconName =
		| 'user'
		| 'users'
		| 'user-plus'
		| 'user-minus'
		| 'gear'
		| 'log-out'
		| 'menu'
		| 'cross'
		| 'sun'
		| 'moon'
		| 'monitor'
		| 'flag-us'
		| 'flag-es'
		| 'maximize'
		| 'restore'
		| 'checkbox'
		| 'closebox';

	interface IconProps {
		name: IconName;
		size?: 'small' | 'medium' | 'large' | 'custom';
		customSize?: string;
		class?: string;
		style?: string;
	}

	let {
		name,
		size = 'medium',
		customSize,
		class: className = '',
		style: customStyle = ''
	}: IconProps = $props();

	let svgContent = $state('');
	let isLoading = $state(true);

	const sizeMap = {
		small: '16px',
		medium: '24px',
		large: '32px'
	};

	const actualSize = $derived(
		size === 'custom' ? customSize : sizeMap[size as keyof typeof sizeMap]
	);

	async function loadIcon(iconName: string) {
		isLoading = true;
		try {
			const response = await fetch(`/icons/${iconName}.svg`);
			if (response.ok) {
				svgContent = await response.text();
			} else {
				console.warn(`Icon "${iconName}" not found`);
				svgContent = '';
			}
		} catch (error) {
			console.error(`Error loading icon "${iconName}":`, error);
			svgContent = '';
		} finally {
			isLoading = false;
		}
	}

	$effect(() => {
		loadIcon(name);
	});

	$effect(() => {
		if (size === 'custom' && !customSize) {
			console.warn('Icon: customSize is required when size is "custom"');
		}
	});
</script>

{#if isLoading}
	<div
		class="animate-pulse rounded bg-gray-300 {className}"
		style="width: {actualSize}; height: {actualSize}; {customStyle}"
	></div>
{:else if svgContent}
	<div
		class="inline-flex items-center justify-center {className}"
		style="width: {actualSize}; height: {actualSize}; {customStyle}"
	>
		{@html svgContent}
	</div>
{:else}
	<div
		class="inline-flex items-center justify-center rounded bg-gray-200 {className}"
		style="width: {actualSize}; height: {actualSize}; {customStyle}"
	>
		<span class="text-xs text-gray-500">?</span>
	</div>
{/if}
