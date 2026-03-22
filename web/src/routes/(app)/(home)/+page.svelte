<script lang="ts">
	import { API_ROUTES } from '$lib/constants/api-routes'
	import { cn } from '$lib/shadcn/utils'
	import type { Provider } from '$lib/utils/langchain/config'
	import WelcomeToast from '$routes/_components/welcome-toast.svelte'
	import SvelteMarkdown from '@humanspeak/svelte-markdown'
	import toast from 'svelte-french-toast'
	import { SyncLoader } from 'svelte-loading-spinners'

	let { data }: { data: { username: string; signedIn: string } } = $props()

	$effect(() => {
		if (data.signedIn === '1') {
			toast(WelcomeToast)
		}
	})

	type Message = {
		role: 'user' | 'agent'
		content: string
	}

	let messages: Message[] = $state([])
	let responding = $state(false)
	let prompt = $state('')
	let provider: Provider = $state('gemini')

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault()

		if (!prompt) return
		messages.push({ role: 'user', content: prompt }, { role: 'agent', content: '' })

		const _prompt = prompt
		prompt = ''

		try {
			responding = true
			const res = await fetch(API_ROUTES.chat, {
				method: 'POST',
				headers: { 'Context-Type': 'application/json' },
				body: JSON.stringify({ prompt: _prompt })
			})

			if (!res.ok || !res.body) {
				throw new Error()
			}

			const reader = res.body.pipeThrough(new TextDecoderStream()).getReader()
			responding = false

			while (true) {
				const { value, done } = await reader.read()
				if (done) break

				if (value.startsWith('__STATUS__:')) {
					provider = value.replace('__STATUS__:', '').trim() as Provider
				} else {
					messages[messages.length - 1].content += value
				}
			}
		} catch (error) {
			toast('Something went wrong.')
			console.error(error)
		} finally {
			responding = false
		}
	}
</script>

<div class="flex w-full border-b px-2 py-1 text-sm">
	Now using <span class="ml-1 font-bold">{provider.toUpperCase()}</span>
</div>

<div class="flex h-full min-h-0 w-full flex-1 flex-col items-center justify-between gap-2 p-2">
	<ul class="flex min-h-0 w-full flex-1 flex-col gap-2 overflow-y-auto rounded">
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
		{#if responding}
			<li class="px-4 py-2"><SyncLoader size={40} color="#000000" /></li>
		{/if}
	</ul>

	<form class="flex w-full gap-2" onsubmit={handleSubmit}>
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
