<script lang="ts">
	import { luminance } from '$lib/utils/format';

	interface Props {
		tone?: string;
		label?: string;
		caption?: string;
		/** proporção CSS (ex.: "3 / 4") ou "fill" para ocupar o pai */
		ratio?: string;
		hanger?: boolean;
		mix?: number;
		class?: string;
	}

	let {
		tone = '#d6c4a8',
		label = 'Foto da roupa',
		caption = '',
		ratio = '3 / 4',
		hanger = true,
		mix = 52,
		class: cls = ''
	}: Props = $props();

	// luminância do fundo já misturado com o marfim base
	const dark = $derived((mix / 100) * luminance(tone) + (1 - mix / 100) * 0.91 < 0.6);
</script>

<div
	class="ph {cls}"
	class:dark
	class:fill={ratio === 'fill'}
	style:--tone={tone}
	style:--mix="{mix}%"
	style:aspect-ratio={ratio === 'fill' ? null : ratio}
	role="img"
	aria-label={caption ? `${label}: ${caption}` : label}
>
	<span class="frame" aria-hidden="true"></span>
	<span class="inner" aria-hidden="true">
		{#if hanger}
			<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round">
				<path d="M10.2 6.8a1.8 1.8 0 1 1 2.6 1.6c-.5.3-.8.7-.8 1.3v.8L3 16.6c-.6.4-.3 1.2.4 1.2h17.2c.7 0 1-.8.4-1.2L12 10.5" />
			</svg>
		{/if}
		<span class="label">{label}</span>
		{#if caption}<span class="caption">{caption}</span>{/if}
	</span>
</div>

<style>
	.ph {
		position: relative;
		width: 100%;
		overflow: hidden;
		display: grid;
		place-items: center;
		color: var(--ink);
		background-color: color-mix(in oklab, var(--tone) var(--mix), #efe7db);
		background-image:
			radial-gradient(120% 85% at 22% 12%, rgb(255 255 255 / 0.3), transparent 58%),
			linear-gradient(180deg, transparent 55%, rgb(0 0 0 / 0.05));
		contain: layout paint;
		container-type: inline-size;
	}

	/* miniaturas (sacola, resumo do pedido): só o cabide */
	@container (max-width: 110px) {
		.label,
		.caption {
			display: none;
		}

		.frame {
			inset: 5px;
		}

		.inner {
			padding: 0;
		}

		svg {
			width: 20px;
			height: 20px;
			margin: 0;
		}
	}

	.ph.fill {
		height: 100%;
	}

	.ph.dark {
		color: var(--paper);
	}

	.frame {
		position: absolute;
		inset: clamp(8px, 1.4vw, 16px);
		border: 1px solid currentColor;
		opacity: 0.16;
		pointer-events: none;
	}

	.inner {
		position: relative;
		display: grid;
		justify-items: center;
		gap: 0.55rem;
		padding: 0 1.5rem;
		text-align: center;
	}

	svg {
		opacity: 0.55;
		margin-bottom: 0.15rem;
	}

	.label {
		font-size: 9.5px;
		font-weight: 500;
		letter-spacing: 0.28em;
		text-transform: uppercase;
		opacity: 0.68;
	}

	.caption {
		font-family: var(--serif);
		font-style: italic;
		font-size: clamp(14px, 1.25vw, 18px);
		line-height: 1.25;
		opacity: 0.82;
		max-width: 22ch;
	}
</style>
