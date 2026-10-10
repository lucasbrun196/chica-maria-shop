<script lang="ts">
	import { parallax } from '$lib/actions/parallax';
	import { reveal } from '$lib/actions/reveal';
	import { store } from '$lib/data/store';
	import Icon from '$lib/components/Icon.svelte';
	import PhotoPlaceholder from '$lib/components/PhotoPlaceholder.svelte';

	const values = [
		{
			n: '01',
			title: 'Curadoria',
			text: 'Cada peça passa pelas nossas mãos antes de chegar na arara. Priorizamos tecidos naturais e acabamento bem feito.'
		},
		{
			n: '02',
			title: 'Atendimento de perto',
			text: 'Na loja ou pelo WhatsApp, quem te atende conhece as modelagens e ajuda a escolher o tamanho certo.'
		},
		{
			n: '03',
			title: 'Peças que duram',
			text: 'Preferimos menos lançamentos e mais qualidade. Roupa boa atravessa estações e fica bonita por anos.'
		}
	];

	const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${store.address}, ${store.city} ${store.state}`)}`;
</script>

<svelte:head>
	<title>A Chica Maria — Nossa história</title>
	<meta name="description" content="Conheça a Chica Maria, loja de moda feminina em Passo Fundo, RS." />
</svelte:head>

<section class="container hero">
	<p class="eyebrow fade-in">Nossa história</p>
	<h1 class="display">
		<span class="line-mask" style:--i={0}><span>Uma loja</span></span>
		<span class="line-mask" style:--i={1}><span>de Passo Fundo,</span></span>
		<span class="line-mask" style:--i={2}><span><em>feita de perto.</em></span></span>
	</h1>
</section>

<section class="wide">
	<div class="wide-media" data-reveal="clip" use:reveal>
		<div>
			<div class="par" use:parallax={{ speed: 0.12, scale: 1.12 }}>
				<PhotoPlaceholder tone="#b9a68c" label="Foto da loja" caption="Interior da Chica Maria" ratio="fill" hanger={false} />
			</div>
		</div>
	</div>
</section>

<section class="container story">
	<div class="story-text">
		<p class="big" data-reveal use:reveal>
			A Chica Maria nasceu da vontade de ter, em Passo Fundo, uma loja onde desse para escolher roupa com calma.
			Com café passado e alguém que conhece cada peça da arara.
		</p>
		<div class="cols">
			<p data-reveal use:reveal={100}>
				A curadoria segue a mesma ideia desde o começo: tecidos naturais sempre que possível, modelagens que vestem
				corpos reais e peças que fazem sentido para o clima daqui, que pede linho em janeiro e lã em julho.
			</p>
			<p data-reveal use:reveal={200}>
				Hoje atendemos clientes de todo o Brasil pelo site, mas o jeito continua o de loja de bairro: dá para pedir
				opinião pelo WhatsApp, separar peças para provar e retirar a compra no mesmo dia.
			</p>
		</div>
	</div>
	<div class="story-img" data-reveal="clip" use:reveal={150}>
		<div><PhotoPlaceholder tone="#d8b6a6" label="Foto da equipe" caption="Equipe Chica Maria" ratio="3 / 4" hanger={false} /></div>
	</div>
</section>

