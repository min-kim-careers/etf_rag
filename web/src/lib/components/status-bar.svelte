<script lang="ts">
	import Button from '$lib/shadcn/components/ui/button/button.svelte'
	import { Switch } from '$lib/shadcn/components/ui/switch'
	import { cn } from '$lib/shadcn/utils'
	import type { Provider } from '$lib/utils/langchain/config'
	import { onMount } from 'svelte'

	let {
		handleClear,
		setProvider
	}: { handleClear: () => void; setProvider: (p: Provider) => void } = $props()

	let localMode = $state(false)

	onMount(() => {
		const _localMode = localStorage.getItem('localMode')
		if (_localMode) localMode = JSON.parse(_localMode)
	})

	$effect(() => {
		if (localMode) {
			setProvider('local')
			localStorage.setItem('localMode', 'true')
		} else {
			setProvider('cloud')
			localStorage.setItem('localMode', 'false')
		}
	})
</script>

<div class="flex w-full items-center justify-between border-b px-2 py-1 text-sm">
	<span class="flex items-center space-x-2">
		<span class={cn('transition-opacity duration-200', localMode && 'opacity-50')}>Cloud</span>

		<Switch bind:checked={localMode} class="data-unchecked:bg-primary" />

		<span class={cn('transition-opacity duration-200', !localMode && 'opacity-50')}> Local </span>
	</span>

	<span><Button class="h-6" variant="ghost" onclick={handleClear}>Clear</Button></span>
</div>
