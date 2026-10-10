<script lang="ts">
	import { fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import { ui } from '$lib/stores/ui.svelte';
</script>

<div class="toasts" aria-live="polite" role="status">
	{#each ui.toasts as t (t.id)}
		<p class="toast" animate:flip={{ duration: 300 }} in:fly={{ y: 24, duration: 500, easing: quintOut }} out:fly={{ y: 12, duration: 250 }}>
			{t.text}
		</p>
	{/each}
</div>

<style>
	.toasts {
		position: fixed;
		left: 50%;
		bottom: max(1.25rem, env(safe-area-inset-bottom));
		transform: translateX(-50%);
		z-index: 120;
		display: grid;
		gap: 0.5rem;
		justify-items: center;
		pointer-events: none;
		width: max-content;
		max-width: calc(100vw - 2rem);
	}

	.toast {
		padding: 0.85rem 1.4rem;
		background: var(--ink);
		color: var(--paper);
		font-size: 13px;
		letter-spacing: 0.04em;
		text-align: center;
	}
</style>
