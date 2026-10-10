<script lang="ts">
	import { page } from '$app/state';
	import { flip } from 'svelte/animate';
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { reveal } from '$lib/actions/reveal';
	import { dialog } from '$lib/actions/inview';
	import {
		categories,
		colorFamilies,
		isOnSale,
		products,
		virtualCollections,
		type ColorFamily,
		type Product
	} from '$lib/data/products';
	import { ui } from '$lib/stores/ui.svelte';
	import { searchProducts } from '$lib/utils/search';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import ProductCard from '$lib/components/ProductCard.svelte';

	let { data } = $props();

	const SIZE_ORDER = ['PP', 'P', 'M', 'G', 'GG', '36', '38', '40', '42', '44', '46', 'Único'];
	const PRICE_RANGES = [
		{ id: 'ate-200', label: 'Até R$ 200', test: (v: number) => v <= 200 },
		{ id: '200-350', label: 'R$ 200 a R$ 350', test: (v: number) => v > 200 && v <= 350 },
		{ id: '350-500', label: 'R$ 350 a R$ 500', test: (v: number) => v > 350 && v <= 500 },
		{ id: 'acima-500', label: 'Acima de R$ 500', test: (v: number) => v > 500 }
	];
	const SORTS = {
		relevancia: 'Relevância',
		novidades: 'Novidades',
		menor: 'Menor preço',
		maior: 'Maior preço',
		az: 'Nome, A–Z'
	} as const;
	type SortKey = keyof typeof SORTS;
	const PAGE = 12;

	let query = $state('');
	let sizes = $state<string[]>([]);
	let families = $state<ColorFamily[]>([]);
	let prices = $state<string[]>([]);
	let onlySale = $state(false);
	let sort = $state<SortKey>('relevancia');
	let cols = $state<3 | 4>(4);
	let limit = $state(PAGE);
	let filtersOpen = $state(false);

	// a busca vem da URL (?busca=), lida só no navegador
	$effect(() => {
		query = page.url.searchParams.get('busca') ?? '';
	});

	$effect(() => {
		ui.modalOpen = filtersOpen;
		return () => (ui.modalOpen = false);
	});

	const base = $derived.by(() => {
		if (data.kind === 'category') return products.filter((p) => p.category === data.slug);
		if (data.kind === 'collection') return products.filter(virtualCollections[data.slug].filter);
		return products;
	});

	const sizeOptions = $derived(
		SIZE_ORDER.filter((s) => base.some((p) => p.sizes.includes(s)))
	);
	const familyOptions = $derived(
		(Object.keys(colorFamilies) as ColorFamily[]).filter((f) =>
			base.some((p) => p.colors.some((c) => c.family === f))
		)
	);

	const filtered = $derived.by(() => {
		let list: Product[] = base;
		if (query.trim()) {
			const ids = new Set(searchProducts(query).map((p) => p.id));
			list = list.filter((p) => ids.has(p.id));
		}
		if (sizes.length)
			list = list.filter((p) => sizes.some((s) => p.sizes.includes(s) && !p.unavailable.includes(s)));
		if (families.length) list = list.filter((p) => p.colors.some((c) => families.includes(c.family)));
		if (prices.length) {
			const ranges = PRICE_RANGES.filter((r) => prices.includes(r.id));
			list = list.filter((p) => ranges.some((r) => r.test(p.price)));
		}
		if (onlySale) list = list.filter(isOnSale);

		const sorted = [...list];
		if (sort === 'novidades') sorted.sort((a, b) => b.added - a.added);
		else if (sort === 'menor') sorted.sort((a, b) => a.price - b.price);
		else if (sort === 'maior') sorted.sort((a, b) => b.price - a.price);
		else if (sort === 'az') sorted.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
		return sorted;
	});

	const visible = $derived(filtered.slice(0, limit));
	const activeCount = $derived(sizes.length + families.length + prices.length + (onlySale ? 1 : 0));

	// volta para a primeira "página" quando o conjunto filtrado muda
	$effect(() => {
		void filtered;
		limit = PAGE;
	});

	function toggle<T>(list: T[], v: T) {
		return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
	}

	function clearAll() {
		sizes = [];
		families = [];
		prices = [];
		onlySale = false;
	}

	const navLinks = [
		{ href: '/loja', label: 'Tudo' },
		{ href: '/loja/novidades', label: 'Novidades' },
		...categories.map((c) => ({ href: `/loja/${c.slug}`, label: c.short })),
		{ href: '/loja/promocoes', label: 'Promoções' }
	];

	const crumbs = $derived(
		data.kind === 'all' ? [{ label: 'Loja' }] : [{ label: 'Loja', href: '/loja' }, { label: data.title }]
	);
</script>

<svelte:head>
	<title>{data.title} — Chica Maria</title>
	<meta name="description" content={data.description} />
