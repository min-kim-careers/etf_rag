<script lang="ts">
	let { children } = $props()
</script>

<div class="flex min-h-screen min-w-screen items-center justify-center">
	<div class="flex h-[480px] w-[360px] flex-col items-center justify-center rounded border">
		{@render children?.()}
	</div>
</div>
