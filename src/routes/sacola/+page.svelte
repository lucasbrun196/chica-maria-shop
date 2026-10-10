<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { reveal } from '$lib/actions/reveal';
	import { bestSellers, getProduct } from '$lib/data/products';
	import { auth } from '$lib/stores/auth.svelte';
	import { cart } from '$lib/stores/cart.svelte';
	import { wishlist } from '$lib/stores/wishlist.svelte';
	import { ui } from '$lib/stores/ui.svelte';
	import { installments, money, pixPrice } from '$lib/utils/format';
	import CouponForm from '$lib/components/CouponForm.svelte';
	import FreeShipping from '$lib/components/FreeShipping.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import PhotoPlaceholder from '$lib/components/PhotoPlaceholder.svelte';
	import ProductRail from '$lib/components/ProductRail.svelte';
	import QtyStepper from '$lib/components/QtyStepper.svelte';

	const total = $derived(cart.subtotal - cart.couponDiscount);
	const inst = $derived(installments(total));
	const checkoutHref = $derived(auth.user ? '/checkout' : '/entrar?voltar=/checkout');
	const suggestions = $derived(
		bestSellers()
			.concat()
			.filter((p) => !cart.lines.some((l) => l.id === p.id))
	);

	function saveForLater(key: string, id: string) {
		if (!wishlist.has(id)) wishlist.toggle(id);
		cart.remove(key);
		ui.toast('Peça movida para os favoritos');
	}
</script>

<svelte:head>
	<title>Sacola — Chica Maria</title>
</svelte:head>

