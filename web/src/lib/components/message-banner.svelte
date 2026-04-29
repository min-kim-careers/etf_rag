<script>
	import { cn } from '$lib/shadcn/utils'
	import X from '@lucide/svelte/icons/x'

	let { meta } = $props()

	let hideLimitBanner = $state(false)
	let hideTipBanner = $state(false)
</script>

<div class="sticky top-0 space-y-2">
	<div
		class={cn(
			'flex h-8 items-center justify-between rounded border bg-gray-200 p-1 text-center text-sm transition-all duration-300',
			hideLimitBanner && 'opacity-0'
		)}
	>
		<span></span>
		<span>You have {meta.remainingLimit > 0 ? meta.remainingLimit : '...'} messages remaining</span>
		<button onclick={() => (hideLimitBanner = true)}><X class="h-4" /></button>
	</div>

	<div
		class={cn(
			'flex h-8 items-center justify-between rounded border bg-gray-100 p-1 text-center text-sm transition-all duration-300',
			hideTipBanner && 'opacity-0'
		)}
	>
		<span></span>
		<span>Your history is stored locally within your browser only.</span>
		<button onclick={() => (hideTipBanner = true)}><X class="h-4" /></button>
	</div>
</div>
