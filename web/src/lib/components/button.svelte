<script lang="ts">
	import { cn } from '$lib/shadcn/utils'
	import type { HTMLButtonAttributes } from 'svelte/elements'

	let { children, variant, ...restProps }: HTMLButtonAttributes & Record<string, any> = $props()
</script>

<button
	{...restProps}
	class={cn(
		'cursor-pointer',
		restProps.class,
		restProps.disabled && 'cursor-not-allowed opacity-50'
	)}
>
	{@render children?.()}
</button>
