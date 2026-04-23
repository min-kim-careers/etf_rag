<script lang="ts">
	import Header from '$lib/components/header.svelte'

	let { data, children } = $props()
</script>

<div class="flex min-h-screen min-w-screen flex-col items-center justify-between">
	<div class="w-full">
		<Header {...data} />
	</div>

	<div class="flex h-[720px] w-11/12 flex-col justify-center rounded border sm:w-3/4">
		{@render children?.()}
	</div>

	<div></div>
</div>
