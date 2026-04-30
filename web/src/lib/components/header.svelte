<script lang="ts">
	import { goto } from '$app/navigation'
	import { APP_ROUTES } from '$lib/constants/app-routes'
	import Button from '$lib/shadcn/components/ui/button/button.svelte'
	import { API_ROUTES } from '$routes/api/api_routes'
	import { toast } from 'svelte-sonner'

	const { username }: { username?: string } = $props()
</script>

<div class="flex items-center justify-between text-sm">
	<span class="">{username}</span>

	<span>
		<Button
			variant="ghost"
			onclick={async () => {
				try {
					await fetch(API_ROUTES.auth.signout, { method: 'POST' })
					goto(APP_ROUTES.auth.login)
					toast('Signed out successfully.')
				} catch (error) {
					toast.error('Something went wrong.')
				}
			}}>Sign out</Button
		>
	</span>
</div>
