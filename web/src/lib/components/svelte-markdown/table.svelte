<script lang="ts">
	import * as AlertDialog from '$lib/shadcn/components/ui/alert-dialog/index.js'
	import { buttonVariants } from '$lib/shadcn/components/ui/button/index.js'
	import { cn } from '$lib/shadcn/utils'
	import X from '@lucide/svelte/icons/x'

	const tableStyle = '[&_table]:border-collapse [&_td]:px-3 [&_td]:py-1 [&_th]:px-3 [&_th]:py-1'
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger class={buttonVariants({ variant: 'ghost' })}>
		Expand Table
	</AlertDialog.Trigger>
	<AlertDialog.Content class="min-w-11/12">
		<AlertDialog.Header class="relative">
			<div class="fixed top-0 right-0 m-1">
				<AlertDialog.Cancel variant="ghost"><X /></AlertDialog.Cancel>
			</div>

			<AlertDialog.Description class="w-full overflow-auto">
				<div class={cn(tableStyle)}>
					<slot />
				</div>
			</AlertDialog.Description>
		</AlertDialog.Header>
	</AlertDialog.Content>
</AlertDialog.Root>
<div class={tableStyle}>
	<slot />
</div>
