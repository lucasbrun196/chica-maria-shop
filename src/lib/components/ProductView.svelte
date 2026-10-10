<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { reveal } from '$lib/actions/reveal';
	import {
		completeTheLook,
		discountPercent,
		getCategory,
		related,
		sizeGuide,
		type Product
	} from '$lib/data/products';
	import { cart } from '$lib/stores/cart.svelte';
	import { ui } from '$lib/stores/ui.svelte';
	import { wishlist } from '$lib/stores/wishlist.svelte';
	import { installments, money, pixPrice } from '$lib/utils/format';
	import { digits, maskCEP } from '$lib/utils/masks';
	import { quoteShipping, type ShippingOption } from '$lib/utils/shipping';
	import Accordion from './Accordion.svelte';
	import Breadcrumbs from './Breadcrumbs.svelte';
	import Icon from './Icon.svelte';
	import Modal from './Modal.svelte';
	import PhotoPlaceholder from './PhotoPlaceholder.svelte';
	import ProductCard from './ProductCard.svelte';
	import ProductRail from './ProductRail.svelte';
	import QtyStepper from './QtyStepper.svelte';

	let { product }: { product: Product } = $props();

	const VIEWS = ['Frente', 'Costas', 'Detalhe do tecido', 'Look completo', 'Movimento'];

	let colorIdx = $state(0);
	let picked = $state('');
	let qty = $state(1);
	let sizeError = $state(false);
	let shakeKey = $state(0);
	let guideOpen = $state(false);
	let cep = $state('');
	let cepError = $state('');
	let quoting = $state(false);
	let quote = $state<ShippingOption[] | null>(null);
	let slide = $state(0);
	let showSticky = $state(false);
	let addRow: HTMLElement;
	let sizeBlock = $state<HTMLElement>();

	const category = $derived(getCategory(product.category)!);
	const color = $derived(product.colors[colorIdx] ?? product.colors[0]);
	const size = $derived(product.sizes.length === 1 ? product.sizes[0] : picked);
	const off = $derived(discountPercent(product));
	const inst = $derived(installments(product.price));
	const fav = $derived(wishlist.has(product.id));
	const look = $derived(completeTheLook(product));
	const more = $derived(related(product));
	const guide = $derived(product.sizes.includes('38') ? sizeGuide.jeans : sizeGuide.roupas);
	const hasGuide = $derived(product.sizes.length > 1 && product.category !== 'acessorios');

	function pickSize(s: string) {
		if (product.unavailable.includes(s)) {
			ui.toast(`Avisaremos por e-mail quando o tamanho ${s} voltar ao estoque.`);
			return;
		}
		picked = s;
		sizeError = false;
	}

	function addToBag() {
		if (!size) {
			sizeError = true;
			shakeKey++;
			sizeBlock?.scrollIntoView({ behavior: 'smooth', block: 'center' });
			return;
		}
		cart.add(product.id, size, color.name, qty);
		cart.open();
	}

	function toggleFav() {
		const added = wishlist.toggle(product.id);
		ui.toast(added ? 'Peça salva nos favoritos' : 'Peça removida dos favoritos');
	}

	async function calcShipping(e: SubmitEvent) {
		e.preventDefault();
		if (digits(cep).length !== 8) {
			cepError = 'Digite um CEP com 8 números.';
			return;
		}
		cepError = '';
		quoting = true;
		await new Promise((r) => setTimeout(r, 650));
		quote = quoteShipping(cep, product.price * qty);
		quoting = false;
	}

	let ticking = false;
	function onGalleryScroll(e: Event) {
		if (ticking) return;
		ticking = true;
		const el = e.currentTarget as HTMLElement;
		requestAnimationFrame(() => {
			ticking = false;
			slide = Math.round(el.scrollLeft / el.clientWidth);
		});
	}

	// zoom que segue o mouse (só desktop)
	function zoomMove(e: PointerEvent) {
		const el = e.currentTarget as HTMLElement;
		const r = el.getBoundingClientRect();
		el.style.setProperty('--ox', `${((e.clientX - r.left) / r.width) * 100}%`);
		el.style.setProperty('--oy', `${((e.clientY - r.top) / r.height) * 100}%`);
	}

	$effect(() => {
		const io = new IntersectionObserver(([entry]) => {
			showSticky = !entry.isIntersecting && entry.boundingClientRect.top < 0;
		});
		io.observe(addRow);
		return () => io.disconnect();
	});
</script>

<svelte:head>
	<title>{product.name} — Chica Maria</title>
	<meta name="description" content={product.description} />
</svelte:head>

