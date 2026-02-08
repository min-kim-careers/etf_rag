<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements'
	import { cn } from './shadcn/utils'

	let { children, ...restProps }: HTMLButtonAttributes & Record<string, any> = $props()
</script>

<button
	{...restProps}
	class={cn(
		'cursor-pointer rounded border bg-secondary p-1 hover:bg-transparent',
		restProps.class,
		restProps.disabled && 'cursor-not-allowed opacity-50'
	)}
>
	{@render children?.()}
</button>
