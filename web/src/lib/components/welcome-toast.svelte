<script lang="ts">
	import { authClient } from '$lib/utils/better-auth/client'

	const session = authClient.useSession()
</script>

<span>Welcome <strong>{$session.data?.user.name}</strong></span>
