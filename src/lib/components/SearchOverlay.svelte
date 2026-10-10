<script lang="ts">
	import { goto } from '$app/navigation';
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { dialog } from '$lib/actions/inview';
	import { bestSellers } from '$lib/data/products';
	import { ui } from '$lib/stores/ui.svelte';
	import { money } from '$lib/utils/format';
	import { popularSearches, searchProducts } from '$lib/utils/search';
	import Icon from './Icon.svelte';
	import PhotoPlaceholder from './PhotoPlaceholder.svelte';

	let q = $state('');
	const results = $derived(q.trim().length < 2 ? [] : searchProducts(q));
	const suggestions = bestSellers().slice(0, 4);
	const shown = $derived(q.trim().length < 2 ? suggestions : results.slice(0, 8));

	function close() {
		ui.searchOpen = false;
	}

	function submit(e: SubmitEvent) {
		e.preventDefault();
		if (!q.trim()) return;
		const term = q.trim();
		close();
		goto(`/loja?busca=${encodeURIComponent(term)}`);
	}
</script>

{#if ui.searchOpen}
	<div class="backdrop" transition:fade={{ duration: 300 }} onclick={close} role="presentation"></div>
	<div
		class="panel"
		role="dialog"
		aria-modal="true"
		aria-label="Buscar produtos"
		transition:fly={{ y: '-100%', duration: 600, easing: quintOut, opacity: 1 }}
		use:dialog={close}
	>
		<div class="container">
			<div class="row">
				<form class="form" onsubmit={submit} role="search">
					<Icon name="search" size={24} stroke={1.1} />
					<input
						type="search"
						bind:value={q}
						placeholder="O que você procura?"
						aria-label="Buscar"
						autocomplete="off"
						spellcheck="false"
						data-autofocus
					/>
				</form>
				<button class="close" onclick={close} aria-label="Fechar busca"><Icon name="close" size={24} /></button>
			</div>

			{#if q.trim().length < 2}
				<div class="popular">
					<span class="eyebrow">Buscas frequentes</span>
					<div class="chips">
						{#each popularSearches as term (term)}
							<button onclick={() => (q = term)}>{term}</button>
						{/each}
					</div>
				</div>
			{/if}

			<div class="results-head">
				<span class="eyebrow">
					{#if q.trim().length < 2}
						Mais procuradas
					{:else if results.length}
						{results.length} {results.length === 1 ? 'resultado' : 'resultados'}
					{:else}
						Nenhum resultado para “{q.trim()}”
					{/if}
				</span>
				{#if results.length > 8}
					<a class="link" href="/loja?busca={encodeURIComponent(q.trim())}" onclick={close}>Ver todos</a>
				{/if}
			</div>

			{#if shown.length}
				<ul class="grid">
					{#each shown as p, i (p.id)}
						<li style:--i={i} in:fly={{ y: 16, duration: 450, delay: i * 30, easing: quintOut }}>
							<a href="/produto/{p.slug}" onclick={close}>
								<PhotoPlaceholder tone={p.colors[0].hex} caption={p.name} />
								<span class="name">{p.name}</span>
								<span class="price">{money(p.price)}</span>
							</a>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="empty">Tente buscar por categoria, tecido ou cor. Por exemplo: “linho”, “seda”, “preto”.</p>
			{/if}
		</div>
	</div>
{/if}

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 90;
		background: rgb(31 27 24 / 0.4);
	}

	.panel {
		position: fixed;
		inset: 0 0 auto;
		z-index: 91;
		max-height: 100dvh;
		overflow-y: auto;
		overscroll-behavior: contain;
		background: var(--ivory);
		padding: 1.25rem 0 2.5rem;
	}

	.row {
		display: flex;
		align-items: center;
		gap: 1rem;
		border-bottom: 1px solid var(--ink);
	}

	.form {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	input {
		flex: 1;
		min-width: 0;
		height: 72px;
		border: 0;
		background: none;
		outline: none;
		font-family: var(--serif);
		font-size: clamp(26px, 3.6vw, 44px);
	}

	input::-webkit-search-cancel-button {
		display: none;
	}

	.close {
		width: 44px;
		height: 44px;
		display: grid;
		place-items: center;
	}

	.popular {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem 1.5rem;
		padding: 1.5rem 0 0.5rem;
	}

	.popular .eyebrow {
		color: var(--ink-3);
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.chips button {
		padding: 0.5rem 0.9rem;
		border: 1px solid var(--line-2);
		font-size: 13px;
		transition:
			background 0.25s,
			color 0.25s,
			border-color 0.25s;
	}

	.chips button:hover {
		background: var(--ink);
		color: var(--paper);
		border-color: var(--ink);
	}

	.results-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 2rem 0 1.25rem;
	}

	.results-head .eyebrow {
		color: var(--ink-3);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 1.5rem 1rem;
	}

	@media (min-width: 900px) {
		.grid {
			grid-template-columns: repeat(8, minmax(0, 1fr));
		}

		.grid:has(> li:nth-child(-n + 4):last-child) {
			grid-template-columns: repeat(6, minmax(0, 1fr));
		}
	}

	.grid a {
		display: grid;
		gap: 0.5rem;
	}

	.grid :global(.ph) {
		transition: transform 0.9s var(--ease-out);
	}

	.grid a:hover :global(.ph) {
		transform: translateY(-4px);
	}

	.name {
		font-family: var(--serif);
		font-size: 16px;
		line-height: 1.2;
	}

	.price {
		font-size: 13px;
		color: var(--ink-2);
	}

	.empty {
		color: var(--ink-3);
	}
</style>
