<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		open?: boolean;
		children: Snippet;
	}

	let { title, open = $bindable(false), children }: Props = $props();
	const id = $props.id();
</script>

<div class="acc" class:open>
	<button class="head" aria-expanded={open} aria-controls={id} onclick={() => (open = !open)}>
		<span>{title}</span>
		<span class="icon" aria-hidden="true"></span>
	</button>
	<div class="body" {id} role="region">
		<div class="inner">
			<div class="content">{@render children()}</div>
		</div>
	</div>
</div>

<style>
	.acc {
		border-bottom: 1px solid var(--line);
	}

	.head {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.15rem 0;
		text-align: left;
		font-size: 12px;
		font-weight: 500;
		letter-spacing: 0.18em;
		text-transform: uppercase;
	}

	.icon {
		position: relative;
		width: 12px;
		height: 12px;
		flex: none;
	}

	.icon::before,
	.icon::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		top: 50%;
		height: 1px;
		background: currentColor;
		transition: transform 0.45s var(--ease-out);
	}

	.icon::after {
		transform: rotate(90deg);
	}

	.open .icon::after {
		transform: rotate(0deg);
	}

	.body {
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows 0.5s var(--ease-out);
	}

	.open .body {
		grid-template-rows: 1fr;
	}

	.inner {
		overflow: hidden;
	}

	.content {
		padding-bottom: 1.4rem;
		font-size: 14px;
		color: var(--ink-2);
		line-height: 1.75;
		opacity: 0;
		transform: translateY(-6px);
		transition:
			opacity 0.4s var(--ease),
			transform 0.5s var(--ease-out);
	}

	.open .content {
		opacity: 1;
		transform: none;
	}
</style>
