<script lang="ts">
	import type { Product } from '$lib/data/products';
	import { discountPercent } from '$lib/data/products';
	import { cart } from '$lib/stores/cart.svelte';
	import { wishlist } from '$lib/stores/wishlist.svelte';
	import { ui } from '$lib/stores/ui.svelte';
	import { installments, money } from '$lib/utils/format';
	import Icon from './Icon.svelte';
	import PhotoPlaceholder from './PhotoPlaceholder.svelte';

	interface Props {
		product: Product;
		quickAdd?: boolean;
	}

	let { product, quickAdd = true }: Props = $props();

	let colorIdx = $state(0);
	const color = $derived(product.colors[colorIdx] ?? product.colors[0]);
	const off = $derived(discountPercent(product));
	const inst = $derived(installments(product.price));
	const fav = $derived(wishlist.has(product.id));
	const href = $derived(`/produto/${product.slug}`);

	function add(size: string) {
		cart.add(product.id, size, color.name);
		cart.open();
	}

	function toggleFav() {
		const added = wishlist.toggle(product.id);
		ui.toast(added ? 'Peça salva nos favoritos' : 'Peça removida dos favoritos');
	}
</script>

<article class="card">
	<div class="media">
		<a {href} class="photo" tabindex="-1" aria-hidden="true">
			<span class="main"><PhotoPlaceholder tone={color.hex} caption={product.name} /></span>
			<span class="alt">
				<PhotoPlaceholder tone={color.hex} mix={68} caption="Vista de costas" />
			</span>
		</a>

		<div class="badges">
			{#if product.tags.includes('novo')}<span>Novo</span>{/if}
			{#if off}<span class="sale">−{off}%</span>{/if}
			{#if product.tags.includes('ultimas')}<span>Últimas peças</span>{/if}
		</div>

		<button
			class="fav"
			class:on={fav}
			aria-pressed={fav}
			aria-label={fav ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
			onclick={toggleFav}
		>
			<Icon name="heart" size={19} filled={fav} />
		</button>

		{#if quickAdd}
			<div class="quick">
				<span class="quick-label">Adicionar à sacola</span>
				<div class="sizes">
					{#each product.sizes as s (s)}
						<button
							disabled={product.unavailable.includes(s)}
							onclick={() => add(s)}
							aria-label="Adicionar tamanho {s}">{s}</button
						>
					{/each}
				</div>
			</div>
		{/if}
	</div>

	<div class="info">
		<a {href} class="name">{product.name}</a>
		<p class="price">
			{#if product.compareAt}<s>{money(product.compareAt)}</s>{/if}
			<span class:sale={!!off}>{money(product.price)}</span>
		</p>
		<p class="inst">{inst.n}x de {money(inst.value)} sem juros</p>
		{#if product.colors.length > 1}
			<div class="swatches" role="group" aria-label="Cores disponíveis">
				{#each product.colors as c, i (c.name)}
					<button
						class:active={i === colorIdx}
						style:--c={c.hex}
						aria-label={c.name}
						title={c.name}
						onmouseenter={() => (colorIdx = i)}
						onfocus={() => (colorIdx = i)}
						onclick={() => (colorIdx = i)}
					></button>
				{/each}
			</div>
		{/if}
	</div>
</article>

<style>
	.card {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		min-width: 0;
	}

	.media {
		position: relative;
		overflow: hidden;
		background: var(--sand);
	}

	.photo {
		display: block;
		position: relative;
	}

	.main,
	.alt {
		display: block;
		transition:
			transform 1.4s var(--ease-out),
			opacity 0.7s var(--ease);
	}

	.alt {
		position: absolute;
		inset: 0;
		opacity: 0;
	}

	@media (hover: hover) {
		.card:hover .main {
			transform: scale(1.035);
		}

		.card:hover .alt {
			opacity: 1;
			transform: scale(1.035);
		}
	}

	.badges {
		position: absolute;
		top: 12px;
		left: 12px;
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		pointer-events: none;
	}

	.badges span {
		padding: 5px 8px 4px;
		background: var(--paper);
		font-size: 9.5px;
		font-weight: 500;
		letter-spacing: 0.18em;
		text-transform: uppercase;
	}

	.badges .sale {
		background: var(--wine);
		color: var(--paper);
	}

	.fav {
		position: absolute;
		top: 8px;
		right: 8px;
		width: 40px;
		height: 40px;
		display: grid;
		place-items: center;
		color: var(--ink);
		transition: transform 0.3s var(--ease-out);
	}

	.fav.on {
		color: var(--wine);
	}

	.fav:active {
		transform: scale(0.88);
	}

	.quick {
		position: absolute;
		left: 10px;
		right: 10px;
		bottom: 10px;
		padding: 0.85rem 0.75rem 0.75rem;
		background: rgb(250 247 242 / 0.94);
		backdrop-filter: blur(6px);
		-webkit-backdrop-filter: blur(6px);
		text-align: center;
		transform: translate3d(0, calc(100% + 12px), 0);
		transition: transform 0.6s var(--ease-out);
	}

	@media (hover: hover) {
		.card:hover .quick,
		.quick:focus-within {
			transform: none;
		}
	}

	@media (hover: none) {
		.quick {
			display: none;
		}
	}

	.quick-label {
		display: block;
		font-size: 10px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--ink-3);
		margin-bottom: 0.5rem;
	}

	.sizes {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 2px;
	}

	.sizes button {
		min-width: 38px;
		height: 32px;
		padding: 0 0.5rem;
		font-size: 12px;
		letter-spacing: 0.06em;
		transition:
			background 0.25s,
			color 0.25s;
	}

	.sizes button:hover:not(:disabled) {
		background: var(--ink);
		color: var(--paper);
	}

	.sizes button:disabled {
		color: var(--ink-3);
		text-decoration: line-through;
		cursor: not-allowed;
		opacity: 0.6;
	}

	.info {
		display: grid;
		gap: 0.2rem;
	}

	.name {
		font-family: var(--serif);
		font-size: 19px;
		line-height: 1.2;
		width: fit-content;
	}

	.name:hover {
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 4px;
	}

	.price {
		display: flex;
		gap: 0.6rem;
		align-items: baseline;
		font-size: 14px;
		letter-spacing: 0.02em;
	}

	.price s {
		color: var(--ink-3);
		font-size: 13px;
	}

	.price .sale {
		color: var(--wine);
	}

	.inst {
		font-size: 12.5px;
		color: var(--ink-3);
	}

	.swatches {
		display: flex;
		gap: 6px;
		margin-top: 0.5rem;
	}

	.swatches button {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: var(--c);
		box-shadow:
			0 0 0 1px rgb(31 27 24 / 0.15) inset,
			0 0 0 2px var(--ivory),
			0 0 0 2px transparent;
		transition: box-shadow 0.25s;
	}

	.swatches button.active {
		box-shadow:
			0 0 0 1px rgb(31 27 24 / 0.15) inset,
			0 0 0 2px var(--ivory),
			0 0 0 3px var(--ink);
	}
</style>
