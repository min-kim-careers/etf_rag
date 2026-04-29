<script lang="ts">
	import Button from '$lib/shadcn/components/ui/button/button.svelte'
	import { toast } from 'svelte-sonner'
	import { superForm, type SuperValidated } from 'sveltekit-superforms'

	export let data: {
		form: SuperValidated<any>
	}

	const { form, errors, enhance, submitting, delayed } = superForm(data.form, {
		onUpdated({ form }) {
			if (form.valid) {
				// toast('Signed up successfully.')
			} else {
				toast('Something went wrong.')
			}
		}
	})
</script>

<h1 class="">Create your account</h1>

<div class="m-10 flex flex-col items-center space-y-4">
	<form class="flex flex-col gap-4" method="POST" use:enhance>
		<input name="name" class="rounded border p-2" placeholder="Name" bind:value={$form.name} />
		{#if $errors.name}
			<p class="px-2 text-sm text-red-500">{$errors.name}</p>
		{/if}

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
				Creating account
			{:else}
				Create account
			{/if}</Button
		>
	</form>
</div>
