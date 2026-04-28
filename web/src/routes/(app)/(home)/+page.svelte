<script lang="ts">
	import Table from '$lib/components/svelte-markdown/table.svelte'
	import TypingIndicator from '$lib/components/typing-indicator.svelte'
	import WelcomeToast from '$lib/components/welcome-toast.svelte'
	import Button from '$lib/shadcn/components/ui/button/button.svelte'
	import { cn } from '$lib/shadcn/utils'
	import type { Message } from '$lib/types/message'
	import type { Provider } from '$lib/utils/langchain/config'
	import LimitBanner from '$routes/(app)/(home)/limit-banner.svelte'
	import StatusBar from '$routes/(app)/(home)/status-bar.svelte'
	import { API_ROUTES } from '$routes/api/api_routes'
	import type { Meta } from '$routes/api/chat/[...path]/stream-chat'
	import SvelteMarkdown from '@humanspeak/svelte-markdown'
	import { onMount, tick } from 'svelte'
	import toast from 'svelte-french-toast'

	const messagesKey = 'messages'

	let { data }: { data: { username: string; signedIn: string } } = $props()

	$effect(() => {
		if (data.signedIn === '1') toast(WelcomeToast)
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

		const resp = await fetch(API_ROUTES.chat.limit)
		const { limit } = await resp.json()
		meta.remainingLimit = limit
	})

	let messages: Message[] = $state([])
	let meta: Meta = $state({
		provider: 'cloud',
		remainingLimit: -1
	})

	let responding = $state(false)
	let thinking = $state(false)
	let error = $state(false)
	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault()

		try {
			if (!input) return

			// step 1: add new message
			if (error) {
				messages[messages.length - 1].content = input
			} else {
				messages.push({ role: 'user', content: input })
			}

			// step 2: start chat stream
			responding = true
			thinking = true
			await tick()

			goToBottom()

			const res = await fetch(API_ROUTES.chat.stream, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages, provider: meta.provider })
			})

			if (!res.ok || !res.body) {
				throw new Error('No response')
			}

			// step 3: reset input
			input = ''

			// step 4: add response message
			messages.push({ role: 'assistant', content: '' })

			// step 5: process stream
			const reader = res.body.pipeThrough(new TextDecoderStream()).getReader()
			while (true) {
				const { value: chunk, done } = await reader.read()
				if (done) break

				if (chunk.startsWith('__META__:')) {
					meta = { ...meta, ...JSON.parse(chunk.slice(9)) }
					if (meta.error) throw new Error(meta.error)
					continue
				}

				if (thinking) thinking = false

				messages[messages.length - 1].content += chunk
			}

			localStorage.setItem(messagesKey, JSON.stringify(messages))

			error = false
		} catch (e: any) {
			if (e.message === 'server_offline') {
				toast(`${meta.provider} server is currently unavailable`)
				meta.error = undefined
			} else {
				toast('Something went wrong.')
			}
			if (!messages[messages.length - 1].content.trim()) messages.pop()
			error = true
		}

		input = ''
		thinking = false
		responding = false
		await tick()

		inputEl.focus()
	}

	let input = $state('')
	let inputEl: HTMLInputElement

	let messagePaneEl: HTMLDivElement
	let hideLimitBanner = $state(false)
</script>

<StatusBar
	handleClear={() => {
		messages = []
		localStorage.removeItem(messagesKey)
	}}
	setProvider={(p: Provider) => (meta.provider = p)}
/>

<div class="flex h-full min-h-0 flex-1 flex-col justify-between gap-2 p-2">
	<div
		bind:this={messagePaneEl}
		class="relative flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto rounded"
	>
		<LimitBanner {hideLimitBanner} {meta} />
		{#each messages as m}
			{#if m.content}
				<div class={cn('flex w-full', m.role === 'user' ? 'justify-end' : 'justify-start')}>
					<div class="flex flex-col">
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
						{#if error && m.role == 'user'}
							<span class="text-sm text-red-600">error streaming</span>
						{/if}
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
			placeholder={thinking ? 'Thinking' : responding ? 'Responding' : 'Ask something'}
		/>
		<Button disabled={responding || !input} type="submit" class="h-full px-6">Send</Button>
	</form>
</div>
