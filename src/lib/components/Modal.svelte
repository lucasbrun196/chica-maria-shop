<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { dialog } from '$lib/actions/inview';
	import { ui } from '$lib/stores/ui.svelte';
	import Icon from './Icon.svelte';

	interface Props {
		open: boolean;
		title: string;
		onclose: () => void;
		children: Snippet;
		wide?: boolean;
	}

	let { open, title, onclose, children, wide = false }: Props = $props();

	$effect(() => {
		ui.modalOpen = open;
		return () => (ui.modalOpen = false);
	});
</script>

{#if open}
	<div class="backdrop" transition:fade={{ duration: 300 }} onclick={onclose} role="presentation"></div>
	<div class="wrap" role="presentation">
		<div
			class="modal"
			class:wide
			role="dialog"
			aria-modal="true"
			aria-label={title}
			transition:fly={{ y: 40, duration: 550, easing: quintOut }}
			use:dialog={onclose}
		>
			<header>
				<h2>{title}</h2>
				<button onclick={onclose} aria-label="Fechar"><Icon name="close" size={22} /></button>
			</header>
			<div class="body">{@render children()}</div>
		</div>
	</div>
{/if}

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 100;
		background: rgb(31 27 24 / 0.45);
	}

	.wrap {
		position: fixed;
		inset: 0;
		z-index: 101;
		display: grid;
		place-items: center;
		padding: 1rem;
		pointer-events: none;
	}

	.modal {
		pointer-events: auto;
		width: min(560px, 100%);
		max-height: calc(100dvh - 2rem);
		overflow-y: auto;
		overscroll-behavior: contain;
		background: var(--ivory);
		padding: 0 clamp(1.25rem, 3vw, 2.5rem) 2rem;
	}

	.modal.wide {
		width: min(780px, 100%);
	}

	header {
		position: sticky;
		top: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem 0 1rem;
		background: var(--ivory);
	}

	h2 {
		font-size: 30px;
	}

	header button {
		width: 44px;
		height: 44px;
		display: grid;
		place-items: center;
		margin-right: -10px;
	}
</style>
