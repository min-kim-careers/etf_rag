<script lang="ts">
	import { cn } from '$lib/shadcn/utils'
	import X from '@lucide/svelte/icons/x'

	export let children,
		style = ''

	let flag = false
</script>

<div
	class={cn(
		'flex h-8 items-center justify-between rounded border bg-gray-200 p-1 text-center text-sm transition-all duration-300',
		flag && 'h-0 overflow-hidden border-0 p-0',
		style
	)}
>
	<span></span>
	{#if children}
		{@render children()}
	{/if}
	<button onclick={() => (flag = true)}><X class="h-4" /></button>
</div>
