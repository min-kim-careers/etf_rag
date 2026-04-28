<script>
	import { cn } from '$lib/shadcn/utils'
	import X from '@lucide/svelte/icons/x'

	let { hideLimitBanner, meta } = $props()
</script>

<div
	class={cn(
		'sticky top-0 -mb-6 flex h-8 items-center justify-between rounded border bg-gray-200 p-1 text-center text-sm transition-all duration-300',
		hideLimitBanner && 'opacity-0'
	)}
>
	<span></span>
	<span>You have {meta.remainingLimit > 0 ? meta.remainingLimit : '...'} messages remaining</span>
	<button onclick={() => (hideLimitBanner = true)}><X class="h-4" /></button>
</div>
