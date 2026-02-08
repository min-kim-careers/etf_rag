<script lang="ts">
	import { goto } from '$app/navigation'
	import Button from '$lib/components/button.svelte'
	import { onMount } from 'svelte'
	import { toast } from 'svelte-sonner'
	import type { LayoutData } from '../app/$types'

	let { children, data } = $props()
	const { supabase }: LayoutData = data

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (!_session) goto('/auth/login')
		})
		return () => data.subscription.unsubscribe()
	})

	async function signout() {
		try {
			await supabase.auth.signOut()
			toast('Goodbye')
		} catch (error) {
			toast.error('Something went wrong')
		}
	}
</script>

<Button class="absolute top-0 right-0 m-2 border-none bg-transparent px-2 text-sm" onclick={signout}
	>Sign out</Button
>

{@render children?.()}
