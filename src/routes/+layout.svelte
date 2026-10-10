<script lang="ts">
	import '@fontsource-variable/eb-garamond/wght.css';
	import '@fontsource-variable/eb-garamond/wght-italic.css';
	import '@fontsource-variable/jost/wght.css';
	import '../app.css';
	import serifFont from '@fontsource-variable/eb-garamond/files/eb-garamond-latin-wght-normal.woff2?url';
	import sansFont from '@fontsource-variable/jost/files/jost-latin-wght-normal.woff2?url';

	import { onMount } from 'svelte';
	import { afterNavigate, onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { auth } from '$lib/stores/auth.svelte';
	import { cart } from '$lib/stores/cart.svelte';
	import { orders } from '$lib/stores/orders.svelte';
	import { ui } from '$lib/stores/ui.svelte';
	import { wishlist } from '$lib/stores/wishlist.svelte';
	import BackToTop from '$lib/components/BackToTop.svelte';
	import CartDrawer from '$lib/components/CartDrawer.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import Intro from '$lib/components/Intro.svelte';
	import MobileMenu from '$lib/components/MobileMenu.svelte';
	import SearchOverlay from '$lib/components/SearchOverlay.svelte';
	import Toasts from '$lib/components/Toasts.svelte';

	let { children } = $props();

	const path = $derived(page.url.pathname);
	const overlay = $derived(path === '/' || path === '/colecao');
	const isCheckout = $derived(path.startsWith('/checkout'));
	const locked = $derived(cart.isOpen || ui.searchOpen || ui.menuOpen || ui.modalOpen);

	onMount(() => {
		cart.load();
		wishlist.load();
		orders.load();
		auth.load();

		// um único listener de scroll alimenta header e botão de topo
		let last = scrollY;
		let ticking = false;
		const update = () => {
			ticking = false;
			const y = scrollY;
			if (Math.abs(y - last) > 6) {
				ui.scrollingDown = y > last;
				last = y;
			}
			ui.scrollY = y;
		};
		const onScroll = () => {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(update);
		};
		addEventListener('scroll', onScroll, { passive: true });
		update();
		return () => removeEventListener('scroll', onScroll);
	});

	$effect(() => {
		document.documentElement.classList.toggle('is-locked', locked);
	});

	onNavigate((nav) => {
		if (!document.startViewTransition || document.hidden) return;
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		if (nav.from?.url.pathname === nav.to?.url.pathname) return;
		return new Promise((resolve) => {
			const transition = document.startViewTransition(async () => {
				resolve();
				await nav.complete;
			});
			// a transição pode ser abortada (aba em segundo plano, cliques rápidos): não é erro
			transition.ready.catch(() => {});
			transition.finished.catch(() => {});
		});
	});

	afterNavigate(() => {
		cart.close();
		ui.closeAll();
	});
</script>

<svelte:head>
	<link rel="preload" href={serifFont} as="font" type="font/woff2" crossorigin="anonymous" />
	<link rel="preload" href={sansFont} as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>

<Intro />
<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
<Header />

<main id="conteudo" class:offset={!overlay && !isCheckout}>
	{@render children()}
</main>

<Footer />
<CartDrawer />
<SearchOverlay />
<MobileMenu />
<Toasts />
<BackToTop />

<style>
	main {
		display: block;
		min-height: 60vh;
	}

	main.offset {
		padding-top: var(--header-total);
	}
</style>
