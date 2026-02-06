<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements'
	import { cn } from './shadcn/utils'

	let { children, ...rest }: HTMLButtonAttributes = $props()
</script>

<button
	{...rest}
	class={cn('cursor-pointer rounded border bg-secondary p-1 hover:bg-transparent', rest.class)}
>
	{@render children?.()}
</button>
