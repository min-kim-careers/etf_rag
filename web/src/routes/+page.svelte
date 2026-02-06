<script lang="ts">
	import Button from '$lib/components/button.svelte'

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault()

		const form = e.currentTarget as HTMLFormElement
		const data = new FormData(form)
	}
</script>

<div class="flex min-h-screen max-w-[90vw] flex-col justify-between gap-2 p-2">
	<div class="flex flex-1 items-center justify-center">
		<div class="flex h-[480px] w-[360px] flex-col items-center justify-center rounded border">
			<h1 class="">Welcome to IIII</h1>

			<div class="m-10 space-y-4">
				<form class=" flex flex-col gap-4" on:submit={handleSubmit}>
					<input type="email" name="email" class="rounded border p-2" placeholder="Email" />

					<input
						type="password"
						name="password"
						class="rounded border p-2"
						placeholder="Password"
					/>

					<Button type="submit">Login</Button>
				</form>

				<Button class="w-full">New account</Button>
			</div>
		</div>
	</div>
</div>
