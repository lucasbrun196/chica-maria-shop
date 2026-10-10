<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import { dialog } from '$lib/actions/inview';
	import { getProduct } from '$lib/data/products';
	import { auth } from '$lib/stores/auth.svelte';
	import { cart } from '$lib/stores/cart.svelte';
	import { installments, money } from '$lib/utils/format';
	import FreeShipping from './FreeShipping.svelte';
	import Icon from './Icon.svelte';
	import PhotoPlaceholder from './PhotoPlaceholder.svelte';
	import QtyStepper from './QtyStepper.svelte';

	const close = () => cart.close();
	const inst = $derived(installments(cart.subtotal));
	const checkoutHref = $derived(auth.user ? '/checkout' : '/entrar?voltar=/checkout');
</script>

{#if cart.isOpen}
	<div class="backdrop" transition:fade={{ duration: 350 }} onclick={close} role="presentation"></div>
	<div
		class="drawer"
		role="dialog"
		aria-modal="true"
		aria-label="Sacola de compras"
		transition:fly={{ x: '100%', duration: 650, easing: quintOut, opacity: 1 }}
		use:dialog={close}
	>
		<header class="head">
			<h2>Sacola <span>({cart.count})</span></h2>
			<button class="close" onclick={close} aria-label="Fechar sacola"><Icon name="close" size={22} /></button>
		</header>

		{#if cart.lines.length}
			<div class="ship"><FreeShipping subtotal={cart.subtotal} /></div>

			<ul class="lines">
				{#each cart.lines as line (line.key)}
					{@const p = getProduct(line.id)!}
					{@const color = p.colors.find((c) => c.name === line.color) ?? p.colors[0]}
					<li
						class="line"
						animate:flip={{ duration: 450, easing: quintOut }}
						in:fly={{ x: 40, duration: 500, easing: quintOut }}
						out:fly={{ x: 60, duration: 300 }}
					>
						<a href="/produto/{p.slug}" class="thumb" onclick={close}>
							<PhotoPlaceholder tone={color.hex} />
						</a>
						<div class="meta">
							<a href="/produto/{p.slug}" class="name" onclick={close}>{p.name}</a>
							<p class="opts">{line.color} · Tam. {line.size}</p>
							<div class="row">
								<QtyStepper value={line.qty} min={0} small onchange={(v) => cart.setQty(line.key, v)} />
								<span class="price">{money(p.price * line.qty)}</span>
							</div>
							<button class="remove" onclick={() => cart.remove(line.key)}>Remover</button>
						</div>
					</li>
				{/each}
			</ul>

			<footer class="foot">
				<div class="sum">
					<span>Subtotal</span>
					<strong>{money(cart.subtotal)}</strong>
				</div>
				<p class="note">ou {inst.n}x de {money(inst.value)} sem juros. Frete e cupons no checkout.</p>
				<a href={checkoutHref} class="btn btn--block" onclick={close}>
					<Icon name="lock" size={15} /> Finalizar compra
				</a>
				<a href="/sacola" class="btn btn--ghost btn--block" onclick={close}>Ver sacola</a>
			</footer>
		{:else}
			<div class="empty">
				<Icon name="bag" size={40} stroke={0.8} />
				<p class="empty-title">Sua sacola está vazia</p>
				<p class="muted">Que tal começar pelas novidades da estação?</p>
				<a href="/loja/novidades" class="btn" onclick={close}>Ver novidades</a>
			</div>
		{/if}
	</div>
{/if}

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 90;
		background: rgb(31 27 24 / 0.4);
	}

	.drawer {
		position: fixed;
		inset: 0 0 0 auto;
		z-index: 91;
		width: min(460px, 100%);
		display: flex;
		flex-direction: column;
		background: var(--ivory);
	}

	.head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 72px;
		padding: 0 1.5rem;
		border-bottom: 1px solid var(--line);
		flex: none;
	}

	h2 {
		font-size: 28px;
	}

	h2 span {
		font-family: var(--sans);
		font-size: 13px;
		color: var(--ink-3);
		vertical-align: middle;
	}

	.close {
		width: 44px;
		height: 44px;
		display: grid;
		place-items: center;
		margin-right: -10px;
	}

	.ship {
		padding: 1.1rem 1.5rem;
		border-bottom: 1px solid var(--line);
		flex: none;
	}

	.lines {
		flex: 1;
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: 0.5rem 1.5rem;
	}

	.line {
		display: grid;
		grid-template-columns: 92px 1fr;
		gap: 1.1rem;
		padding: 1.1rem 0;
		border-bottom: 1px solid var(--line);
	}

	.thumb {
		display: block;
	}

	.meta {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		min-width: 0;
	}

	.name {
		font-family: var(--serif);
		font-size: 18px;
		line-height: 1.2;
	}

	.opts {
		font-size: 12.5px;
		color: var(--ink-3);
	}

	.row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: auto;
		padding-top: 0.6rem;
	}

	.price {
		font-size: 14px;
	}

	.remove {
		align-self: flex-start;
		margin-top: 0.4rem;
		font-size: 11px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-3);
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.remove:hover {
		color: var(--wine);
	}

	.foot {
		flex: none;
		display: grid;
		gap: 0.6rem;
		padding: 1.25rem 1.5rem 1.5rem;
		border-top: 1px solid var(--line);
		background: var(--paper);
	}

	.sum {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		font-size: 13px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.sum strong {
		font-family: var(--serif);
		font-size: 24px;
		font-weight: 500;
		letter-spacing: 0;
		text-transform: none;
	}

	.note {
		font-size: 12.5px;
		color: var(--ink-3);
		margin-bottom: 0.5rem;
	}

	.empty {
		flex: 1;
		display: grid;
		place-content: center;
		justify-items: center;
		gap: 0.75rem;
		text-align: center;
		padding: 2rem;
	}

	.empty :global(svg) {
		color: var(--stone);
		margin-bottom: 0.5rem;
	}

	.empty-title {
		font-family: var(--serif);
		font-size: 28px;
	}

	.empty .btn {
		margin-top: 1rem;
	}
</style>
