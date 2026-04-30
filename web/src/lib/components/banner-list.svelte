<script lang="ts">
	import Banner from '$lib/components/banner.svelte'

	let { meta, rateLimited } = $props()
</script>

<div class="sticky top-0 space-y-2">
	{#if rateLimited}
		<Banner>
			<span
				>You have {meta.remainingLimit > 0 ? meta.remainingLimit : '...'} messages remaining</span
			></Banner
		>
	{/if}

	<Banner style="bg-gray-100"
		><span>Your history is stored locally within your browser only.</span></Banner
	>
</div>
