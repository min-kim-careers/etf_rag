<script lang="ts">
	import { APP_DATA } from '$lib/constants/app-data'
	import { APP_ROUTES } from '$lib/constants/app-routes'
	import Button from '$lib/shadcn/components/ui/button/button.svelte'
	import { toast } from 'svelte-sonner'
	import { superForm, type SuperValidated } from 'sveltekit-superforms'

	let {
		data
	}: { data: { form: SuperValidated<any>; createdAccount: string; signupEnabled: boolean } } =
		$props()

	$effect(() => {
		if (data.createdAccount === '1') toast('Account created successfully!')
	})

	const { form, errors, enhance, submitting, delayed } = superForm(data.form, {
		onUpdated({ form }) {
			if (form.valid) {
				// toast('Signed in successfully.')
			} else {
				toast('Invalid credentials.')
			}
		}
	})
</script>

<h1 class="">Welcome to {APP_DATA.title}</h1>

<div class="m-10 flex flex-col items-center space-y-4">
	<form class="flex flex-col gap-4" method="POST" use:enhance>
		<input name="email" class="rounded border p-2" placeholder="Email" bind:value={$form.email} />
		{#if $errors.email}
			<p class="px-2 text-sm text-red-500">{$errors.email}</p>
		{/if}

		<input
			type="password"
			name="password"
			class="rounded border p-2"
			placeholder="Password"
			bind:value={$form.password}
		/>
		{#if $errors.password}
			<p class="px-2 text-sm text-red-500">{$errors.password}</p>
		{/if}

		<Button class="h-10" type="submit" disabled={$submitting}>
			{#if $delayed}
				Signing in…
			{:else}
				Sign In
			{/if}</Button
		>
	</form>

	<Button
		variant="link"
		disabled={!data.signupEnabled}
		href={data.signupEnabled ? APP_ROUTES.auth.signup : undefined}
		class="text-sm underline">Create account</Button
	>
</div>
