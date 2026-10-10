<script lang="ts">
	import { page } from '$app/state';
	import { fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { categories } from '$lib/data/products';
	import { auth } from '$lib/stores/auth.svelte';
	import { cart } from '$lib/stores/cart.svelte';
	import { ui } from '$lib/stores/ui.svelte';
	import { wishlist } from '$lib/stores/wishlist.svelte';
	import Icon from './Icon.svelte';
	import PhotoPlaceholder from './PhotoPlaceholder.svelte';

	let megaOpen = $state(false);
	let closeTimer: ReturnType<typeof setTimeout> | undefined;

	const path = $derived(page.url.pathname);
	// páginas cuja abertura fica por baixo do header transparente
	const overlay = $derived(path === '/' || path === '/colecao');
	const minimal = $derived(path.startsWith('/checkout'));
	const scrolled = $derived(ui.scrollY > 10);
	const hidden = $derived(ui.scrollY > 320 && ui.scrollingDown && !megaOpen);
	const transparent = $derived(overlay && !scrolled && !megaOpen);

	const messages = [
		'Frete grátis para todo o Brasil acima de R$ 399',
		'Primeira compra? Use o cupom BEMVINDA10',
		'Retire grátis na nossa loja em Passo Fundo',
		'Parcele em até 6x sem juros'
	];
	let msg = $state(0);

	$effect(() => {
		const t = setInterval(() => (msg = (msg + 1) % messages.length), 4800);
		return () => clearInterval(t);
	});

	// fecha o mega menu ao trocar de página
	$effect(() => {
		void path;
		megaOpen = false;
	});

	function openMega() {
		clearTimeout(closeTimer);
		megaOpen = true;
	}

	function scheduleClose() {
		clearTimeout(closeTimer);
		closeTimer = setTimeout(() => (megaOpen = false), 140);
	}

	function megaIn(_node: Element) {
		return {
			duration: 520,
			easing: quintOut,
			css: (t: number) => `clip-path: inset(0 0 ${(1 - t) * 100}% 0); opacity: ${0.4 + t * 0.6}`
		};
	}
</script>

<!-- o mouseleave só fecha o mega menu; pelo teclado ele abre no foco e fecha ao navegar -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<header
	class="header"
	class:scrolled
	class:hidden
	class:transparent
	class:minimal
	onmouseleave={scheduleClose}
>
	{#if !minimal}
		<div class="bar">
			{#key msg}
				<p class="bar-msg">{messages[msg]}</p>
			{/key}
		</div>
	{/if}

	<div class="main container">
		{#if minimal}
			<a href="/sacola" class="back">
				<Icon name="arrow-left" size={18} />
				<span>Sacola</span>
			</a>
			<a href="/" class="logo">Chica Maria</a>
			<span class="secure"><Icon name="lock" size={15} /> <span>Compra segura</span></span>
		{:else}
			<nav class="left" aria-label="Principal">
				<button class="icon-btn burger" onclick={() => (ui.menuOpen = true)} aria-label="Abrir menu">
					<Icon name="menu" size={22} />
				</button>
				<ul class="nav">
					<li>
						<a
							href="/loja"
							class="nav-link"
							class:active={megaOpen || (path.startsWith('/loja') && path !== '/loja/novidades')}
							aria-expanded={megaOpen}
							aria-haspopup="true"
							onmouseenter={openMega}
							onfocus={openMega}>Loja</a
						>
					</li>
					<li>
						<a href="/loja/novidades" class="nav-link" class:active={path === '/loja/novidades'} onmouseenter={scheduleClose}
							>Novidades</a
						>
					</li>
					<li>
						<a href="/colecao" class="nav-link" class:active={path === '/colecao'} onmouseenter={scheduleClose}>Coleção</a>
					</li>
					<li>
						<a href="/sobre" class="nav-link" class:active={path === '/sobre'} onmouseenter={scheduleClose}>A Chica</a>
					</li>
				</ul>
			</nav>

			<a href="/" class="logo" aria-label="Chica Maria, página inicial">Chica Maria</a>

			<div class="right">
				<button class="icon-btn" onclick={() => (ui.searchOpen = true)} aria-label="Buscar">
					<Icon name="search" />
					<span class="txt">Buscar</span>
				</button>
				<a
					href={auth.user ? '/conta' : '/entrar'}
					class="icon-btn account"
					aria-label={auth.user ? 'Minha conta' : 'Entrar'}
				>
					<Icon name="user" />
					<span class="txt">{auth.user ? `Olá, ${auth.firstName}` : 'Entrar'}</span>
				</a>
				<a href="/favoritos" class="icon-btn hide-sm" aria-label="Favoritos">
					<Icon name="heart" />
					{#if wishlist.count}<span class="count">{wishlist.count}</span>{/if}
				</a>
				<button class="icon-btn" onclick={() => cart.open()} aria-label="Sacola com {cart.count} itens">
					<Icon name="bag" />
					{#key cart.count}
						{#if cart.count}<span class="count bump">{cart.count}</span>{/if}
					{/key}
				</button>
			</div>
		{/if}
	</div>

	{#if megaOpen && !minimal}
		<div class="mega" transition:megaIn onmouseenter={openMega} role="presentation">
			<div class="container mega-grid">
				<div class="col">
					<p class="eyebrow">Roupas</p>
					<ul>
						{#each categories as c, i (c.slug)}
							<li style:--i={i}><a href="/loja/{c.slug}">{c.name}</a></li>
						{/each}
						<li style:--i={categories.length}><a href="/loja" class="all">Ver tudo</a></li>
					</ul>
				</div>
				<div class="col">
					<p class="eyebrow">Destaques</p>
					<ul>
						<li style:--i={0}><a href="/loja/novidades">Novidades</a></li>
						<li style:--i={1}><a href="/loja/mais-vendidas">Mais vendidas</a></li>
						<li style:--i={2}><a href="/loja/linho">Cápsula Linho</a></li>
						<li style:--i={3}><a href="/loja/inverno">Inverno na Serra</a></li>
						<li style:--i={4}><a href="/loja/promocoes" class="sale">Promoções</a></li>
					</ul>
				</div>
				<div class="col">
					<p class="eyebrow">Atendimento</p>
					<ul class="small">
						<li style:--i={0}><a href="/ajuda#medidas">Guia de medidas</a></li>
						<li style:--i={1}><a href="/ajuda#trocas">Trocas e devoluções</a></li>
						<li style:--i={2}><a href="/ajuda#entregas">Entregas</a></li>
						<li style:--i={3}><a href="/sobre#loja">Visite a loja</a></li>
					</ul>
				</div>
				<a href="/colecao" class="feature">
					<span class="feature-img">
						<PhotoPlaceholder tone="#cdb79c" label="Foto da campanha" caption="Primavera–Verão 26/27" ratio="16 / 10" hanger={false} />
					</span>
					<span class="feature-cta">Conheça a coleção <Icon name="arrow-right" size={16} /></span>
				</a>
			</div>
		</div>
	{/if}
</header>

{#if megaOpen && !minimal}
	<div class="mega-backdrop" transition:fade={{ duration: 350 }}></div>
{/if}

<style>
	.header {
		position: fixed;
		inset: 0 0 auto;
		z-index: 60;
		view-transition-name: site-header;
		background: var(--ivory);
		color: var(--ink);
		transform: translate3d(0, 0, 0);
		transition:
			transform 0.55s var(--ease-out),
			background-color 0.45s var(--ease),
			box-shadow 0.45s var(--ease);
	}

	.header.scrolled {
		transform: translate3d(0, calc(-1 * var(--bar-h)), 0);
		box-shadow: 0 1px 0 var(--line);
	}

	.header.hidden {
		transform: translate3d(0, -100%, 0);
	}

	.header.transparent {
		background: transparent;
	}

	.header.minimal {
		position: sticky;
		top: 0;
		box-shadow: 0 1px 0 var(--line);
	}

	/* no checkout não há barra de avisos para recolher */
	.header.minimal.scrolled:not(.hidden) {
		transform: none;
	}

	.bar {
		height: var(--bar-h);
		display: grid;
		place-items: center;
		overflow: hidden;
		background: var(--ink);
		color: var(--paper);
		font-size: 10.5px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		padding-inline: 1rem;
		text-align: center;
	}

	.bar-msg {
		grid-area: 1 / 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100%;
		animation: bar-in 0.8s var(--ease-out) both;
	}

	@keyframes bar-in {
		from {
			opacity: 0;
			transform: translate3d(0, 70%, 0);
		}
	}

	.main {
		height: var(--header-h);
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: 1rem;
	}

	.logo {
		justify-self: center;
		font-family: var(--serif);
		font-size: clamp(19px, 2.1vw, 27px);
		font-weight: 500;
		letter-spacing: 0.3em;
		text-transform: uppercase;
		line-height: 1;
		white-space: nowrap;
		padding-left: 0.3em;
	}

	.left {
		display: flex;
		align-items: center;
	}

	.nav {
		display: flex;
		gap: clamp(1.2rem, 2.2vw, 2.4rem);
	}

	.nav-link {
		position: relative;
		display: inline-block;
		padding: 0.6rem 0;
		font-size: 11.5px;
		font-weight: 500;
		letter-spacing: 0.2em;
		text-transform: uppercase;
	}

	.nav-link::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0.35rem;
		height: 1px;
		background: currentColor;
		transform: scaleX(0);
		transform-origin: right;
		transition: transform 0.5s var(--ease-out);
	}

	.nav-link:hover::after,
	.nav-link.active::after {
		transform: scaleX(1);
		transform-origin: left;
	}

	.right {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		gap: clamp(0.25rem, 1.2vw, 1.4rem);
	}

	.icon-btn {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		height: 40px;
		min-width: 36px;
		justify-content: center;
		font-size: 11.5px;
		font-weight: 500;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}

	.icon-btn .txt {
		display: none;
	}

	@media (min-width: 1180px) {
		.icon-btn .txt {
			display: inline;
		}

		.account .txt {
			max-width: 14ch;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	.count {
		position: absolute;
		top: 3px;
		right: -5px;
		min-width: 16px;
		height: 16px;
		padding: 0 4px;
		border-radius: 8px;
		background: var(--ink);
		color: var(--paper);
		font-size: 9.5px;
		font-weight: 500;
		letter-spacing: 0;
		display: grid;
		place-items: center;
		line-height: 1;
	}

	.transparent .count {
		background: var(--ink);
	}

	.bump {
		animation: bump 0.5s var(--ease-out);
	}

	@keyframes bump {
		40% {
			transform: scale(1.35);
		}
	}

	.burger {
		display: none;
		margin-left: -8px;
	}

	@media (max-width: 1023px) {
		.nav {
			display: none;
		}

		.burger {
			display: inline-flex;
		}
	}

	@media (max-width: 640px) {
		.bar {
			font-size: 9.5px;
			letter-spacing: 0.1em;
		}

		.hide-sm {
			display: none;
		}

		.account {
			display: none;
		}

		.logo {
			letter-spacing: 0.22em;
		}
	}

	/* Mega menu */
	.mega {
		position: absolute;
		left: 0;
		right: 0;
		top: 100%;
		background: var(--ivory);
		box-shadow: 0 1px 0 var(--line) inset;
		padding: 2.6rem 0 3rem;
	}

	.mega-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr)) minmax(0, 1.6fr);
		gap: 2rem;
	}

	.col .eyebrow {
		margin-bottom: 1.2rem;
		color: var(--ink-3);
	}

	.col ul {
		display: grid;
		gap: 0.35rem;
	}

	.col li {
		animation: mega-item 0.7s var(--ease-out) both;
		animation-delay: calc(80ms + var(--i) * 35ms);
	}

	@keyframes mega-item {
		from {
			opacity: 0;
			transform: translate3d(0, 10px, 0);
		}
	}

	.col a {
		font-family: var(--serif);
		font-size: 22px;
		line-height: 1.35;
		transition:
			color 0.3s,
			padding 0.4s var(--ease-out);
	}

	.col a:hover {
		color: var(--wine);
		padding-left: 6px;
	}

	.col a.all {
		font-family: var(--sans);
		font-size: 11.5px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		text-decoration: underline;
		text-underline-offset: 4px;
	}

	.col a.sale {
		color: var(--wine);
	}

	.col .small a {
		font-family: var(--sans);
		font-size: 14px;
		line-height: 2;
		color: var(--ink-2);
	}

	.feature {
		display: grid;
		gap: 0.9rem;
	}

	.feature-img {
		overflow: hidden;
	}

	.feature-img :global(.ph) {
		transition: transform 1.2s var(--ease-out);
	}

	.feature:hover .feature-img :global(.ph) {
		transform: scale(1.04);
	}

	.feature-cta {
		display: inline-flex;
		gap: 0.6rem;
		align-items: center;
		font-size: 11.5px;
		font-weight: 500;
		letter-spacing: 0.2em;
		text-transform: uppercase;
	}

	.mega-backdrop {
		position: fixed;
		inset: 0;
		z-index: 55;
		background: rgb(31 27 24 / 0.25);
		pointer-events: none;
	}

	/* Checkout */
	.back,
	.secure {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		font-size: 11.5px;
		font-weight: 500;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}

	.secure {
		justify-self: end;
		color: var(--ok);
	}

	@media (max-width: 640px) {
		.back span,
		.secure span {
			display: none;
		}
	}
</style>
