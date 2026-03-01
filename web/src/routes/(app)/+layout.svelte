<script>
	import Button from '$lib/components/button.svelte'

	let { children } = $props()
</script>

<form method="POST" action="/signout">
	<Button class="absolute top-0 right-0 m-2 border-none bg-transparent text-sm">Sign out</Button>
</form>

{@render children?.()}