</svelte:head>

<section class="container intro">
	<Breadcrumbs items={crumbs} />
	<div class="intro-row">
		<h1 class="display" data-reveal="lines" use:reveal>
			<span class="line-mask"><span>{query ? `“${query}”` : data.title}</span></span>
		</h1>
		<p class="lead" data-reveal use:reveal={120}>
			{#if query}
				Resultados da busca{data.kind !== 'all' ? ` em ${data.title}` : ''}.
				<a href={page.url.pathname} class="text-link">Limpar busca</a>
			{:else}
				{data.description}
			{/if}
		</p>
	</div>

	<nav class="cat-nav" aria-label="Categorias">
		{#each navLinks as l (l.href)}
			<a href={l.href} class:active={page.url.pathname === l.href}>{l.label}</a>
		{/each}
	</nav>
</section>

<div class="toolbar-wrap">
	<div class="container toolbar">
		<button class="filter-btn" onclick={() => (filtersOpen = true)}>
			<Icon name="filter" size={18} />
			Filtrar{#if activeCount}<span class="badge">{activeCount}</span>{/if}
		</button>

		<p class="count" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'peça' : 'peças'}</p>

		<div class="tools">
			<label class="sort">
				<span class="sr-only">Ordenar por</span>
				<select bind:value={sort}>
					{#each Object.entries(SORTS) as [k, label] (k)}
						<option value={k}>{label}</option>
					{/each}
				</select>
				<Icon name="chevron-down" size={14} />
			</label>
			<div class="density" role="group" aria-label="Colunas">
				<button class:on={cols === 3} onclick={() => (cols = 3)} aria-label="3 colunas" aria-pressed={cols === 3}>
					<Icon name="grid3" size={17} stroke={1} />
				</button>
				<button class:on={cols === 4} onclick={() => (cols = 4)} aria-label="4 colunas" aria-pressed={cols === 4}>
					<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
						><rect x="2" y="4" width="3.8" height="16" /><rect x="7.4" y="4" width="3.8" height="16" /><rect
							x="12.8"
							y="4"
							width="3.8"
							height="16"
						/><rect x="18.2" y="4" width="3.8" height="16" /></svg
					>
				</button>
			</div>
		</div>
	</div>
</div>

<section class="container results">
	{#if activeCount}
		<div class="chips" transition:fade={{ duration: 200 }}>
			{#each sizes as s (s)}
				<button onclick={() => (sizes = toggle(sizes, s))}>Tam. {s} <Icon name="close" size={12} /></button>
			{/each}
			{#each families as f (f)}
				<button onclick={() => (families = toggle(families, f))}>{colorFamilies[f].label} <Icon name="close" size={12} /></button>
			{/each}
			{#each PRICE_RANGES.filter((r) => prices.includes(r.id)) as r (r.id)}
				<button onclick={() => (prices = toggle(prices, r.id))}>{r.label} <Icon name="close" size={12} /></button>
			{/each}
			{#if onlySale}
				<button onclick={() => (onlySale = false)}>Em promoção <Icon name="close" size={12} /></button>
			{/if}
			<button class="clear" onclick={clearAll}>Limpar tudo</button>
		</div>
	{/if}

	{#if visible.length}
		<ul class="grid" class:cols3={cols === 3}>
			{#each visible as p (p.id)}
				<li animate:flip={{ duration: 550, easing: quintOut }} in:fade={{ duration: 400 }}>
					<ProductCard product={p} />
				</li>
			{/each}
		</ul>

		{#if filtered.length > limit}
			<div class="more">
				<p>Você viu {visible.length} de {filtered.length} peças</p>
				<div class="more-bar"><span style:transform="scaleX({visible.length / filtered.length})"></span></div>
				<button class="btn btn--ghost" onclick={() => (limit += PAGE)}>Carregar mais</button>
			</div>
		{/if}
	{:else}
		<div class="empty" in:fade>
			<p class="empty-title">Nenhuma peça encontrada.</p>
			<p class="muted">Tente remover alguns filtros ou buscar por outro termo.</p>
			<div class="empty-actions">
				{#if activeCount}<button class="btn" onclick={clearAll}>Limpar filtros</button>{/if}
				<a href="/loja" class="btn btn--ghost">Ver toda a loja</a>
			</div>
		</div>
	{/if}
</section>

{#if filtersOpen}
	<div class="backdrop" transition:fade={{ duration: 300 }} onclick={() => (filtersOpen = false)} role="presentation"></div>
	<div
		class="filters"
		role="dialog"
		aria-modal="true"
		aria-label="Filtros"
		transition:fly={{ x: '-100%', duration: 600, easing: quintOut, opacity: 1 }}
		use:dialog={() => (filtersOpen = false)}
	>
		<header>
			<h2>Filtrar</h2>
			<button onclick={() => (filtersOpen = false)} aria-label="Fechar filtros"><Icon name="close" size={22} /></button>
		</header>

		<div class="filters-body">
			<fieldset>
				<legend>Tamanho</legend>
				<div class="size-grid">
					{#each sizeOptions as s (s)}
						<button class:on={sizes.includes(s)} aria-pressed={sizes.includes(s)} onclick={() => (sizes = toggle(sizes, s))}
							>{s}</button
						>
					{/each}
				</div>
			</fieldset>

			<fieldset>
				<legend>Cor</legend>
				<div class="color-list">
					{#each familyOptions as f (f)}
						<button
							class:on={families.includes(f)}
							aria-pressed={families.includes(f)}
							onclick={() => (families = toggle(families, f))}
						>
							<span
								class="dot"
								class:pattern={f === 'estampados'}
								style:--c={colorFamilies[f].swatch}
							></span>
							{colorFamilies[f].label}
						</button>
					{/each}
				</div>
			</fieldset>

			<fieldset>
				<legend>Preço</legend>
				<div class="checks">
					{#each PRICE_RANGES as r (r.id)}
						<label class="check">
							<input type="checkbox" checked={prices.includes(r.id)} onchange={() => (prices = toggle(prices, r.id))} />
							{r.label}
						</label>
					{/each}
				</div>
			</fieldset>

			<fieldset>
				<legend>Ofertas</legend>
				<label class="check">
					<input type="checkbox" bind:checked={onlySale} />
					Somente peças em promoção
				</label>
			</fieldset>
		</div>

		<footer>
			<button class="btn btn--ghost" onclick={clearAll} disabled={!activeCount}>Limpar</button>
			<button class="btn" onclick={() => (filtersOpen = false)}>Ver {filtered.length} {filtered.length === 1 ? 'peça' : 'peças'}</button>
		</footer>
	</div>
{/if}

<style>
	.intro {
		padding-top: clamp(1.5rem, 3vw, 2.5rem);
	}

	.intro-row {
		display: grid;
		grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
		align-items: end;
		gap: 1.5rem 3rem;
		padding: clamp(2rem, 5vw, 4rem) 0 clamp(2rem, 4vw, 3rem);
	}

	.intro-row h1 {
		font-size: clamp(3rem, 7vw, 7rem);
		overflow-wrap: anywhere;
	}

	.intro-row .lead {
		justify-self: end;
		max-width: 40ch;
	}

	@media (max-width: 760px) {
		.intro-row {
			grid-template-columns: 1fr;
		}

		.intro-row .lead {
			justify-self: start;
		}
	}

	.cat-nav {
		display: flex;
		gap: 1.75rem;
		overflow-x: auto;
		scrollbar-width: none;
		border-bottom: 1px solid var(--line);
		margin-inline: calc(-1 * var(--gutter));
		padding-inline: var(--gutter);
	}

	.cat-nav::-webkit-scrollbar {
		display: none;
	}

	.cat-nav a {
		position: relative;
		flex: none;
		padding: 1rem 0;
		font-size: 11.5px;
		font-weight: 500;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ink-3);
		transition: color 0.3s;
	}

	.cat-nav a:hover,
	.cat-nav a.active {
		color: var(--ink);
	}

	.cat-nav a::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: -1px;
		height: 1px;
		background: var(--ink);
		transform: scaleX(0);
		transition: transform 0.5s var(--ease-out);
	}

	.cat-nav a.active::after {
		transform: scaleX(1);
	}

	.toolbar-wrap {
		position: sticky;
		top: calc(var(--header-h) - 1px);
		z-index: 20;
		background: rgb(244 239 231 / 0.92);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		border-bottom: 1px solid var(--line);
		transition: top 0.55s var(--ease-out);
	}

	:global(.header.hidden) ~ :global(main) .toolbar-wrap {
		top: 0;
	}

	.toolbar {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		height: 60px;
		gap: 1rem;
	}

	.filter-btn {
		justify-self: start;
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		font-size: 11.5px;
		font-weight: 500;
		letter-spacing: 0.18em;
		text-transform: uppercase;
	}

	.badge {
		display: inline-grid;
		place-items: center;
		min-width: 18px;
		height: 18px;
		padding: 0 5px;
		border-radius: 9px;
		background: var(--ink);
		color: var(--paper);
		font-size: 10px;
		letter-spacing: 0;
	}

	.count {
		font-size: 12px;
		color: var(--ink-3);
		letter-spacing: 0.06em;
	}

	.tools {
		justify-self: end;
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.sort {
		position: relative;
		display: inline-flex;
		align-items: center;
	}

	.sort select {
		appearance: none;
		-webkit-appearance: none;
		background: none;
		border: 0;
		padding: 0.5rem 1.4rem 0.5rem 0;
		font-size: 11.5px;
		font-weight: 500;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		cursor: pointer;
		outline: none;
	}

	.sort :global(svg) {
		position: absolute;
		right: 0;
		pointer-events: none;
	}

	.density {
		display: flex;
		gap: 0.25rem;
	}

	.density button {
		width: 32px;
		height: 32px;
		display: grid;
		place-items: center;
		color: var(--ink-3);
		transition: color 0.2s;
	}

	.density button.on {
		color: var(--ink);
	}

	@media (max-width: 760px) {
		.density,
		.count {
			display: none;
		}

		.toolbar {
			grid-template-columns: 1fr 1fr;
		}
	}

	.results {
		padding-top: 2rem;
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 2rem;
	}

	.chips button {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.8rem;
		border: 1px solid var(--line-2);
		font-size: 12.5px;
		transition:
			border-color 0.2s,
			background 0.2s;
	}

	.chips button:hover {
		border-color: var(--ink);
	}

	.chips .clear {
		border-color: transparent;
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 3rem 1.25rem;
	}

	.grid.cols3 {
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 3.5rem 1.5rem;
	}

	@media (max-width: 1023px) {
		.grid,
		.grid.cols3 {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 2.25rem 0.75rem;
		}
	}

	.more {
		display: grid;
		justify-items: center;
		gap: 1rem;
		margin-top: 4rem;
		font-size: 13px;
		color: var(--ink-3);
	}

	.more-bar {
		width: 200px;
		height: 1px;
		background: var(--line);
	}

	.more-bar span {
		display: block;
		height: 100%;
		background: var(--ink);
		transform-origin: left;
		transition: transform 0.6s var(--ease-out);
	}

	.more .btn {
		margin-top: 0.5rem;
	}

	.empty {
		display: grid;
		justify-items: center;
		gap: 0.75rem;
		text-align: center;
		padding: 5rem 0 2rem;
	}

	.empty-title {
		font-family: var(--serif);
		font-size: 34px;
	}

	.empty-actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.75rem;
		margin-top: 1.25rem;
	}

	/* Painel de filtros */
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 90;
		background: rgb(31 27 24 / 0.4);
	}

	.filters {
		position: fixed;
		inset: 0 auto 0 0;
		z-index: 91;
		width: min(420px, 100%);
		background: var(--ivory);
		display: flex;
		flex-direction: column;
	}

	.filters header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 72px;
		padding: 0 1.5rem;
		border-bottom: 1px solid var(--line);
	}

	.filters h2 {
		font-size: 28px;
	}

	.filters header button {
		width: 44px;
		height: 44px;
		display: grid;
		place-items: center;
		margin-right: -10px;
	}

	.filters-body {
		flex: 1;
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: 0.5rem 1.5rem 2rem;
	}

	fieldset {
		border: 0;
		margin: 0;
		padding: 1.5rem 0;
		border-bottom: 1px solid var(--line);
	}

	legend {
		float: left;
		width: 100%;
		margin-bottom: 1rem;
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 0.2em;
		text-transform: uppercase;
	}

	.size-grid {
		clear: both;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(52px, 1fr));
		gap: 0.4rem;
	}

	.size-grid button {
		height: 44px;
		border: 1px solid var(--line-2);
		font-size: 13px;
		transition:
			background 0.2s,
			color 0.2s,
			border-color 0.2s;
	}

	.size-grid button.on {
		background: var(--ink);
		color: var(--paper);
		border-color: var(--ink);
	}

	.color-list {
		clear: both;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.35rem 1rem;
	}

	.color-list button {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		padding: 0.45rem 0;
		font-size: 14px;
		text-align: left;
		color: var(--ink-2);
	}

	.color-list button.on {
		color: var(--ink);
		font-weight: 500;
	}

	.dot {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: var(--c);
		box-shadow:
			0 0 0 1px rgb(31 27 24 / 0.15) inset,
			0 0 0 2px var(--ivory),
			0 0 0 2px transparent;
		transition: box-shadow 0.2s;
	}

	.dot.pattern {
		background:
			radial-gradient(circle at 30% 30%, #f4efe7 0 2px, transparent 2.5px),
			radial-gradient(circle at 70% 65%, #6b2a34 0 2px, transparent 2.5px),
			var(--c);
	}

	.on .dot {
		box-shadow:
			0 0 0 1px rgb(31 27 24 / 0.15) inset,
			0 0 0 2px var(--ivory),
			0 0 0 3px var(--ink);
	}

	.checks {
		clear: both;
		display: grid;
		gap: 0.8rem;
	}

	fieldset > .check {
		clear: both;
	}

	.filters footer {
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: 0.5rem;
		padding: 1rem 1.5rem 1.5rem;
		border-top: 1px solid var(--line);
	}

	.filters footer .btn {
		padding: 0 1rem;
	}
</style>
