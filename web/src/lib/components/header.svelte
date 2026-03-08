<script lang="ts">
	import { enhance } from '$app/forms'
	import { goto } from '$app/navigation'
	import { APP_ROUTES } from '$lib/constants/app-routes'
	import toast from 'svelte-french-toast'

	const { username }: { username: string } = $props()
</script>

<div class="mx-4 flex justify-between text-sm">
	<div class="">{username}</div>

	<form
		method="POST"
		action={APP_ROUTES.signout}
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'success') {
					toast('Signed out successfully.')
					goto(APP_ROUTES.auth.login)
				}
			}
		}}
	>
		<button class="cursor-pointer">Sign out</button>
	</form>
</div>
