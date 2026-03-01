<script lang="ts">
	import Button from '$lib/components/button.svelte'
	import { toast } from 'svelte-sonner'
	import z from 'zod'
	import { schema, type Schema } from './schema'

	// export let data: PageData
	// const { supabase } = data

	const dummy = { name: 'somename' } as Schema
	let loading = false

	let form = { name: '' } as Schema
	form = dummy
	let errors = {} as any

	async function submit() {
		try {
			loading = true
			const { success, error: formError } = schema.safeParse(form)
			if (!success) {
				errors = z.treeifyError(formError).properties
				return
			}

			// const {
			// 	// data: { session, user },
			// 	error: authError
			// } = await supabase.auth.signUp({ ...form })
			// if (authError) {
			// 	if (authError.code === 'user_already_exists') {
			// 		toast.error('That email is taken')
			// 	} else {
			// 		throw authError
			// 	}
			// } else {
			// 	goto(APP_ROUTES.auth.login)
			// }
		} catch (error) {
			toast.error('Something went wrong')
		} finally {
			loading = false
		}
	}
</script>

<h1 class="">create your profile</h1>

<div class="m-10 flex flex-col items-center space-y-4">
	<form class=" flex flex-col gap-4" on:submit|preventDefault={submit}>
		<input type="text" class="rounded border p-2" placeholder="Name" bind:value={form.name} />
		{#if errors.name}
			<p class="text-sm text-red-500">{errors.name.errors}</p>
		{/if}

		<Button type="submit" disabled={loading}>{loading ? 'making profile' : 'make profile'}</Button>
	</form>
</div>