<section class="container page">
	<header class="head">
		<h1 class="display">Sacola</h1>
		{#if cart.count}<p class="muted">{cart.count} {cart.count === 1 ? 'peça' : 'peças'}</p>{/if}
	</header>

	{#if cart.lines.length}
		<div class="layout">
			<div>
				<div class="ship"><FreeShipping subtotal={cart.subtotal} /></div>
				<ul class="lines">
					{#each cart.lines as line (line.key)}
						{@const p = getProduct(line.id)!}
						{@const color = p.colors.find((c) => c.name === line.color) ?? p.colors[0]}
						<li class="line" animate:flip={{ duration: 450, easing: quintOut }} out:fly={{ x: -40, duration: 300 }}>
							<a href="/produto/{p.slug}" class="thumb">
								<PhotoPlaceholder tone={color.hex} caption={p.name} hanger={false} />
							</a>
							<div class="meta">
								<div class="top">
									<div>
										<a href="/produto/{p.slug}" class="name">{p.name}</a>
										<p class="opts">Cor: {line.color}</p>
										<p class="opts">Tamanho: {line.size}</p>
										<p class="unit">{money(p.price)} cada</p>
									</div>
									<p class="price">{money(p.price * line.qty)}</p>
								</div>
								<div class="bottom">
									<QtyStepper value={line.qty} min={1} small onchange={(v) => cart.setQty(line.key, v)} />
									<div class="actions">
										<button onclick={() => saveForLater(line.key, p.id)}>Mover para favoritos</button>
										<button onclick={() => cart.remove(line.key)}><Icon name="trash" size={15} /> Remover</button>
									</div>
								</div>
							</div>
						</li>
					{/each}
				</ul>
				<a href="/loja" class="link back"><Icon name="arrow-left" size={14} /> Continuar comprando</a>
			</div>

			<aside class="summary">
				<h2>Resumo</h2>
				<dl>
					<div><dt>Subtotal</dt><dd>{money(cart.subtotal)}</dd></div>
					{#if cart.couponDiscount}
						<div class="discount"><dt>Cupom {cart.coupon}</dt><dd>−{money(cart.couponDiscount)}</dd></div>
					{/if}
					<div><dt>Frete</dt><dd class="muted">Calculado no checkout</dd></div>
				</dl>
				<div class="coupon"><CouponForm /></div>
				<div class="total">
					<span>Total</span>
					<strong>{money(total)}</strong>
				</div>
				<p class="pay">
					ou {inst.n}x de {money(inst.value)} sem juros<br />
					<strong>{money(pixPrice(total))}</strong> no Pix (5% de desconto)
				</p>
				<a href={checkoutHref} class="btn btn--block"><Icon name="lock" size={15} /> Finalizar compra</a>
				{#if !auth.user}
					<p class="login-note">Você vai entrar na sua conta ou criar uma antes de pagar.</p>
				{/if}
				<ul class="trust">
					<li><Icon name="shield" size={16} /> Pagamento seguro</li>
					<li><Icon name="return" size={16} /> Primeira troca grátis</li>
				</ul>
			</aside>
		</div>
	{:else}
		<div class="empty">
			<p class="empty-title">Sua sacola está vazia.</p>
			<p class="muted">As peças que você adicionar aparecem aqui.</p>
			<div class="empty-actions">
				<a href="/loja/novidades" class="btn">Ver novidades</a>
				{#if wishlist.count}<a href="/favoritos" class="btn btn--ghost">Ver favoritos ({wishlist.count})</a>{/if}
			</div>
		</div>
	{/if}
</section>

{#if suggestions.length}
	<section class="container more">
		<div class="more-head" data-reveal use:reveal>
			<p class="eyebrow">Para completar</p>
			<h2 class="title">As mais vendidas</h2>
		</div>
		<ProductRail products={suggestions} />
	</section>
{/if}

<style>
	.page {
		padding-top: clamp(2rem, 4vw, 3.5rem);
	}

	.head {
		display: flex;
		align-items: baseline;
		gap: 1.5rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid var(--line);
		margin-bottom: 2.5rem;
	}

	.head h1 {
		font-size: clamp(3rem, 6vw, 5.5rem);
	}

	.layout {
		display: grid;
		grid-template-columns: minmax(0, 1.7fr) minmax(300px, 1fr);
		gap: clamp(2rem, 5vw, 5rem);
		align-items: start;
	}

	@media (max-width: 900px) {
		.layout {
			grid-template-columns: 1fr;
		}
	}

	.ship {
		padding-bottom: 1.5rem;
		border-bottom: 1px solid var(--line);
	}

	.line {
		display: grid;
		grid-template-columns: clamp(96px, 12vw, 150px) 1fr;
		gap: clamp(1rem, 2vw, 1.75rem);
		padding: 1.75rem 0;
		border-bottom: 1px solid var(--line);
	}

	.meta {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 1rem;
		min-width: 0;
	}

	.top {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
	}

	.name {
		display: block;
		font-family: var(--serif);
		font-size: clamp(19px, 1.8vw, 24px);
		line-height: 1.15;
		margin-bottom: 0.5rem;
	}

	.opts,
	.unit {
		font-size: 13px;
		color: var(--ink-3);
	}

	.price {
		font-size: 15px;
		white-space: nowrap;
	}

	.bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.actions {
		display: flex;
		gap: 1.25rem;
	}

	.actions button {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 11px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-3);
		transition: color 0.2s;
	}

	.actions button:hover {
		color: var(--ink);
	}

	.back {
		margin-top: 2rem;
	}

	.summary {
		position: sticky;
		top: calc(var(--header-h) + 1.5rem);
		padding: clamp(1.5rem, 3vw, 2.25rem);
		background: var(--paper);
		border: 1px solid var(--line);
		display: grid;
		gap: 1.25rem;
	}

	.summary h2 {
		font-size: 30px;
	}

	dl {
		margin: 0;
		display: grid;
		gap: 0.7rem;
		font-size: 14px;
	}

	dl div {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
	}

	dd {
		margin: 0;
	}

	.discount {
		color: var(--ok);
	}

	.coupon {
		padding: 1rem 0;
		border-block: 1px solid var(--line);
	}

	.total {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		font-size: 12px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}

	.total strong {
		font-family: var(--serif);
		font-size: 32px;
		font-weight: 500;
		letter-spacing: 0;
	}

	.pay {
		font-size: 13px;
		color: var(--ink-2);
		margin-top: -0.75rem;
		text-align: right;
	}

	.pay strong {
		font-weight: 500;
		color: var(--ink);
	}

	.login-note {
		font-size: 12.5px;
		color: var(--ink-3);
		text-align: center;
		margin-top: -0.5rem;
	}

	.trust {
		display: flex;
		justify-content: center;
		gap: 1.5rem;
		font-size: 12px;
		color: var(--ink-3);
	}

	.trust li {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.empty {
		display: grid;
		justify-items: center;
		text-align: center;
		gap: 0.75rem;
		padding: 4rem 0;
	}

	.empty-title {
		font-family: var(--serif);
		font-size: 36px;
	}

	.empty-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		justify-content: center;
		margin-top: 1.25rem;
	}

	.more {
		padding-top: clamp(5rem, 9vw, 8rem);
	}

	.more-head {
		margin-bottom: 2.5rem;
	}

	.more-head .eyebrow {
		margin-bottom: 1rem;
	}
</style>
