<script lang="ts">
	import TypingIndicator from '$lib/components/typing-indicator.svelte'
	import WelcomeToast from '$lib/components/welcome-toast.svelte'
	import { cn } from '$lib/shadcn/utils'
	import type { Message } from '$lib/types/message'
	import type { Provider } from '$lib/utils/langchain/config'
	import SvelteMarkdown from '@humanspeak/svelte-markdown'
	import toast from 'svelte-french-toast'

	let { data }: { data: { username: string; signedIn: string } } = $props()

	$effect(() => {
		if (data.signedIn === '1') {
			toast(WelcomeToast)
		}
	})

	let messages: Message[] = $state([])
	let loading = $state(false)
	let prompt = $state('')
	let provider: Provider = $state('local')

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault()

		if (!prompt) return
		messages.push({ role: 'user', content: prompt }, { role: 'agent', content: '' })

		const _prompt = prompt
		prompt = ''

		try {
			loading = true
			const res = await fetch('/api/chat/stream', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ prompt: _prompt })
			})

			if (!res.ok || !res.body) {
				throw new Error()
			}

			const reader = res.body.pipeThrough(new TextDecoderStream()).getReader()

			while (true) {
				const { value, done } = await reader.read()
				if (done) break

				if (value.startsWith('__PROVIDER__:')) {
					provider = value.replace('__PROVIDER__:', '').trim() as Provider
				} else {
					if (loading) loading = false
					messages[messages.length - 1].content += value
				}
			}
		} catch (error) {
			toast('Something went wrong.')
			console.error(error)
		} finally {
			loading = false
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
		{#if loading}
			<li class="px-4 py-2"><TypingIndicator /></li>
		{/if}
	</ul>

	<form class="flex w-full gap-2" onsubmit={handleSubmit}>
		<input
			bind:value={prompt}
			type="text"
			class="w-full rounded border p-2 disabled:bg-muted"
			disabled={loading}
			placeholder="ask something.."
		/>
		<button
			disabled={loading}
			type="submit"
			class="w-[100px] rounded border p-2 disabled:bg-muted disabled:text-muted-foreground"
			>send</button
		>
	</form>
</div>
