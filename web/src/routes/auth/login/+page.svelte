<script lang="ts">
	import { PUBLIC_APP_TITLE } from '$env/static/public'
	import Button from '$lib/components/button.svelte'
	import { APP_ROUTES } from '$lib/constants/app-routes'
	import { toast } from 'svelte-sonner'
	import { superForm, type SuperValidated } from 'sveltekit-superforms'

	export let data: {
		form: SuperValidated<any>
	}

	const { form, errors, enhance, submitting, delayed } = superForm(data.form, {
		onResult: () => toast.success('Signed in successfully!')
	})
</script>

<h1 class="">Welcome to {PUBLIC_APP_TITLE}</h1>

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

		<Button type="submit" disabled={$submitting}>
			{#if $delayed}
				Signing in…
			{:else}
				Sign In
			{/if}</Button
		>
	</form>

	<a href={APP_ROUTES.auth.signup} class="text-sm underline">Create account</a>
</div>
