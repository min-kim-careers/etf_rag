<script lang="ts">
	import { goto } from '$app/navigation'
	import { API_ROUTES } from '$lib/constants/api-routes'
	import { APP_ROUTES } from '$lib/constants/app-routes'
	import toast from 'svelte-french-toast'

	type Params = {
		page: string
		limit: string
		categories: string
	}
	let categories = $state('')

	const { username }: { username: string } = $props()
</script>

<div class="mx-4 flex justify-between text-sm">
	<div class="">{username}</div>

	<button
		class="cursor-pointer underline"
		onclick={async () => {
			try {
				await fetch('/api/product/update', { method: 'POST' })
			} catch (error) {
				toast.error('Something went wrong.')
			}
		}}
	>
		Update Products</button
	>

	<input type="text" bind:value={categories} class="rounded border" />
	<button
		class="cursor-pointer underline"
		onclick={async () => {
			try {
				console.log(categories)

				const params = new URLSearchParams({
					page: '1',
					limit: '20',
					categories
				} as Params)
				const res = await fetch('/api/product?' + params, { method: 'GET' })
				if (res.ok) {
					const body = await res.json()
					console.log(body.products)
				}
			} catch (error) {
				toast.error('Something went wrong.')
			}
		}}
	>
		List Products</button
	>

	<button
		class="cursor-pointer"
		onclick={async () => {
			try {
				await fetch(API_ROUTES.signout, { method: 'POST' })
				toast('Signed out successfully.')
				goto(APP_ROUTES.auth.login)
			} catch (error) {
				toast.error('Something went wrong.')
			}
		}}>Sign out</button
	>
</div>
