<script lang="ts">
	import { cn } from '$lib/components/shadcn/utils'
	import { API_ROUTES } from '$lib/constants/api-routes'
	import SvelteMarkdown from '@humanspeak/svelte-markdown'
	import toast from 'svelte-french-toast'

	type Message = {
		role: 'user' | 'agent'
		content: string
	}

	let messages: Message[] = []
	let responding = false
	let prompt = ''

	async function handleSubmit() {
		if (!prompt) return
		messages.push({ role: 'user', content: prompt }, { role: 'agent', content: '' })
		console.log(messages)

		const _prompt = prompt
		prompt = ''

		try {
			responding = true
			const res = await fetch(API_ROUTES.chat, {
				method: 'POST',
				headers: { 'Context-Type': 'application/json' },
				body: JSON.stringify({ prompt: _prompt })
			})

			if (!res.body) {
				toast.error('Something went wrong.')
				throw new Error()
			}

			const reader = res.body.pipeThrough(new TextDecoderStream()).getReader()

			while (true) {
				const { value, done } = await reader?.read()
				if (done) break
				messages[messages.length - 1].content += value
			}
		} catch (error) {
			console.error(error)
		} finally {
			responding = false
		}
	}
</script>

<div class="flex h-full w-full flex-1 flex-col items-center justify-between gap-2 p-2">
	<ul class="flex w-full flex-1 flex-col gap-2 overflow-y-auto rounded">
		{#each messages as m}
			{#if m.content}
				<li class={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
					<p
						class={cn(
							'rounded border p-2 wrap-anywhere',
							m.role === 'user' ? 'bg-muted' : 'bg-background'
						)}
					>
						<SvelteMarkdown source={m.content} />
					</p>
				</li>
			{/if}
		{/each}
	</ul>

	<form class="flex w-full gap-2" on:submit|preventDefault={handleSubmit}>
		<input
			bind:value={prompt}
			type="text"
			class="w-full rounded border p-2 disabled:bg-muted"
			disabled={responding}
			placeholder="ask something.."
		/>
		<button
			disabled={responding}
			type="submit"
			class="w-[100px] rounded border p-2 disabled:bg-muted disabled:text-muted-foreground"
			>send</button
		>
	</form>
</div>
