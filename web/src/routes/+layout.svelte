<script lang="ts">
	import { goto, invalidate } from '$app/navigation'
	import favicon from '$lib/assets/favicon.svg'
	import { Toaster } from '$lib/components/shadcn/components/ui/sonner'
	import { APP_DATA } from '$lib/constants/app-data'
	import { APP_ROUTES } from '$lib/constants/app-routes'
	import { onMount } from 'svelte'
	import '../app.css'

	let { children, data: _data } = $props()

	onMount(() => {
		const { data } = _data.supabase.auth.onAuthStateChange((_, _session) => {
			if (_data.session && _session?.access_token != _data.session.access_token) {
				invalidate('supabase:auth')
				goto(APP_ROUTES.auth.login)
			}
		})
		return () => data.subscription.unsubscribe()
	})
</script>

<svelte:head>
	<title>{APP_DATA.title}</title>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="relative flex min-h-screen min-w-screen flex-col items-center justify-center">
	<div class="flex h-[480px] w-[360px] flex-col items-center justify-center rounded border">
		{@render children?.()}
	</div>
</div>

<Toaster position="top-center" />
