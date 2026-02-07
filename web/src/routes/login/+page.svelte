<script lang="ts">
	import Button from '$lib/components/button.svelte'
	import z from 'zod'

	const schema = z.object({
		email: z.email({ message: 'Email required' }),
		password: z.string({ message: 'Password required' }).min(1)
	})

	let form = {} as z.infer<typeof schema>
	let errors = {} as any

	function submit() {
		const { success, error } = schema.safeParse(form)
		if (!success) {
			errors = z.treeifyError(error).properties
			return
		}
	}
</script>

<h1 class="">Welcome to IIII</h1>

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

		<Button type="submit">Login</Button>
	</form>

	<a href="/signup" class="text-sm underline">Create account</a>
</div>
