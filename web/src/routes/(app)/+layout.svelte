<script lang="ts">
	import Header from '$lib/components/header.svelte'

	let { data, children } = $props()

	const { username } = data
</script>

<div class="flex min-h-screen min-w-screen flex-col items-center justify-between px-2">
	<div class="w-full">
		<Header {username} />
	</div>

	<div class="flex h-[720px] max-w-5xl flex-col justify-center rounded border sm:w-full">
		{@render children?.()}
	</div>

	<div></div>
</div>
