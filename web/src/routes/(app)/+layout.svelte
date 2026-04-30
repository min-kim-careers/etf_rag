<script lang="ts">
	import Header from '$lib/components/header.svelte'

	let { data, children } = $props()

	const { username } = data
</script>

<div class="flex h-screen w-screen flex-col items-center gap-4 px-2">
	<div class="w-full flex-shrink-0">
		<Header {username} />
	</div>

	<div class="flex min-h-0 w-full max-w-5xl flex-1 flex-col rounded border">
		{@render children?.()}
	</div>

	<div class="flex-shrink-0"></div>
</div>
