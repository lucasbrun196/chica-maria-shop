<script lang="ts">
	import { parallax } from '$lib/actions/parallax';
	import PhotoPlaceholder from './PhotoPlaceholder.svelte';

	let { title, text, tone = '#c9b597' }: { title: string; text: string; tone?: string } = $props();
</script>

<aside class="aside">
	<div class="media">
		<div class="par" use:parallax={{ speed: 0.08, scale: 1.08 }}>
			<PhotoPlaceholder {tone} label="Foto da campanha" caption="Chica Maria · Primavera–Verão 26/27" ratio="fill" hanger={false} />
		</div>
	</div>
	<div class="copy">
		<p class="eyebrow">Chica Maria</p>
		<h2>{title}</h2>
		<p>{text}</p>
	</div>
</aside>

<style>
	.aside {
		position: sticky;
		top: var(--header-h);
		height: calc(100vh - var(--header-h));
		overflow: hidden;
		color: var(--ink);
	}

	.media,
	.par {
		position: absolute;
		inset: 0;
	}

	.par {
		inset: -6% 0;
	}

	.copy {
		position: absolute;
		left: clamp(1.5rem, 4vw, 3.5rem);
		right: clamp(1.5rem, 4vw, 3.5rem);
		bottom: clamp(1.5rem, 4vw, 3.5rem);
		padding: 2rem;
		background: rgb(250 247 242 / 0.88);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		display: grid;
		gap: 0.8rem;
		max-width: 460px;
		animation: up 1.2s var(--ease-out) 0.2s both;
	}

	h2 {
		font-size: clamp(28px, 2.6vw, 38px);
	}

	.copy p:last-child {
		font-size: 14.5px;
		color: var(--ink-2);
	}

	@keyframes up {
		from {
			opacity: 0;
			transform: translate3d(0, 24px, 0);
		}
	}

	@media (max-width: 900px) {
		.aside {
			display: none;
		}
	}
</style>
