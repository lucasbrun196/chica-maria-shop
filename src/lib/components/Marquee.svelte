<script lang="ts">
	import { pauseOffscreen } from '$lib/actions/inview';

	interface Props {
		items: string[];
		speed?: number;
		dark?: boolean;
	}

	let { items, speed = 38, dark = false }: Props = $props();
</script>

<div class="marquee" class:dark use:pauseOffscreen style:--speed="{speed}s">
	<div class="track">
		{#each [0, 1] as copy (copy)}
			<div class="group" aria-hidden={copy === 1}>
				{#each items as item, i (i)}
					<span class="item">{item}</span>
					<span class="sep" aria-hidden="true"></span>
				{/each}
			</div>
		{/each}
	</div>
</div>

<style>
	.marquee {
		overflow: hidden;
		border-block: 1px solid var(--line);
		padding: 1.3rem 0;
		user-select: none;
	}

	.marquee.dark {
		background: var(--ink);
		color: var(--ivory);
		border-color: transparent;
	}

	.track {
		display: flex;
		width: max-content;
		animation: scroll var(--speed) linear infinite;
	}

	.marquee:hover .track,
	.marquee:global(.is-paused) .track {
		animation-play-state: paused;
	}

	.group {
		display: flex;
		align-items: center;
		flex: none;
	}

	.item {
		font-family: var(--serif);
		font-style: italic;
		font-size: clamp(24px, 3vw, 40px);
		line-height: 1;
		white-space: nowrap;
		padding: 0 2.2rem;
	}

	.sep {
		width: 7px;
		height: 7px;
		border: 1px solid currentColor;
		transform: rotate(45deg);
		opacity: 0.5;
	}

	@keyframes scroll {
		to {
			transform: translate3d(-50%, 0, 0);
		}
	}
</style>