<section class="container values">
	{#each values as v, i (v.n)}
		<article data-reveal use:reveal={i * 120}>
			<span class="vn">{v.n}</span>
			<h2>{v.title}</h2>
			<p>{v.text}</p>
		</article>
	{/each}
</section>

<section class="quote">
	<blockquote class="container" data-reveal="lines" use:reveal>
		<span class="line-mask" style:--i={0}><span>“Roupa boa é aquela</span></span>
		<span class="line-mask" style:--i={1}><span>que você <em>esquece</em></span></span>
		<span class="line-mask" style:--i={2}><span>que está usando.”</span></span>
	</blockquote>
</section>

<section class="container strip">
	{#each [{ t: '#cdb79c', c: 'Provadores', s: 0.06 }, { t: '#77714f', c: 'Arara da coleção', s: -0.04 }, { t: '#e2cfae', c: 'Cantinho do café', s: 0.09 }] as g, i (g.c)}
		<div class="strip-item" data-reveal use:reveal={i * 100}>
			<div class="strip-par" use:parallax={{ speed: g.s }}>
				<PhotoPlaceholder tone={g.t} label="Foto da loja" caption={g.c} ratio="3 / 4" hanger={false} />
			</div>
		</div>
	{/each}
</section>

<section class="container visit" id="loja">
	<div class="visit-info">
		<p class="eyebrow" data-reveal use:reveal>Visite a loja</p>
		<h2 class="title" data-reveal use:reveal={80}>Centro de Passo Fundo</h2>
		<ul data-reveal use:reveal={160}>
			<li>
				<Icon name="pin" size={18} />
				<span>{store.address}<br />{store.city}, {store.state} · CEP {store.cep}</span>
			</li>
			<li>
				<Icon name="clock" size={18} />
				<span>{#each store.hours as [d, h] (d)}{d}: {h}<br />{/each}</span>
			</li>
			<li><Icon name="phone" size={18} /> <span>WhatsApp {store.whatsapp}</span></li>
			<li><Icon name="mail" size={18} /> <span>{store.email}</span></li>
			<li><Icon name="instagram" size={18} /> <span>{store.instagram}</span></li>
		</ul>
		<a href={mapsUrl} target="_blank" rel="noopener noreferrer" class="btn" data-reveal use:reveal={240}>
			Abrir no mapa <Icon name="arrow-right" size={14} />
		</a>
	</div>
	<div class="map" data-reveal="clip" use:reveal={120}>
		<div>
			<PhotoPlaceholder tone="#cfc6b6" label="Mapa da localização" caption="Av. Brasil, Centro" ratio="fill" hanger={false} />
		</div>
	</div>
</section>

<style>
	.hero {
		padding-top: clamp(3rem, 7vw, 6rem);
		padding-bottom: clamp(2.5rem, 5vw, 4rem);
	}

	.hero .eyebrow {
		margin-bottom: 1.5rem;
	}

	.fade-in {
		animation: fade 1s var(--ease-out) 0.2s both;
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
	}

	.hero h1 {
		font-size: clamp(3rem, 8.5vw, 9rem);
	}

	.hero .line-mask > span {
		animation: rise 1.3s var(--ease-out) both;
		animation-delay: calc(0.1s + var(--i) * 0.1s);
	}

	@keyframes rise {
		from {
			transform: translate3d(0, 105%, 0);
		}
	}

	.wide-media {
		position: relative;
		height: clamp(380px, 80vh, 820px);
		overflow: hidden;
	}

	.wide-media > div,
	.map > div {
		position: absolute;
		inset: 0;
	}

	.par {
		position: absolute;
		inset: -10% 0;
	}

	.story {
		display: grid;
		grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
		gap: clamp(2rem, 6vw, 6rem);
		padding-top: clamp(5rem, 9vw, 8rem);
		align-items: end;
	}

	.big {
		font-family: var(--serif);
		font-size: clamp(26px, 3vw, 42px);
		line-height: 1.2;
		margin-bottom: 2.5rem;
	}

	.cols {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		color: var(--ink-2);
	}

	.story-img {
		overflow: hidden;
	}

	@media (max-width: 900px) {
		.story,
		.cols {
			grid-template-columns: 1fr;
		}
	}

	.values {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: clamp(1.5rem, 4vw, 4rem);
		padding-top: clamp(5rem, 9vw, 8rem);
	}

	.values article {
		padding-top: 1.5rem;
		border-top: 1px solid var(--ink);
		display: grid;
		gap: 0.9rem;
		align-content: start;
	}

	.vn {
		font-size: 11px;
		letter-spacing: 0.2em;
		color: var(--ink-3);
	}

	.values h2 {
		font-size: 32px;
	}

	.values p {
		color: var(--ink-2);
		font-size: 15px;
	}

	@media (max-width: 760px) {
		.values {
			grid-template-columns: 1fr;
		}
	}

	.quote {
		margin-top: clamp(5rem, 10vw, 9rem);
		padding: clamp(5rem, 10vw, 9rem) 0;
		background: var(--wine);
		color: var(--ivory);
	}

	blockquote {
		margin: 0 auto;
		font-family: var(--serif);
		font-size: clamp(2.4rem, 6vw, 6rem);
		line-height: 1;
		letter-spacing: -0.02em;
		text-align: center;
	}

	.strip {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: clamp(0.75rem, 2vw, 2rem);
		padding-top: clamp(5rem, 9vw, 8rem);
	}

	.strip-item {
		overflow: hidden;
	}

	.strip-item:nth-child(2) {
		margin-top: clamp(2rem, 6vw, 6rem);
	}

	@media (max-width: 640px) {
		.strip {
			grid-template-columns: 1fr 1fr;
		}

		.strip-item:nth-child(3) {
			display: none;
		}
	}

	.visit {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr);
		gap: clamp(2rem, 6vw, 6rem);
		padding-top: clamp(5rem, 9vw, 8rem);
		scroll-margin-top: calc(var(--header-h) + 1rem);
	}

	.visit-info {
		display: grid;
		gap: 1.5rem;
		align-content: center;
		justify-items: start;
	}

	.visit ul {
		display: grid;
		gap: 1rem;
		font-size: 14.5px;
		color: var(--ink-2);
	}

	.visit li {
		display: flex;
		gap: 0.9rem;
		align-items: flex-start;
		line-height: 1.6;
	}

	.visit li :global(svg) {
		flex: none;
		margin-top: 3px;
	}

	.map {
		position: relative;
		min-height: 420px;
		overflow: hidden;
	}

	@media (max-width: 900px) {
		.visit {
			grid-template-columns: 1fr;
		}
	}
</style>
