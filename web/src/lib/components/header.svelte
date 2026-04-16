<script lang="ts">
	import { goto } from '$app/navigation'
	import { APP_ROUTES } from '$lib/constants'
	import toast from 'svelte-french-toast'

	const { username }: { username: string } = $props()
</script>

<div class="mx-4 flex justify-between text-sm">
	<div class="">{username}</div>

	<button
		class="cursor-pointer"
		onclick={async () => {
			try {
				await fetch('/api/auth/signout', { method: 'POST' })
				toast('Signed out successfully.')
				goto(APP_ROUTES.auth.login)
			} catch (error) {
				toast.error('Something went wrong.')
			}
		}}>Sign out</button
	>
</div>
