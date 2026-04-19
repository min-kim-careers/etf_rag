<script lang="ts">
	import Header from '$lib/components/header.svelte'

	let { data, children } = $props()
</script>

<div class="flex min-h-screen min-w-screen flex-col items-center justify-between">
	<div class="w-full">
		<Header {...data} />
	</div>

	<div class="flex h-[480px] w-[360px] flex-col justify-center rounded border">
		{@render children?.()}
	</div>

	<div></div>
</div>
