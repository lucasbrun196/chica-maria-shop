<script lang="ts">
	import { parallax } from '$lib/actions/parallax';
	import { reveal } from '$lib/actions/reveal';
	import { bestSellers, newest } from '$lib/data/products';
	import { store } from '$lib/data/store';
	import Icon from '$lib/components/Icon.svelte';
	import Lookbook from '$lib/components/Lookbook.svelte';
	import PhotoPlaceholder from '$lib/components/PhotoPlaceholder.svelte';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import ProductRail from '$lib/components/ProductRail.svelte';

	const arrivals = newest().slice(0, 10);
	const favorites = bestSellers().slice(0, 4);

	const tiles = [
		{ slug: 'vestidos', name: 'Vestidos', tone: '#cdb79c', area: 'a', caption: 'Vestido Midi Linho' },
		{ slug: 'blusas', name: 'Blusas e camisas', tone: '#e2d6c4', area: 'b', caption: 'Camisa de seda' },
		{ slug: 'calcas', name: 'Calças', tone: '#b9a68c', area: 'c', caption: 'Pantalona' },
		{ slug: 'tricos', name: 'Tricôs e casacos', tone: '#a8916f', area: 'd', caption: 'Inverno na Serra' }
	];

	const services = [
		{ icon: 'truck', title: 'Frete grátis', text: 'Para todo o Brasil em compras acima de R$ 399.' },
		{ icon: 'return', title: 'Primeira troca grátis', text: 'Você tem 30 dias para trocar, sem custo.' },
		{ icon: 'card', title: '6x sem juros', text: 'No cartão, ou 5% de desconto pagando no Pix.' },
		{ icon: 'store', title: 'Retire na loja', text: 'Pedidos prontos em 1 dia útil em Passo Fundo.' }
	] as const;
</script>

<svelte:head>
	<title>Chica Maria — Moda feminina em Passo Fundo</title>
</svelte:head>

<!-- Abertura -->
<section class="hero">
	<div class="hero-text">
		<div class="hero-copy">
			<p class="eyebrow hero-eyebrow">Nova coleção · Primavera–Verão 26/27</p>
			<h1 class="display hero-title">
				<span class="line-mask" style:--i={0}><span>Leveza que</span></span>
				<span class="line-mask" style:--i={1}><span><em>atravessa</em></span></span>
				<span class="line-mask" style:--i={2}><span>a estação</span></span>
			</h1>
			<p class="lead hero-lead">
				Linho, seda e algodão em peças pensadas para durar mais que uma temporada. Escolhidas uma a uma,
				aqui em Passo Fundo.
			</p>
			<div class="hero-actions">
				<a href="/colecao" class="btn">Ver a coleção</a>
				<a href="/loja/novidades" class="btn btn--ghost">Novidades</a>
			</div>
		</div>
		<div class="hero-foot">
			<span>Passo Fundo · RS</span>
			<span class="cue">Role para ver <span class="cue-line"></span></span>
		</div>
	</div>

	<div class="hero-media">
		<div class="hero-par" use:parallax={{ speed: 0.14, scale: 1.08 }}>
			<PhotoPlaceholder tone="#c8b08f" label="Foto da campanha" caption="Primavera–Verão 26/27" ratio="fill" hanger={false} mix={48} />
		</div>
		<div class="hero-inset">
			<PhotoPlaceholder tone="#e3d4bf" label="Foto da roupa" caption="Detalhe do linho" ratio="3 / 4" />
		</div>
	</div>
</section>

