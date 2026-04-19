<script lang="ts">
	import Button from '$lib/components/button.svelte'
	import LoadingText from '$lib/components/loading-text.svelte'
	import { onMount } from 'svelte'
	import toast from 'svelte-french-toast'

	let { provider, handleClear } = $props()

	let pingInterval: ReturnType<typeof setInterval> | null
	let pingTries = $state(0)
	let pingExceeded = $derived(pingTries >= 3)

	onMount(() => {
		pingServer()
		pingInterval = setInterval(pingServer, 2000)

		return () => {
			if (pingInterval) clearInterval(pingInterval)
		}
	})

	function stopPinging() {
		if (pingInterval) {
			clearInterval(pingInterval)
			pingInterval = null
		}
	}

	let checking = false
	async function pingServer() {
		if (checking || pingExceeded) return
		checking = true

		try {
			const res = await fetch('/api/chat/ping')
			const data = await res.json()
			pingTries += 1

			if (data.ok) {
				provider = 'local'
				stopPinging()
				return
			}

			if (pingExceeded) stopPinging()
		} catch (error) {
			toast('Something went wrong.')
			stopPinging()
		} finally {
			checking = false
		}
	}
</script>

<div class="flex w-full items-center justify-between border-b px-2 py-1 text-sm">
	<span>
		{#if provider}
			Now using <span class="">"{provider}"</span>
		{:else if pingExceeded}
			Server offline (refresh to try again)
		{:else}
			<LoadingText text="Connecting" />
		{/if}
	</span>

	<span><Button onclick={handleClear}>Clear</Button></span>
</div>
