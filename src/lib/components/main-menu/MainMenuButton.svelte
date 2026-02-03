<script lang="ts">
	import Icon from '$lib/components/common/utils/Icon.svelte';
	import ToolTip from '$lib/components/common/utils/ToolTip.svelte';

	interface Props {
		icon: string;
		onclick: () => void;
		active?: boolean;
		disabled?: boolean;
		loading?: boolean;
		hoverClass?: string;
		tooltip?: string;
	}

	let {
		icon,
		onclick,
		active = false,
		disabled = false,
		loading = false,
		hoverClass = 'hover:bg-gray-100 dark:hover:bg-gray-700',
		tooltip = ''
	}: Props = $props();
</script>

{#if tooltip}
	<ToolTip text={tooltip} position="right">
		{#snippet children(handlers: any)}
			<button
				class="flex w-full cursor-pointer items-center justify-center rounded-lg p-3 transition-colors {hoverClass} {active
					? 'active-button'
					: ''} {disabled ? 'disabled:cursor-not-allowed disabled:opacity-50' : ''}"
				style="color: var(--text-primary);"
				{onclick}
				{disabled}
				{...handlers}
			>
				<Icon name={icon as any} size="medium" />
			</button>
		{/snippet}
	</ToolTip>
{:else}
	<button
		class="flex w-full cursor-pointer items-center justify-center rounded-lg p-3 transition-colors {hoverClass} {active
			? 'active-button'
			: ''} {disabled ? 'disabled:cursor-not-allowed disabled:opacity-50' : ''}"
		style="color: var(--text-primary);"
		{onclick}
		{disabled}
	>
		<Icon name={icon as any} size="medium" />
	</button>
{/if}