<!-- Categorias -->
<section class="container section cats">
	<div class="section-head">
		<div data-reveal use:reveal>
			<p class="eyebrow">Comprar por categoria</p>
			<h2 class="title">O guarda-roupa da estação</h2>
		</div>
		<a href="/loja" class="link" data-reveal use:reveal={100}>Ver toda a loja <Icon name="arrow-right" size={14} /></a>
	</div>

	<div class="tiles">
		{#each tiles as t, i (t.slug)}
			<a href="/loja/{t.slug}" class="tile" style:grid-area={t.area} data-reveal="clip" use:reveal={i * 110}>
				<span class="tile-img">
					<PhotoPlaceholder tone={t.tone} caption={t.caption} ratio="fill" label="Foto da categoria" />
				</span>
				<span class="tile-label">
					<span class="tile-name">{t.name}</span>
					<span class="tile-cta">Ver peças <Icon name="arrow-right" size={14} /></span>
				</span>
			</a>
		{/each}
	</div>

	<ul class="more-cats" data-reveal use:reveal>
		<li><a href="/loja/saias">Saias</a></li>
		<li><a href="/loja/conjuntos">Conjuntos</a></li>
		<li><a href="/loja/acessorios">Acessórios</a></li>
		<li><a href="/loja/promocoes" class="sale">Promoções</a></li>
	</ul>
</section>

<!-- Recém-chegadas -->
<section class="container section">
	<div class="section-head">
		<div data-reveal use:reveal>
			<p class="eyebrow">Acabaram de chegar</p>
			<h2 class="title">Recém-chegadas</h2>
		</div>
		<a href="/loja/novidades" class="link" data-reveal use:reveal={100}>Ver novidades <Icon name="arrow-right" size={14} /></a>
	</div>
	<div data-reveal use:reveal={150}>
		<ProductRail products={arrivals} />
	</div>
</section>

<!-- Editorial: linho -->
<section class="container section editorial">
	<div class="ed-media">
		<div class="ed-a" data-reveal="clip" use:reveal>
			<div>
				<div class="ed-par" use:parallax={{ speed: -0.05, scale: 1.1 }}>
					<PhotoPlaceholder tone="#d6c4a8" label="Foto editorial" caption="Cápsula Linho" ratio="fill" hanger={false} />
				</div>
			</div>
		</div>
		<div class="ed-b" data-reveal="clip" use:reveal={200}>
			<div>
				<PhotoPlaceholder tone="#99a48c" caption="Camisa Linho Marina" ratio="fill" />
			</div>
		</div>
	</div>
	<div class="ed-text">
		<p class="eyebrow" data-reveal use:reveal>Cápsula Linho</p>
		<h2 class="display ed-title" data-reveal="lines" use:reveal={80}>
			<span class="line-mask" style:--i={0}><span>O linho,</span></span>
			<span class="line-mask" style:--i={1}><span>do jeito</span></span>
			<span class="line-mask" style:--i={2}><span><em>que ele é.</em></span></span>
		</h2>
		<p class="lead" data-reveal use:reveal={200}>
			Amassa, respira e fica mais macio a cada lavagem. A cápsula chega em areia, oliva e sálvia, cores
			que conversam entre si e com o resto do seu armário.
		</p>
		<a href="/loja/linho" class="btn btn--ghost" data-reveal use:reveal={280}>Comprar linho</a>
	</div>
</section>

<Lookbook />

<!-- Mais vendidas -->
<section class="container section">
	<div class="section-head">
		<div data-reveal use:reveal>
			<p class="eyebrow">As preferidas</p>
			<h2 class="title">Mais vendidas</h2>
		</div>
		<a href="/loja/mais-vendidas" class="link" data-reveal use:reveal={100}>Ver todas <Icon name="arrow-right" size={14} /></a>
	</div>
	<ul class="grid4">
		{#each favorites as p, i (p.id)}
			<li data-reveal use:reveal={i * 90}><ProductCard product={p} /></li>
		{/each}
	</ul>
</section>

<!-- Serviços -->
<section class="services">
	<ul class="container services-grid">
		{#each services as s, i (s.title)}
			<li data-reveal use:reveal={i * 90}>
				<Icon name={s.icon} size={26} stroke={1} />
				<h3>{s.title}</h3>
				<p>{s.text}</p>
			</li>
		{/each}
	</ul>
</section>

<!-- Loja física -->
<section class="visit">
	<div class="visit-media" data-reveal="clip" use:reveal>
		<div>
			<div class="visit-par" use:parallax={{ speed: 0.1, scale: 1.12 }}>
				<PhotoPlaceholder tone="#3a302a" label="Foto da loja" caption="Fachada da Chica Maria, Centro de Passo Fundo" ratio="fill" hanger={false} />
			</div>
		</div>
	</div>
	<div class="visit-text">
		<p class="eyebrow" data-reveal use:reveal>Loja física</p>
		<h2 class="display visit-title" data-reveal="lines" use:reveal={80}>
			<span class="line-mask" style:--i={0}><span>Passe para</span></span>
			<span class="line-mask" style:--i={1}><span><em>um café.</em></span></span>
		</h2>
		<p data-reveal use:reveal={160}>
			A nossa loja fica no Centro de Passo Fundo. Dá para provar tudo com calma, retirar pedidos do site no
			mesmo dia e contar com a equipe para montar os looks.
		</p>
		<dl data-reveal use:reveal={240}>
			<div>
				<dt>Endereço</dt>
				<dd>{store.address}<br />{store.city}, {store.state}</dd>
			</div>
			<div>
				<dt>Horário</dt>
				<dd>
					{#each store.hours as [d, h] (d)}{d}: {h}<br />{/each}
				</dd>
			</div>
		</dl>
		<a href="/sobre#loja" class="btn btn--outline-light" data-reveal use:reveal={300}>Como chegar</a>
	</div>
</section>

<!-- Instagram -->
<section class="container section insta">
	<div class="section-head centered" data-reveal use:reveal>
		<p class="eyebrow">No Instagram</p>
		<h2 class="title">{store.instagram}</h2>
	</div>
	<ul class="insta-grid">
		{#each ['#d6c4a8', '#c4a09a', '#77714f', '#e2cfae', '#5c1f2a', '#b0895f'] as tone, i (i)}
			<li data-reveal use:reveal={i * 70}>
				<a href="/sobre" class="insta-item" aria-label="Publicação {i + 1} do Instagram">
					<PhotoPlaceholder {tone} label="Foto do Instagram" ratio="1 / 1" hanger={false} />
					<span class="insta-hover"><Icon name="instagram" size={26} /></span>
				</a>
			</li>
		{/each}
	</ul>
</section>

<style>
	/* ---------- Hero ---------- */
	.hero {
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
		min-height: 100vh;
		min-height: 100svh;
	}

	.hero-text {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: calc(var(--header-total) + clamp(2rem, 6vh, 5rem)) var(--gutter) 2rem;
	}

	.hero-copy {
		margin-block: auto;
		max-width: 560px;
	}

	.hero-eyebrow {
		margin-bottom: 1.6rem;
	}

	.hero-title {
		font-size: clamp(3rem, 6.6vw, 7.4rem);
		margin-bottom: 2rem;
	}

	.hero-lead {
		margin-bottom: 2.4rem;
	}

	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.hero-foot {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 3rem;
		font-size: 11px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--ink-3);
	}

	.cue {
		display: inline-flex;
		align-items: center;
		gap: 0.8rem;
	}

	.cue-line {
		position: relative;
		width: 48px;
		height: 1px;
		background: var(--line-2);
		overflow: hidden;
	}

	.cue-line::after {
		content: '';
		position: absolute;
		inset: 0;
		background: var(--ink);
		animation: cue 2.2s var(--ease-io) infinite;
	}

	@keyframes cue {
		0% {
			transform: translateX(-100%);
		}
		60%,
		100% {
			transform: translateX(100%);
		}
	}

	.hero-media {
		position: relative;
		overflow: hidden;
		background: var(--sand);
	}

	.hero-par {
		position: absolute;
		inset: -6% 0;
	}

	.hero-inset {
		position: absolute;
		left: clamp(1rem, 3vw, 3rem);
		bottom: clamp(1rem, 3vw, 3rem);
		width: clamp(120px, 14vw, 220px);
		box-shadow: 0 30px 60px -30px rgb(31 27 24 / 0.45);
	}

	/* animações de entrada (CSS puro, não dependem do JS) */
	.hero-eyebrow,
	.hero-lead,
	.hero-actions,
	.hero-foot {
		animation: hero-fade 1.2s var(--ease-out) both;
		animation-delay: calc(var(--hd, 0s) + 0.55s);
	}

	.hero-lead {
		animation-delay: calc(var(--hd, 0s) + 0.7s);
	}

	.hero-actions {
		animation-delay: calc(var(--hd, 0s) + 0.85s);
	}

	.hero-foot {
		animation-delay: calc(var(--hd, 0s) + 1.1s);
	}

	.hero-title .line-mask > span {
		animation: hero-rise 1.3s var(--ease-out) both;
		animation-delay: calc(var(--hd, 0s) + 0.15s + var(--i) * 0.1s);
	}

	.hero-media {
		animation: hero-clip 1.6s var(--ease-io) both;
		animation-delay: var(--hd, 0s);
	}

	.hero-inset {
		animation: hero-up 1.4s var(--ease-out) both;
		animation-delay: calc(var(--hd, 0s) + 0.9s);
	}

	:global(.has-intro) .hero {
		--hd: 1.75s;
	}

	@keyframes hero-fade {
		from {
			opacity: 0;
			transform: translate3d(0, 18px, 0);
		}
	}

	@keyframes hero-rise {
		from {
			transform: translate3d(0, 105%, 0);
		}
	}

	@keyframes hero-clip {
		from {
			clip-path: inset(100% 0 0 0);
		}
		to {
			clip-path: inset(0 0 0 0);
		}
	}

	@keyframes hero-up {
		from {
			opacity: 0;
			transform: translate3d(0, 40px, 0);
		}
	}

	@media (max-width: 900px) {
		.hero {
			grid-template-columns: 1fr;
			min-height: 0;
		}

		.hero-media {
			order: -1;
			height: 72svh;
			min-height: 420px;
		}

		.hero-text {
			padding-top: 2.5rem;
		}

		.hero-foot {
			display: none;
		}
	}

	/* ---------- Seções ---------- */
	.section {
		padding-top: clamp(5rem, 10vw, 9rem);
	}

	.section-head {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 1.5rem;
		margin-bottom: clamp(2rem, 4vw, 3.25rem);
	}

	.section-head .eyebrow {
		margin-bottom: 1rem;
	}

	.section-head.centered {
		display: block;
		text-align: center;
	}

	@media (max-width: 640px) {
		.section-head {
			flex-direction: column;
			align-items: flex-start;
		}
	}

	/* ---------- Categorias ---------- */
	.tiles {
		display: grid;
		grid-template-columns: 1.15fr 1fr 1fr;
		grid-template-rows: repeat(2, clamp(260px, 30vw, 440px));
		grid-template-areas:
			'a b c'
			'a d d';
		gap: clamp(0.5rem, 1vw, 1rem);
	}

	@media (max-width: 760px) {
		.tiles {
			grid-template-columns: 1fr 1fr;
			grid-template-rows: 420px 240px 240px;
			grid-template-areas:
				'a a'
				'b c'
				'd d';
		}
	}

	.tile {
		position: relative;
		overflow: hidden;
		display: block;
	}

	.tile-img {
		position: absolute;
		inset: 0;
		display: block;
	}

	.tile-img :global(.ph) {
		transition: transform 1.6s var(--ease-out);
	}

	@media (hover: hover) {
		.tile:hover .tile-img :global(.ph) {
			transform: scale(1.05);
		}
	}

	.tile-label {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 1rem;
		padding: clamp(1rem, 2vw, 1.75rem);
	}

	.tile-name {
		font-family: var(--serif);
		font-size: clamp(24px, 2.6vw, 40px);
		line-height: 1;
	}

	.tile-cta {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 10.5px;
		font-weight: 500;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		white-space: nowrap;
		opacity: 0;
		transform: translate3d(-10px, 0, 0);
		transition:
			opacity 0.5s var(--ease),
			transform 0.6s var(--ease-out);
	}

	.tile:hover .tile-cta,
	.tile:focus-visible .tile-cta {
		opacity: 1;
		transform: none;
	}

	@media (hover: none) {
		.tile-cta {
			display: none;
		}
	}

	.more-cats {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 2.5rem;
		margin-top: 2rem;
		font-family: var(--serif);
		font-size: clamp(22px, 2.2vw, 30px);
	}

	.more-cats a {
		position: relative;
		transition: color 0.3s;
	}

	.more-cats a::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: 2px;
		height: 1px;
		background: currentColor;
		transform: scaleX(0);
		transform-origin: right;
		transition: transform 0.5s var(--ease-out);
	}

	.more-cats a:hover::after {
		transform: scaleX(1);
		transform-origin: left;
	}

	.more-cats .sale {
		color: var(--wine);
		font-style: italic;
	}

	/* ---------- Editorial ---------- */
	.editorial {
		display: grid;
		grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
		gap: clamp(2rem, 6vw, 7rem);
		align-items: center;
	}

	.ed-media {
		position: relative;
		padding-bottom: 18%;
	}

	.ed-a {
		position: relative;
		width: 78%;
		aspect-ratio: 4 / 5;
		overflow: hidden;
	}

	.ed-a > div,
	.ed-b > div {
		position: absolute;
		inset: 0;
	}

	.ed-par {
		position: absolute;
		inset: -8% 0;
	}

	.ed-b {
		position: absolute;
		right: 0;
		bottom: 0;
		width: 42%;
		aspect-ratio: 3 / 4;
		overflow: hidden;
		outline: clamp(6px, 1vw, 12px) solid var(--ivory);
	}

	.ed-text {
		display: grid;
		gap: 1.6rem;
		justify-items: start;
	}

	.ed-title {
		font-size: clamp(3rem, 5.4vw, 5.6rem);
	}

	@media (max-width: 900px) {
		.editorial {
			grid-template-columns: 1fr;
		}
	}

	/* ---------- Grade de produtos ---------- */
	.grid4 {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 2.5rem 1.25rem;
	}

	@media (max-width: 1023px) {
		.grid4 {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 2rem 1rem;
		}
	}

	/* ---------- Serviços ---------- */
	.services {
		margin-top: clamp(5rem, 10vw, 9rem);
		border-block: 1px solid var(--line);
	}

	.services-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.services-grid li {
		display: grid;
		gap: 0.6rem;
		align-content: start;
		padding: clamp(2rem, 4vw, 3rem) clamp(1rem, 2vw, 2rem);
		border-left: 1px solid var(--line);
	}

	.services-grid li:first-child {
		border-left: 0;
		padding-left: 0;
	}

	.services-grid :global(svg) {
		margin-bottom: 0.6rem;
		color: var(--wine);
	}

	.services-grid h3 {
		font-size: 24px;
	}

	.services-grid p {
		font-size: 14px;
		color: var(--ink-2);
		max-width: 28ch;
	}

	@media (max-width: 900px) {
		.services-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.services-grid li:nth-child(3) {
			border-left: 0;
			padding-left: 0;
		}

		.services-grid li:nth-child(n + 3) {
			border-top: 1px solid var(--line);
		}
	}

	/* ---------- Loja física ---------- */
	.visit {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		margin-top: clamp(5rem, 10vw, 9rem);
		background: var(--ink);
		color: var(--ivory);
		min-height: 88vh;
	}

	.visit-media {
		position: relative;
		overflow: hidden;
		min-height: 420px;
	}

	.visit-media > div {
		position: absolute;
		inset: 0;
	}

	.visit-par {
		position: absolute;
		inset: -10% 0;
	}

	.visit-text {
		display: grid;
		align-content: center;
		justify-items: start;
		gap: 1.6rem;
		padding: clamp(3rem, 7vw, 7rem) var(--gutter);
		max-width: 640px;
	}

	.visit-text .eyebrow {
		color: rgb(244 239 231 / 0.6);
	}

	.visit-title {
		font-size: clamp(3rem, 5.6vw, 5.8rem);
	}

	.visit-text p {
		color: rgb(244 239 231 / 0.78);
		font-size: 16px;
		max-width: 44ch;
	}

	dl {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		margin: 0.5rem 0;
		width: 100%;
	}

	dt {
		font-size: 10.5px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: rgb(244 239 231 / 0.5);
		margin-bottom: 0.5rem;
	}

	dd {
		margin: 0;
		font-size: 14px;
		line-height: 1.7;
	}

	@media (max-width: 900px) {
		.visit {
			grid-template-columns: 1fr;
		}
	}

	/* ---------- Instagram ---------- */
	.insta-grid {
		display: grid;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		gap: 0.5rem;
	}

	@media (max-width: 760px) {
		.insta-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	.insta-item {
		position: relative;
		display: block;
		overflow: hidden;
	}

	.insta-hover {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		background: rgb(31 27 24 / 0.45);
		color: var(--paper);
		opacity: 0;
		transition: opacity 0.4s var(--ease);
	}

	.insta-item:hover .insta-hover {
		opacity: 1;
	}
</style>
