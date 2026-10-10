<script lang="ts">
	let { items }: { items: { label: string; href?: string }[] } = $props();
</script>

<nav aria-label="Você está em">
	<ol>
		<li><a href="/">Início</a></li>
		{#each items as item (item.label)}
			<li>
				{#if item.href}<a href={item.href}>{item.label}</a>{:else}<span aria-current="page">{item.label}</span>{/if}
			</li>
		{/each}
	</ol>
</nav>

<style>
	ol {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		font-size: 11px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-3);
	}

	li + li::before {
		content: '/';
		margin-right: 0.4rem;
		opacity: 0.5;
	}

	a:hover {
		color: var(--ink);
	}

	span {
		color: var(--ink-2);
	}
</style>
