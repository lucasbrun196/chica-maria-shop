<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { categories } from '$lib/data/products';
	import { store } from '$lib/data/store';
	import { dialog } from '$lib/actions/inview';
	import { auth } from '$lib/stores/auth.svelte';
	import { ui } from '$lib/stores/ui.svelte';
	import Icon from './Icon.svelte';

	const close = () => (ui.menuOpen = false);
</script>

{#if ui.menuOpen}
	<div class="backdrop" transition:fade={{ duration: 300 }} onclick={close} role="presentation"></div>
	<div
		class="menu"
		role="dialog"
		aria-modal="true"
		aria-label="Menu"
		transition:fly={{ x: '-100%', duration: 650, easing: quintOut, opacity: 1 }}
		use:dialog={close}
	>
		<div class="top">
			<span class="logo">Chica Maria</span>
			<button class="close" onclick={close} aria-label="Fechar menu"><Icon name="close" size={22} /></button>
		</div>

		<nav aria-label="Categorias">
			<ul class="primary">
				<li style:--i={0}><a href="/loja/novidades">Novidades</a></li>
				{#each categories as c, i (c.slug)}
					<li style:--i={i + 1}><a href="/loja/{c.slug}">{c.name}</a></li>
				{/each}
				<li style:--i={categories.length + 1}><a href="/loja/promocoes" class="sale">Promoções</a></li>
			</ul>

			<ul class="secondary">
				<li><a href="/colecao">Coleção Primavera–Verão</a></li>
				<li><a href="/sobre">A Chica Maria</a></li>
				<li><a href="/favoritos">Favoritos</a></li>
				<li><a href="/ajuda">Ajuda</a></li>
			</ul>
		</nav>

		<div class="account">
			{#if auth.user}
				<a href="/conta" class="btn btn--ghost btn--block">Minha conta</a>
			{:else}
				<a href="/entrar" class="btn btn--block">Entrar</a>
				<a href="/cadastro" class="btn btn--ghost btn--block">Criar conta</a>
			{/if}
		</div>

		<div class="foot">
			<p>{store.address}</p>
			<p>{store.city} · {store.state}</p>
			<p>WhatsApp {store.whatsapp}</p>
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

	.menu {
		position: fixed;
		inset: 0 auto 0 0;
		z-index: 91;
		width: min(440px, 100%);
		background: var(--ivory);
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: 0 1.5rem 2rem;
	}

	.top {
		position: sticky;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 68px;
		background: var(--ivory);
		z-index: 1;
	}

	.logo {
		font-family: var(--serif);
		font-size: 19px;
		font-weight: 500;
		letter-spacing: 0.26em;
		text-transform: uppercase;
	}

	.close {
		width: 44px;
		height: 44px;
		display: grid;
		place-items: center;
		margin-right: -10px;
	}

	.primary {
		padding: 1rem 0 1.5rem;
		border-bottom: 1px solid var(--line);
	}

	.primary li {
		animation: item 0.8s var(--ease-out) both;
		animation-delay: calc(180ms + var(--i) * 45ms);
	}

	@keyframes item {
		from {
			opacity: 0;
			transform: translate3d(-24px, 0, 0);
		}
	}

	.primary a {
		display: block;
		padding: 0.3rem 0;
		font-family: var(--serif);
		font-size: 31px;
		line-height: 1.2;
	}

	.primary a.sale {
		color: var(--wine);
		font-style: italic;
	}

	.secondary {
		padding: 1.4rem 0;
		display: grid;
		gap: 0.6rem;
		font-size: 13px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.account {
		display: grid;
		gap: 0.6rem;
		padding: 0.5rem 0 1.5rem;
	}

	.foot {
		margin-top: auto;
		font-size: 13px;
		color: var(--ink-3);
		line-height: 1.7;
	}
</style>
