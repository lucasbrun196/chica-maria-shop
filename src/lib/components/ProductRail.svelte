<script lang="ts">
	import type { Product } from '$lib/data/products';
	import Icon from './Icon.svelte';
	import ProductCard from './ProductCard.svelte';

	let { products }: { products: Product[] } = $props();

	let track: HTMLUListElement | undefined = $state();
	let atStart = $state(true);
	let atEnd = $state(false);
	let ticking = false;

	function measure() {
		ticking = false;
		if (!track) return;
		atStart = track.scrollLeft < 8;
		atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
	}

	function onScroll() {
		if (ticking) return;
		ticking = true;
		requestAnimationFrame(measure);
	}

	function go(dir: 1 | -1) {
		if (!track) return;
		track.scrollBy({ left: dir * track.clientWidth * 0.8, behavior: 'smooth' });
	}

	$effect(() => {
		measure();
	});
</script>

<div class="rail">
	<ul class="track" bind:this={track} onscroll={onScroll}>
		{#each products as p (p.id)}
			<li><ProductCard product={p} /></li>
		{/each}
	</ul>
	<div class="arrows">
		<button onclick={() => go(-1)} disabled={atStart} aria-label="Anterior"><Icon name="arrow-left" size={18} /></button>
		<button onclick={() => go(1)} disabled={atEnd} aria-label="Próximo"><Icon name="arrow-right" size={18} /></button>
	</div>
</div>

<style>
	.rail {
		position: relative;
	}

	.track {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: calc((100% - 3 * 1.25rem) / 4);
		gap: 1.25rem;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		scrollbar-width: none;
		overscroll-behavior-x: contain;
		padding-bottom: 0.25rem;
	}

	.track::-webkit-scrollbar {
		display: none;
	}

	.track li {
		scroll-snap-align: start;
	}

	@media (max-width: 1023px) {
		.track {
			grid-auto-columns: calc((100% - 2 * 1rem) / 2.6);
			gap: 1rem;
		}
	}

	@media (max-width: 640px) {
		.track {
			grid-auto-columns: 68%;
		}
	}

	.arrows {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
		margin-top: 1.75rem;
	}

	.arrows button {
		width: 48px;
		height: 48px;
		display: grid;
		place-items: center;
		border: 1px solid var(--line-2);
		transition:
			background 0.3s,
			color 0.3s,
			opacity 0.3s;
	}

	.arrows button:hover:not(:disabled) {
		background: var(--ink);
		color: var(--paper);
		border-color: var(--ink);
	}

	.arrows button:disabled {
		opacity: 0.3;
		cursor: default;
	}
</style>
