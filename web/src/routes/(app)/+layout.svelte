<script>
	import { enhance } from '$app/forms'
	import { goto } from '$app/navigation'
	import Button from '$lib/components/button.svelte'
	import { APP_ROUTES } from '$lib/constants/app-routes'
	import { toast } from 'svelte-sonner'

	let { children } = $props()
</script>

<form
	method="POST"
	action="/signout"
	use:enhance={() => {
		return async ({ result }) => {
			if (result.type === 'success') {
				toast.success('Signed out. Goodbye!')
				goto(APP_ROUTES.auth.login)
			}
		}
	}}
>
	<Button class="absolute top-0 right-0 m-2 border-none bg-transparent text-sm">Sign out</Button>
</form>

{@render children?.()}
