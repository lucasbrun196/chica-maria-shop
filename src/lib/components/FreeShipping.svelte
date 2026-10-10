<script lang="ts">
	import { FREE_SHIPPING_FROM } from '$lib/data/store';
	import { money } from '$lib/utils/format';

	let { subtotal }: { subtotal: number } = $props();

	const missing = $derived(Math.max(0, FREE_SHIPPING_FROM - subtotal));
	const pct = $derived(Math.min(1, subtotal / FREE_SHIPPING_FROM));
</script>

<div class="fs">
	<p>
		{#if missing > 0}
			Faltam <strong>{money(missing)}</strong> para o frete grátis
		{:else}
			Você ganhou <strong>frete grátis</strong> no PAC
		{/if}
	</p>
	<div class="track"><span style:transform="scaleX({pct})"></span></div>
</div>

<style>
	.fs {
		display: grid;
		gap: 0.6rem;
		font-size: 13px;
		color: var(--ink-2);
	}

	strong {
		font-weight: 500;
		color: var(--ink);
	}

	.track {
		height: 2px;
		background: var(--line);
		overflow: hidden;
	}

	.track span {
		display: block;
		height: 100%;
		background: var(--ink);
		transform-origin: left;
		transition: transform 0.8s var(--ease-out);
	}
</style>
