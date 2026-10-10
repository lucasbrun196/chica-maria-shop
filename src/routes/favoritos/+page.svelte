<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { reveal } from '$lib/actions/reveal';
	import { getProduct, newest } from '$lib/data/products';
	import { wishlist } from '$lib/stores/wishlist.svelte';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import ProductRail from '$lib/components/ProductRail.svelte';

	const items = $derived(wishlist.ids.map((id) => getProduct(id)!).filter(Boolean));
	const suggestions = newest().slice(0, 8);
</script>

<svelte:head>
	<title>Favoritos — Chica Maria</title>
</svelte:head>

<section class="container page">
	<header class="head">
		<p class="eyebrow">Sua seleção</p>
		<h1 class="display">Favoritos</h1>
		<p class="muted">
			{#if items.length}
				{items.length} {items.length === 1 ? 'peça salva' : 'peças salvas'}. Toque no coração para remover.
			{:else}
				Salve as peças que você gostou tocando no coração.
			{/if}
		</p>
	</header>

	{#if items.length}
		<ul class="grid">
			{#each items as p (p.id)}
				<li animate:flip={{ duration: 500, easing: quintOut }} out:fade={{ duration: 250 }}>
					<ProductCard product={p} />
				</li>
			{/each}
		</ul>
	{:else}
		<div class="empty">
			<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8" aria-hidden="true">
				<path d="M12 19.6s-7.3-4.4-7.3-9.7A4.1 4.1 0 0 1 12 7.4a4.1 4.1 0 0 1 7.3 2.5c0 5.3-7.3 9.7-7.3 9.7Z" />
			</svg>
			<p class="e-title">Nenhum favorito ainda.</p>
			<a href="/loja" class="btn">Explorar a loja</a>
		</div>
	{/if}
</section>

<section class="container more">
	<div class="more-head" data-reveal use:reveal>
		<p class="eyebrow">Acabaram de chegar</p>
		<h2 class="title">Novidades</h2>
	</div>
	<ProductRail products={suggestions} />
</section>

<style>
	.page {
		padding-top: clamp(2rem, 4vw, 3.5rem);
	}

	.head {
		padding-bottom: 2rem;
		margin-bottom: 2.5rem;
		border-bottom: 1px solid var(--line);
	}

	.head .eyebrow {
		margin-bottom: 0.75rem;
	}

	.head h1 {
		font-size: clamp(3rem, 6vw, 5.5rem);
		margin-bottom: 0.75rem;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 3rem 1.25rem;
	}

	@media (max-width: 1023px) {
		.grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 2.25rem 0.75rem;
		}
	}

	.empty {
		display: grid;
		justify-items: center;
		gap: 1rem;
		padding: 4rem 0;
		text-align: center;
		color: var(--ink-2);
	}

	.empty svg {
		color: var(--stone);
	}

	.e-title {
		font-family: var(--serif);
		font-size: 32px;
		color: var(--ink);
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
