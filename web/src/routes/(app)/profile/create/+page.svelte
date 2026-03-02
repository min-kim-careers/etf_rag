<script lang="ts">
	import Button from '$lib/components/button.svelte'
	import { toast } from 'svelte-sonner'
	import { superForm, type SuperValidated } from 'sveltekit-superforms'

	export let data: {
		form: SuperValidated<any>
	}

	const { form, errors, enhance, submitting, delayed } = superForm(data.form, {
		onResult: () => toast.success('Profile created successfully!')
	})
</script>

<h1 class="">Create Profile</h1>

<div class="m-10 flex flex-col items-center space-y-4">
	<form class="flex flex-col gap-4" method="POST" use:enhance>
		<input name="name" class="rounded border p-2" placeholder="Name" bind:value={$form.name} />
		{#if $errors.name}
			<p class="px-2 text-sm text-red-500">{$errors.name}</p>
		{/if}

		<Button type="submit" disabled={$submitting}>
			{#if $delayed}
				Creating...
			{:else}
				Create
			{/if}</Button
		>
	</form>
</div>
