<script lang="ts">
	import Button from '$lib/components/button.svelte'
	import Table from '$lib/components/svelte-markdown/table.svelte'
	import TypingIndicator from '$lib/components/typing-indicator.svelte'
	import WelcomeToast from '$lib/components/welcome-toast.svelte'
	import { cn } from '$lib/shadcn/utils'
	import type { Message } from '$lib/types/message'
	import type { Provider } from '$lib/utils/langchain/config'
	import StatusBar from '$routes/(app)/(home)/status-bar.svelte'
	import { API_ROUTES } from '$routes/api/api_routes'
	import SvelteMarkdown from '@humanspeak/svelte-markdown'
	import { onMount, tick } from 'svelte'
	import toast from 'svelte-french-toast'

	const messagesKey = 'messages'

	let { data }: { data: { username: string; signedIn: string } } = $props()

	$effect(() => {
		if (data.signedIn === '1') {
			toast(WelcomeToast)
		}
	})

	function goToBottom() {
		messagePaneEl.scrollTop = messagePaneEl.scrollHeight
	}

	onMount(async () => {
		const msgs = localStorage.getItem(messagesKey)
		if (msgs) {
			messages = JSON.parse(msgs)
			await tick()
			goToBottom()
		}
	})

	let messages: Message[] = $state([])
	let provider: Provider | null = $state(null)

	let responding = $state(false)
	let thinking = $state(false)
	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault()

		try {
			if (!input) return

			// step 1: add new prompt
			messages.push({ role: 'user', content: input })

			// step 2: start stream
			responding = true
			thinking = true
			await tick()
			goToBottom()
			const res = await fetch(API_ROUTES.chat.stream, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages })
			})

			if (!res.ok || !res.body) {
				throw new Error('No response')
			}

			// step 3: reset input
			input = ''

			// step 4: add new assistant block to stream into
			messages.push({ role: 'assistant', content: '' })

			// step 5: process stream
			const reader = res.body.pipeThrough(new TextDecoderStream()).getReader()
			while (true) {
				const { value, done } = await reader.read()
				if (done) break

				if (value.startsWith('__PROVIDER__:')) {
					provider = value.replace('__PROVIDER__:', '').trim() as Provider
					continue
				}

				if (thinking) thinking = false

				messages[messages.length - 1].content += value
			}

			localStorage.setItem(messagesKey, JSON.stringify(messages))
		} catch (error) {
			toast('Something went wrong.')
			console.error(error)
		}

		responding = false
		await tick()
		inputEl.focus()
	}

	let input = $state('')
	let inputEl: HTMLInputElement

	let messagePaneEl: HTMLDivElement
</script>

<StatusBar
	{provider}
	handleClear={() => {
		messages = []
		localStorage.removeItem(messagesKey)
	}}
/>

<div class="flex h-full min-h-0 flex-1 flex-col justify-between gap-2 p-2">
	<div bind:this={messagePaneEl} class="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto rounded">
		{#each messages as m}
			{#if m.content}
				<div class={cn('flex w-full', m.role === 'user' ? 'justify-end' : 'justify-start')}>
					<div
						class={cn(
							'rounded border p-2 leading-relaxed  [&_hr]:my-3 [&_li]:mb-1 [&_p]:mb-2',
							m.role === 'user' ? 'bg-muted' : 'overflow-x-auto bg-background'
						)}
					>
						<SvelteMarkdown
							source={m.content}
							renderers={{
								table: Table
							}}
						/>
					</div>
				</div>
			{/if}
		{/each}

		{#if thinking}
			<div class="px-4 py-2"><TypingIndicator /></div>
		{/if}
	</div>

	<form class="flex w-full gap-2" onsubmit={handleSubmit}>
		<input
			bind:value={input}
			bind:this={inputEl}
			type="text"
			class="w-full rounded border p-2 disabled:bg-muted"
			disabled={responding}
			placeholder={thinking ? 'Thinking...' : responding ? 'Responding...' : 'Ask something..'}
		/>
		<Button
			disabled={responding || !input}
			type="submit"
			class="w-[100px] rounded border p-2 disabled:bg-muted disabled:text-muted-foreground"
			>Send</Button
		>
	</form>
</div>
