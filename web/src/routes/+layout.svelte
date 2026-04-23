<script lang="ts">
	import favicon from '$lib/assets/favicon.svg'
	import { APP_DATA } from '$lib/constants/app_data'
	import '$src/app.css'
	import { Toaster } from 'svelte-french-toast'

	let { children } = $props()
</script>

<svelte:head>
	<title>{APP_DATA.title}</title>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}

<Toaster toastOptions={{ duration: 1500 }} />
