<script lang="ts">
	import Button from '$lib/shadcn/components/ui/button/button.svelte'
	import { Label } from '$lib/shadcn/components/ui/label'
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
		<Label
			for="switch"
			class={cn('transition-opacity duration-200', localMode ? 'opacity-50' : 'opacity-100')}
			>Cloud</Label
		>
		<Switch id="switch" bind:checked={localMode} />
		<Label
			for="switch"
			class={cn('transition-opacity duration-200', localMode ? 'opacity-100' : 'opacity-50')}
		>
			Local
		</Label>
	</span>

	<span><Button class="h-6" variant="ghost" onclick={handleClear}>Clear</Button></span>
</div>
