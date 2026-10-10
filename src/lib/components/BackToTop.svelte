<script lang="ts">
	import { ui } from '$lib/stores/ui.svelte';
	import Icon from './Icon.svelte';

	// some perto do fim da página para não cobrir a linha final do rodapé
	const visible = $derived(
		ui.scrollY > 1400 &&
			ui.scrollY + window.innerHeight < document.documentElement.scrollHeight - 120
	);
</script>

<button
	class="top"
	class:visible
	onclick={() => scrollTo({ top: 0, behavior: 'smooth' })}
	aria-label="Voltar ao topo"
	tabindex={visible ? 0 : -1}
>
	<Icon name="arrow-up" size={18} />
</button>

<style>
	.top {
		position: fixed;
		right: max(1.25rem, env(safe-area-inset-right));
		bottom: max(1.25rem, env(safe-area-inset-bottom));
		z-index: 40;
		width: 46px;
		height: 46px;
		display: grid;
		place-items: center;
		background: var(--paper);
		border: 1px solid var(--line-2);
		opacity: 0;
		transform: translate3d(0, 16px, 0);
		pointer-events: none;
		transition:
			opacity 0.4s var(--ease),
			transform 0.5s var(--ease-out),
			background 0.3s,
			color 0.3s;
	}

	.top.visible {
		opacity: 1;
		transform: none;
		pointer-events: auto;
	}

	.top:hover {
		background: var(--ink);
		color: var(--paper);
	}
</style>
