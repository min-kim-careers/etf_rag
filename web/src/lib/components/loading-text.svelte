<script lang="ts">
	import { onMount } from 'svelte'

	let { text } = $props()

	let dots = $state('')
	let interval = null

	onMount(() => {
		interval = setInterval(() => {
			dots = '.'.repeat((dots.length + 1) % 4)
		}, 500)
	})
</script>

{text}{dots}
