<script lang="ts">
	import favicon from '$lib/assets/favicon.svg'
	import { APP_DATA } from '$lib/constants/app-data'
	import { Toaster } from '$lib/shadcn/components/ui/sonner'
	import '$src/app.css'

	let { children } = $props()
</script>

<svelte:head>
	<title>{APP_DATA.title}</title>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}

<Toaster position="top-center" />
