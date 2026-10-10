<script lang="ts">
	import { parallax } from '$lib/actions/parallax';
	import { reveal } from '$lib/actions/reveal';
	import { getProduct, products } from '$lib/data/products';
	import Icon from '$lib/components/Icon.svelte';
	import Marquee from '$lib/components/Marquee.svelte';
	import PhotoPlaceholder from '$lib/components/PhotoPlaceholder.svelte';
	import ProductCard from '$lib/components/ProductCard.svelte';

	const palette = [
		{ name: 'Areia', hex: '#d6c4a8' },
		{ name: 'Champanhe', hex: '#e2cfae' },
		{ name: 'Sálvia', hex: '#99a48c' },
		{ name: 'Oliva', hex: '#77714f' },
		{ name: 'Terracota', hex: '#a35c42' },
		{ name: 'Bordô', hex: '#5c1f2a' }
	];

	const chapters = [
		{
			n: 'I',
			title: 'Manhã',
			text: 'Linho cru, camisas abertas e sandália baixa. As peças mais leves da coleção, para começar o dia sem pressa.',
			tone: '#e3d4bf',
			items: ['cm011', 'cm014']
		},
		{
			n: 'II',
			title: 'Tarde',
			text: 'Estampas exclusivas, laise e saias com movimento. Cor na medida certa para almoço de domingo e passeio no parque.',
			tone: '#c8957f',
			items: ['cm005', 'cm008']
		},
		{
			n: 'III',
			title: 'Noite',
			text: 'Cetim enviesado, plissado e dourado. Quando a temperatura cai um pouco e o programa pede algo especial.',
			tone: '#5c1f2a',
			items: ['cm002', 'cm016']
		}
	].map((c) => ({ ...c, products: c.items.map((id) => getProduct(id)!) }));

	const pieces = products.filter((p) => p.collection === 'primavera' || p.collection === 'linho');
</script>

<svelte:head>
	<title>Coleção Primavera–Verão 26/27 — Chica Maria</title>
</svelte:head>

<section class="hero">
	<div class="hero-bg">
		<div class="hero-par" use:parallax={{ speed: 0.25, scale: 1.15 }}>
			<PhotoPlaceholder tone="#c8b08f" label="Foto da campanha" caption="Primavera–Verão 26/27" ratio="fill" hanger={false} mix={46} />
		</div>
	</div>
	<div class="container hero-content">
		<p class="eyebrow">Coleção Primavera–Verão 26/27</p>
		<h1>
			<span class="line-mask"><span>Tempo</span></span>
			<span class="line-mask"><span><em>bom</em></span></span>
		</h1>
	</div>
</section>

<section class="container intro">
	<p data-reveal use:reveal>
		Uma coleção sobre os dias em que o sol volta a aparecer no planalto. Tecidos que respiram, cores tiradas da terra
		e do campo, e peças que vão do trabalho ao fim de semana sem esforço.
	</p>
</section>

