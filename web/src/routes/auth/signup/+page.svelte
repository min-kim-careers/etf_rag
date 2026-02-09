<script lang="ts">
	import { goto } from '$app/navigation'
	import Button from '$lib/components/button.svelte'
	import { APP_ROUTES } from '$lib/constants/app-routes'
	import { toast } from 'svelte-sonner'
	import z from 'zod'
	import type { PageData } from './$types'

	export let data: PageData
	const { supabase } = data

	const schema = z.object({
		email: z.email({ message: 'Email required' }),
		password: z.string({ message: 'Password required' }).nonempty({ message: 'Password required' }),
		name: z.string({ message: 'Name required' }).nonempty({ message: 'Name required' })
	})
	type Schema = z.infer<typeof schema>
	const dummy = { email: 'someemail@gmail.com', password: 'some1234', name: 'somename' } as Schema
	let loading = false

	let form = { email: '', password: '', name: '' } as Schema
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

			const {
				// data: { session, user },
				error: authError
			} = await supabase.auth.signUp({ ...form })
			if (authError) {
				if (authError.code === 'user_already_exists') {
					toast.error('That email is taken')
				} else {
					throw authError
				}
			} else {
				goto(APP_ROUTES.auth.login)
			}
		} catch (error) {
			toast.error('Something went wrong')
		} finally {
			loading = false
		}
	}
</script>

<h1 class="">Create your account</h1>

<div class="m-10 flex flex-col items-center space-y-4">
	<form class=" flex flex-col gap-4" on:submit|preventDefault={submit}>
		<input type="email" class="rounded border p-2" placeholder="Email" bind:value={form.email} />
		{#if errors.email}
			<p class="text-sm text-red-500">{errors.email.errors}</p>
		{/if}

		<input
			type="password"
			class="rounded border p-2"
			placeholder="Password"
			bind:value={form.password}
		/>
		{#if errors.password}
			<p class="text-sm text-red-500">{errors.password.errors}</p>
		{/if}

		<input type="text" class="rounded border p-2" placeholder="Name" bind:value={form.name} />
		{#if errors.name}
			<p class="text-sm text-red-500">{errors.name.errors}</p>
		{/if}

		<Button type="submit" disabled={loading}>{loading ? 'Signing up' : 'Sign up'}</Button>
	</form>
</div>
