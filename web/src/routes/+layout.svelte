<script lang="ts">
	import favicon from '$lib/assets/favicon.svg'
	import { APP_DATA } from '$lib/constants/app-data'
	import '../app.css'

	let { children } = $props()
</script>

<svelte:head>
	<title>{APP_DATA.title}</title>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="relative flex min-h-screen min-w-screen flex-col items-center justify-center">
	{@render children?.()}
</div>
