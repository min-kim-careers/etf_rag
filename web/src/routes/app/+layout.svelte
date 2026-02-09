<script lang="ts">
	import Button from '$lib/components/button.svelte'
	import { toast } from 'svelte-sonner'
	import type { LayoutData } from './$types'

	console.log('app/+layout.svelte')

	let { children, data } = $props()
	const { supabase }: LayoutData = data

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