<div class="container pdp">
	<div class="crumbs">
		<Breadcrumbs items={[{ label: 'Loja', href: '/loja' }, { label: category.short, href: `/loja/${category.slug}` }, { label: product.name }]} />
	</div>

	<div class="layout">
		<!-- Galeria -->
		<div class="gallery-wrap">
			<div class="gallery" onscroll={onGalleryScroll}>
				{#each VIEWS as view, i (view)}
					<figure class="shot" class:wide={i === 0} onpointermove={zoomMove}>
						{#key color.hex}
							<div class="shot-inner" in:fade={{ duration: 500, delay: i * 40 }}>
								<PhotoPlaceholder
									tone={color.hex}
									mix={i % 2 ? 62 : 52}
									caption="{product.name} · {view}"
									ratio={i === 0 ? '4 / 5' : '3 / 4'}
								/>
							</div>
						{/key}
					</figure>
				{/each}
			</div>
			<div class="dots" aria-hidden="true">
				{#each VIEWS as view, i (view)}<span class:on={i === slide}></span>{/each}
			</div>
			<div class="gallery-badges">
				{#if product.tags.includes('novo')}<span>Novo</span>{/if}
				{#if off}<span class="sale">−{off}%</span>{/if}
			</div>
		</div>

		<!-- Informações -->
		<div class="info">
			<div class="info-inner">
				<p class="eyebrow">{category.short}{product.tags.includes('mais-vendido') ? ' · Mais vendida' : ''}</p>
				<h1 class="name">{product.name}</h1>

				<div class="prices">
					<p class="price">
						{#if product.compareAt}<s>{money(product.compareAt)}</s>{/if}
						<span class:sale={!!off}>{money(product.price)}</span>
					</p>
					<p class="sub">
						{inst.n}x de {money(inst.value)} sem juros ·
						<strong>{money(pixPrice(product.price))}</strong> no Pix
					</p>
				</div>

				<div class="block">
					<p class="label">Cor: <span>{color.name}</span></p>
					<div class="swatches">
						{#each product.colors as c, i (c.name)}
							<button
								class:on={i === colorIdx}
								style:--c={c.hex}
								onclick={() => (colorIdx = i)}
								aria-label={c.name}
								aria-pressed={i === colorIdx}
								title={c.name}
							></button>
						{/each}
					</div>
				</div>

				{#if product.sizes.length > 1}
					<div class="block" bind:this={sizeBlock}>
						<div class="label-row">
							<p class="label">Tamanho{size ? ':' : ''} <span>{size}</span></p>
							{#if hasGuide}
								<button class="guide-btn" onclick={() => (guideOpen = true)}>
									<Icon name="ruler" size={16} /> Guia de medidas
								</button>
							{/if}
						</div>
						{#key shakeKey}
							<div class="sizes" class:shake={shakeKey > 0 && sizeError}>
								{#each product.sizes as s (s)}
									{@const out = product.unavailable.includes(s)}
									<button
										class:on={size === s}
										class:out
										onclick={() => pickSize(s)}
										aria-pressed={size === s}
										aria-label={out ? `${s}, esgotado. Avise-me` : s}
										title={out ? 'Esgotado. Clique para ser avisada' : ''}>{s}</button
									>
								{/each}
							</div>
						{/key}
						{#if sizeError}
							<p class="error" transition:fade={{ duration: 200 }}>Escolha um tamanho para continuar.</p>
						{/if}
					</div>
				{/if}

				<div class="buy" bind:this={addRow}>
					<QtyStepper value={qty} onchange={(v) => (qty = Math.max(1, v))} />
					<button class="btn add" onclick={addToBag}>Adicionar à sacola</button>
					<button class="fav" class:on={fav} onclick={toggleFav} aria-pressed={fav} aria-label="Favoritar">
						<Icon name="heart" size={21} filled={fav} />
					</button>
				</div>

				<ul class="perks">
					<li><Icon name="truck" size={18} /> Frete grátis acima de R$ 399</li>
					<li><Icon name="return" size={18} /> Primeira troca grátis em até 30 dias</li>
					<li><Icon name="store" size={18} /> Retire na loja em Passo Fundo</li>
				</ul>

				<form class="ship" onsubmit={calcShipping} novalidate>
					<label for="pdp-cep" class="label">Calcular frete e prazo</label>
					<div class="ship-row">
						<input
							id="pdp-cep"
							class="input"
							inputmode="numeric"
							placeholder="00000-000"
							value={cep}
							oninput={(e) => {
								cep = maskCEP(e.currentTarget.value);
								e.currentTarget.value = cep;
							}}
						/>
						<button class="btn btn--ghost btn--sm" type="submit" disabled={quoting}>
							{quoting ? 'Calculando…' : 'Calcular'}
						</button>
					</div>
					{#if cepError}<p class="error">{cepError}</p>{/if}
					{#if quote}
						<ul class="quote" in:fly={{ y: 8, duration: 400 }}>
							{#each quote as q (q.id)}
								<li>
									<span>
										<strong>{q.label}</strong>
										<small>{q.detail}</small>
									</span>
									<span class="q-price">{q.price === 0 ? 'Grátis' : money(q.price)}</span>
								</li>
							{/each}
						</ul>
					{/if}
					<a
						class="text-link small"
						href="https://buscacepinter.correios.com.br/app/endereco/index.php"
						target="_blank"
						rel="noopener noreferrer">Não sei meu CEP</a
					>
				</form>

				<div class="accs">
					<Accordion title="Descrição" open>
						<p>{product.description}</p>
						<ul class="bullets">
							{#each product.details as d (d)}<li>{d}</li>{/each}
						</ul>
						<p class="ref">Ref. {product.id.toUpperCase()}</p>
					</Accordion>
					<Accordion title="Composição e cuidados">
						<p><strong>Composição:</strong> {product.composition}</p>
						<ul class="bullets">
							{#each product.care as c (c)}<li>{c}</li>{/each}
						</ul>
					</Accordion>
					<Accordion title="Modelagem">
						<p>{product.fit}</p>
						{#if hasGuide}
							<button class="text-link" onclick={() => (guideOpen = true)}>Ver tabela de medidas</button>
						{/if}
					</Accordion>
					<Accordion title="Entrega e trocas">
						<p>
							Enviamos para todo o Brasil pelos Correios, com frete grátis acima de R$ 399. Em Passo Fundo, você
							pode receber por motoboy em até 1 dia útil ou retirar na loja.
						</p>
						<p>
							A primeira troca é grátis em até 30 dias após o recebimento, com a peça sem uso e com etiqueta.
							<a href="/ajuda#trocas" class="text-link">Saiba mais</a>
						</p>
					</Accordion>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Complete o look -->
<section class="container section">
	<div class="section-head" data-reveal use:reveal>
		<p class="eyebrow">Sugestão da equipe</p>
		<h2 class="title">Complete o look</h2>
	</div>
	<ul class="grid4">
		{#each look as p, i (p.id)}
			<li data-reveal use:reveal={i * 90}><ProductCard product={p} /></li>
		{/each}
	</ul>
</section>

{#if more.length}
	<section class="container section">
		<div class="section-head" data-reveal use:reveal>
			<p class="eyebrow">Na mesma categoria</p>
			<h2 class="title">Você também pode gostar</h2>
		</div>
		<div data-reveal use:reveal={100}>
			<ProductRail products={more} />
		</div>
	</section>
{/if}

<!-- Barra fixa no celular -->
{#if showSticky}
	<div class="sticky-bar" transition:fly={{ y: 80, duration: 450, easing: quintOut }}>
		<div>
			<p class="sb-name">{product.name}</p>
			<p class="sb-price">{money(product.price)}{size ? ` · Tam. ${size}` : ''}</p>
		</div>
		<button class="btn btn--sm" onclick={addToBag}>Adicionar</button>
	</div>
{/if}

<Modal open={guideOpen} title="Guia de medidas" onclose={() => (guideOpen = false)}>
	<p class="guide-intro">Medidas do corpo, em centímetros. Se estiver entre dois tamanhos, escolha o maior.</p>
	<table class="guide-table">
		<thead>
			<tr>{#each guide.headers as h (h)}<th>{h}</th>{/each}</tr>
		</thead>
		<tbody>
			{#each guide.rows as row (row[0])}
				<tr class:hl={row[0] === size}>{#each row as cell, i (i)}<td>{cell}</td>{/each}</tr>
			{/each}
		</tbody>
	</table>
	<div class="how">
		<p class="label">Como medir</p>
		<p><strong>Busto:</strong> passe a fita na parte mais cheia do busto, sem apertar.</p>
		<p><strong>Cintura:</strong> na parte mais fina do tronco, normalmente acima do umbigo.</p>
		<p><strong>Quadril:</strong> na parte mais larga, com os pés juntos.</p>
	</div>
	<p class="guide-help">
		Ficou com dúvida? Chame a gente no WhatsApp que ajudamos a escolher.
	</p>
</Modal>

<style>
	.pdp {
		padding-top: 1.5rem;
	}

	.crumbs {
		margin-bottom: 1.5rem;
	}

	.layout {
		display: grid;
		grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
		gap: clamp(2rem, 4.5vw, 5.5rem);
		align-items: start;
	}

	/* Galeria */
	.gallery-wrap {
		position: relative;
	}

	.gallery {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 6px;
	}

	.shot {
		margin: 0;
		overflow: hidden;
		cursor: zoom-in;
	}

	.shot.wide {
		grid-column: span 2;
	}

	.shot-inner {
		transform-origin: var(--ox, 50%) var(--oy, 50%);
		transition: transform 0.7s var(--ease-out);
	}

	@media (hover: hover) and (min-width: 900px) {
		.shot:hover .shot-inner {
			transform: scale(1.6);
		}
	}

	.dots {
		display: none;
	}

	.gallery-badges {
		position: absolute;
		top: 14px;
		left: 14px;
		display: flex;
		gap: 6px;
		pointer-events: none;
	}

	.gallery-badges span {
		padding: 6px 9px 5px;
		background: var(--paper);
		font-size: 10px;
		font-weight: 500;
		letter-spacing: 0.18em;
		text-transform: uppercase;
	}

	.gallery-badges .sale {
		background: var(--wine);
		color: var(--paper);
	}

	/* Info */
	.info {
		position: sticky;
		top: calc(var(--header-h) + 1.5rem);
	}

	.info-inner {
		display: grid;
		gap: 1.75rem;
	}

	.name {
		font-size: clamp(2.2rem, 3.4vw, 3.4rem);
		line-height: 1;
		margin-top: -0.75rem;
	}

	.prices {
		display: grid;
		gap: 0.35rem;
		margin-top: -0.5rem;
	}

	.price {
		display: flex;
		gap: 0.75rem;
		align-items: baseline;
		font-size: 21px;
	}

	.price s {
		font-size: 15px;
		color: var(--ink-3);
	}

	.price .sale {
		color: var(--wine);
	}

	.sub {
		font-size: 13.5px;
		color: var(--ink-2);
	}

	.sub strong {
		font-weight: 500;
		color: var(--ink);
	}

	.label {
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		margin-bottom: 0.8rem;
	}

	.label span {
		color: var(--ink-3);
		letter-spacing: 0.06em;
		text-transform: none;
		font-weight: 400;
		font-size: 13px;
	}

	.label-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	.guide-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		font-size: 12px;
		color: var(--ink-2);
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.swatches {
		display: flex;
		gap: 0.6rem;
	}

	.swatches button {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background: var(--c);
		box-shadow:
			0 0 0 1px rgb(31 27 24 / 0.15) inset,
			0 0 0 3px var(--ivory),
			0 0 0 3px transparent;
		transition: box-shadow 0.25s;
	}

	.swatches button.on {
		box-shadow:
			0 0 0 1px rgb(31 27 24 / 0.15) inset,
			0 0 0 3px var(--ivory),
			0 0 0 4px var(--ink);
	}

	.sizes {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(56px, 1fr));
		gap: 0.4rem;
	}

	.sizes button {
		position: relative;
		height: 48px;
		border: 1px solid var(--line-2);
		font-size: 13.5px;
		letter-spacing: 0.04em;
		transition:
			background 0.25s,
			color 0.25s,
			border-color 0.25s;
	}

	.sizes button:hover:not(.on) {
		border-color: var(--ink);
	}

	.sizes button.on {
		background: var(--ink);
		color: var(--paper);
		border-color: var(--ink);
	}

	.sizes button.out {
		color: var(--ink-3);
		background:
			linear-gradient(to top right, transparent calc(50% - 0.5px), var(--line-2) 50%, transparent calc(50% + 0.5px));
	}

	.shake {
		animation: shake 0.45s var(--ease);
	}

	@keyframes shake {
		20%,
		60% {
			transform: translateX(-6px);
		}
		40%,
		80% {
			transform: translateX(6px);
		}
	}

	.error {
		margin-top: 0.6rem;
		font-size: 12.5px;
		color: var(--danger);
	}

	.buy {
		display: grid;
		grid-template-columns: auto 1fr auto;
		gap: 0.5rem;
	}

	.add {
		width: 100%;
		min-width: 0;
		padding-inline: 1rem;
	}

	.fav {
		width: 52px;
		height: 52px;
		display: grid;
		place-items: center;
		border: 1px solid var(--line-2);
		transition:
			border-color 0.25s,
			color 0.25s;
	}

	.fav:hover {
		border-color: var(--ink);
	}

	.fav.on {
		color: var(--wine);
	}

	.perks {
		display: grid;
		gap: 0.6rem;
		padding: 1.25rem 0;
		border-block: 1px solid var(--line);
		font-size: 13.5px;
		color: var(--ink-2);
	}

	.perks li {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.ship-row {
		display: flex;
		gap: 0.75rem;
		align-items: center;
	}

	.ship .input {
		height: 42px;
	}

	.quote {
		margin-top: 1rem;
		display: grid;
		border-top: 1px solid var(--line);
	}

	.quote li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem 0;
		border-bottom: 1px solid var(--line);
		font-size: 13.5px;
	}

	.quote strong {
		display: block;
		font-weight: 500;
	}

	.quote small {
		font-size: 12px;
		color: var(--ink-3);
	}

	.q-price {
		white-space: nowrap;
	}

	.small {
		display: inline-block;
		margin-top: 0.75rem;
		font-size: 12px;
		color: var(--ink-3);
	}

	.accs {
		margin-top: -0.5rem;
		border-top: 1px solid var(--line);
	}

	.accs p + p,
	.accs p + ul,
	.accs ul + p {
		margin-top: 0.75rem;
	}

	.bullets {
		list-style: none;
		display: grid;
		gap: 0.3rem;
	}

	.bullets li {
		position: relative;
		padding-left: 1.1rem;
	}

	.bullets li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.8em;
		width: 6px;
		height: 1px;
		background: currentColor;
	}

	.ref {
		font-size: 12px;
		color: var(--ink-3);
		letter-spacing: 0.08em;
	}

	.accs strong {
		font-weight: 500;
		color: var(--ink);
	}

	@media (max-width: 900px) {
		.pdp {
			padding-inline: 0;
		}

		.crumbs,
		.info {
			padding-inline: var(--gutter);
		}

		.layout {
			grid-template-columns: minmax(0, 1fr);
		}

		.gallery {
			display: flex;
			gap: 0;
			overflow-x: auto;
			scroll-snap-type: x mandatory;
			scrollbar-width: none;
			overscroll-behavior-x: contain;
		}

		.gallery::-webkit-scrollbar {
			display: none;
		}

		.shot {
			flex: 0 0 100%;
			scroll-snap-align: start;
			cursor: default;
		}

		.shot :global(.ph) {
			aspect-ratio: 4 / 5 !important;
		}

		.dots {
			display: flex;
			justify-content: center;
			gap: 6px;
			margin-top: 0.9rem;
		}

		.dots span {
			width: 18px;
			height: 1px;
			background: var(--line-2);
			transition:
				background 0.3s,
				width 0.4s var(--ease-out);
		}

		.dots span.on {
			width: 34px;
			background: var(--ink);
		}

		.info {
			position: static;
		}
	}

	/* Seções abaixo */
	.section {
		padding-top: clamp(5rem, 9vw, 8rem);
	}

	.section-head {
		margin-bottom: 2.5rem;
	}

	.section-head .eyebrow {
		margin-bottom: 1rem;
	}

	.grid4 {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 2.5rem 1.25rem;
	}

	@media (max-width: 1023px) {
		.grid4 {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 2rem 0.75rem;
		}
	}

	/* Barra fixa */
	.sticky-bar {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 45;
		display: none;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.75rem var(--gutter) max(0.75rem, env(safe-area-inset-bottom));
		background: var(--paper);
		border-top: 1px solid var(--line);
	}

	@media (max-width: 900px) {
		.sticky-bar {
			display: flex;
		}
	}

	.sticky-bar > div {
		min-width: 0;
	}

	.sb-name {
		font-family: var(--serif);
		font-size: 17px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.sb-price {
		font-size: 12.5px;
		color: var(--ink-3);
	}

	/* Modal de medidas */
	.guide-intro {
		font-size: 14px;
		color: var(--ink-2);
		margin-bottom: 1.25rem;
	}

	.guide-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 14px;
		font-variant-numeric: tabular-nums;
	}

	.guide-table th {
		text-align: left;
		font-size: 10.5px;
		font-weight: 500;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		padding: 0.75rem 0.5rem;
		border-bottom: 1px solid var(--ink);
	}

	.guide-table td {
		padding: 0.8rem 0.5rem;
		border-bottom: 1px solid var(--line);
	}

	.guide-table tr.hl td {
		background: var(--sand);
	}

	.how {
		margin-top: 1.75rem;
		display: grid;
		gap: 0.4rem;
		font-size: 14px;
		color: var(--ink-2);
	}

	.how strong {
		font-weight: 500;
		color: var(--ink);
	}

	.guide-help {
		margin-top: 1.5rem;
		font-size: 13px;
		color: var(--ink-3);
	}
</style>