<section class="container palette">
	<p class="eyebrow" data-reveal use:reveal>Paleta da estação</p>
	<ul>
		{#each palette as c, i (c.name)}
			<li data-reveal use:reveal={i * 80}>
				<span class="chip" style:background={c.hex}></span>
				<span class="cname">{c.name}</span>
				<span class="hex">{c.hex.toUpperCase()}</span>
			</li>
		{/each}
	</ul>
</section>

{#each chapters as ch, i (ch.n)}
	<section class="container chapter" class:reverse={i % 2 === 1}>
		<div class="ch-media" data-reveal="clip" use:reveal>
			<div>
				<div class="ch-par" use:parallax={{ speed: 0.08, scale: 1.12 }}>
					<PhotoPlaceholder tone={ch.tone} label="Foto editorial" caption="Capítulo {ch.n} · {ch.title}" ratio="fill" hanger={false} />
				</div>
			</div>
		</div>
		<div class="ch-text">
			<p class="eyebrow" data-reveal use:reveal>Capítulo {ch.n}</p>
			<h2 class="display" data-reveal="lines" use:reveal={80}>
				<span class="line-mask"><span><em>{ch.title}</em></span></span>
			</h2>
			<p class="lead" data-reveal use:reveal={160}>{ch.text}</p>
			<ul class="ch-products">
				{#each ch.products as p, j (p.id)}
					<li data-reveal use:reveal={220 + j * 100}><ProductCard product={p} quickAdd={false} /></li>
				{/each}
			</ul>
		</div>
	</section>
{/each}

<div class="band">
	<Marquee dark items={['Tempo bom', 'Primavera–Verão 26/27', 'Linho', 'Seda', 'Laise', 'Estampas exclusivas']} speed={44} />
</div>

<section class="container pieces">
	<div class="pieces-head">
		<div data-reveal use:reveal>
			<p class="eyebrow">Todas as peças</p>
			<h2 class="title">Compre a coleção</h2>
		</div>
		<a href="/loja/novidades" class="link" data-reveal use:reveal={100}>Ver na loja <Icon name="arrow-right" size={14} /></a>
	</div>
	<ul class="grid">
		{#each pieces as p, i (p.id)}
			<li data-reveal use:reveal={(i % 4) * 90}><ProductCard product={p} /></li>
		{/each}
	</ul>
</section>

<style>
	.hero {
		position: relative;
		height: 100vh;
		height: 100svh;
		min-height: 560px;
		overflow: hidden;
		display: flex;
		align-items: flex-end;
	}

	.hero-bg {
		position: absolute;
		inset: 0;
		animation: zoom 2.2s var(--ease-out) both;
	}

	@keyframes zoom {
		from {
			opacity: 0;
			transform: scale(1.08);
		}
	}

	.hero-par {
		position: absolute;
		inset: -8% 0;
	}

	/* afasta a legenda do placeholder do título gigante */
	.hero-par :global(.inner) {
		align-self: start;
		justify-self: end;
		margin: calc(var(--header-total) + 18vh) calc(var(--gutter) + 9%) 0 0;
		justify-items: end;
		text-align: right;
	}

	.hero-content {
		position: relative;
		padding-bottom: clamp(2rem, 5vw, 4rem);
	}

	.hero-content .eyebrow {
		margin-bottom: 1rem;
		animation: fade 1s var(--ease-out) 0.6s both;
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
	}

	.hero h1 {
		font-size: clamp(5rem, 19vw, 20rem);
		line-height: 0.82;
		letter-spacing: -0.04em;
	}

	.hero h1 .line-mask > span {
		animation: rise 1.4s var(--ease-out) both;
	}

	.hero h1 .line-mask:nth-child(2) > span {
		animation-delay: 0.12s;
		padding-left: 0.6em;
	}

	@keyframes rise {
		from {
			transform: translate3d(0, 105%, 0);
		}
	}

	.intro {
		padding-top: clamp(5rem, 10vw, 9rem);
	}

	.intro p {
		max-width: 30ch;
		margin: 0 auto;
		text-align: center;
		font-family: var(--serif);
		font-size: clamp(26px, 3.2vw, 46px);
		line-height: 1.2;
	}

	.palette {
		padding-top: clamp(5rem, 9vw, 8rem);
	}

	.palette .eyebrow {
		margin-bottom: 1.5rem;
	}

	.palette ul {
		display: grid;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		gap: clamp(0.5rem, 1.5vw, 1.25rem);
	}

	@media (max-width: 760px) {
		.palette ul {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	.palette li {
		display: grid;
		gap: 0.4rem;
	}

	.chip {
		display: block;
		aspect-ratio: 2 / 3;
		transition: transform 0.8s var(--ease-out);
	}

	.palette li:hover .chip {
		transform: translateY(-8px);
	}

	.cname {
		font-family: var(--serif);
		font-size: 20px;
		margin-top: 0.4rem;
	}

	.hex {
		font-size: 11px;
		letter-spacing: 0.12em;
		color: var(--ink-3);
	}

	.chapter {
		display: grid;
		grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
		gap: clamp(2rem, 6vw, 6rem);
		align-items: center;
		padding-top: clamp(6rem, 11vw, 10rem);
	}

	.chapter.reverse .ch-media {
		order: 2;
	}

	.ch-media {
		position: relative;
		aspect-ratio: 4 / 5;
		overflow: hidden;
	}

	.ch-media > div {
		position: absolute;
		inset: 0;
	}

	.ch-par {
		position: absolute;
		inset: -10% 0;
	}

	.ch-text {
		display: grid;
		gap: 1.5rem;
	}

	.ch-text h2 {
		font-size: clamp(4rem, 9vw, 9rem);
		line-height: 0.9;
	}

	.ch-products {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-top: 1rem;
	}

	@media (max-width: 900px) {
		.chapter {
			grid-template-columns: 1fr;
		}

		.chapter.reverse .ch-media {
			order: 0;
		}
	}

	.band {
		margin-top: clamp(6rem, 11vw, 10rem);
	}

	.pieces {
		padding-top: clamp(5rem, 9vw, 8rem);
	}

	.pieces-head {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 1.5rem;
		margin-bottom: 3rem;
	}

	.pieces-head .eyebrow {
		margin-bottom: 1rem;
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
</style>
