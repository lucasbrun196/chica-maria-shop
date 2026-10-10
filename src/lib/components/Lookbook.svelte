<script lang="ts">
	import { tick } from 'svelte';
	import { getProduct, looks } from '$lib/data/products';
	import { reveal } from '$lib/actions/reveal';
	import { money } from '$lib/utils/format';
	import Icon from './Icon.svelte';
	import PhotoPlaceholder from './PhotoPlaceholder.svelte';

	let section: HTMLElement;
	let viewport: HTMLElement;
	let track: HTMLElement;
	let bar: HTMLElement;
	let pinned = $state(false);
	let height = $state<string | null>(null);

	const data = looks.map((l) => ({ ...l, products: l.items.map((id) => getProduct(id)!) }));

	/*
	 * No desktop a seção fica presa (sticky) e o scroll vertical move a trilha
	 * na horizontal. No celular vira um carrossel nativo com scroll-snap.
	 */
	$effect(() => {
		const mq = matchMedia('(min-width: 900px) and (prefers-reduced-motion: no-preference)');
		let distance = 0;
		let on = false;
		let visible = false;
		let ticking = false;

		const update = () => {
			ticking = false;
			if (!on || !distance) return;
			const top = section.getBoundingClientRect().top;
			const p = Math.min(1, Math.max(0, -top / distance));
			track.style.transform = `translate3d(${(-p * distance).toFixed(1)}px, 0, 0)`;
			bar.style.transform = `scaleX(${p.toFixed(4)})`;
		};

		const onScroll = () => {
			if (!visible || ticking) return;
			ticking = true;
			requestAnimationFrame(update);
		};

		const measure = async () => {
			on = mq.matches;
			pinned = on;
			if (!on) {
				height = null;
				track.style.transform = '';
				return;
			}
			// espera o layout "preso" ser aplicado antes de medir a trilha
			await tick();
			distance = Math.max(0, track.offsetWidth - viewport.clientWidth);
			height = `${window.innerHeight + distance}px`;
			update();
		};

		const io = new IntersectionObserver(([e]) => {
			visible = e.isIntersecting;
			if (visible) onScroll();
		});
		const ro = new ResizeObserver(measure);

		io.observe(section);
		ro.observe(viewport);
		ro.observe(track);
		mq.addEventListener('change', measure);
		addEventListener('scroll', onScroll, { passive: true });
		measure();

		return () => {
			io.disconnect();
			ro.disconnect();
			mq.removeEventListener('change', measure);
			removeEventListener('scroll', onScroll);
		};
	});
</script>

<section class="lb" class:pinned bind:this={section} style:height aria-label="Looks da estação">
	<div class="sticky">
		<div class="container head">
			<div data-reveal use:reveal>
				<p class="eyebrow">Lookbook · Primavera–Verão 26/27</p>
				<h2 class="title">Seis looks para a estação</h2>
			</div>
			<p class="hint" data-reveal use:reveal={120}>
				{pinned ? 'Continue rolando para ver todos' : 'Deslize para ver todos'}
				<Icon name="arrow-right" size={16} />
			</p>
		</div>

		<div class="viewport" bind:this={viewport}>
			<ol class="track" bind:this={track}>
				{#each data as look (look.n)}
					<li class="look">
						<div class="img">
							<PhotoPlaceholder tone={look.tone} label="Foto do look" caption={look.title} ratio="fill" hanger={false} />
							<span class="num">Look {look.n}</span>
						</div>
						<div class="info">
							<h3>{look.title}</h3>
							<ul>
								{#each look.products as p (p.id)}
									<li>
										<a href="/produto/{p.slug}">
											<span>{p.name}</span>
											<span class="price">{money(p.price)}</span>
										</a>
									</li>
								{/each}
							</ul>
						</div>
					</li>
				{/each}
				<li class="look end">
					<a href="/colecao" class="end-card">
						<span class="eyebrow">Coleção completa</span>
						<span class="end-title">Ver todas as peças da estação</span>
						<span class="circle"><Icon name="arrow-right" size={22} /></span>
					</a>
				</li>
			</ol>
		</div>

		<div class="container">
			<div class="progress" aria-hidden="true"><span bind:this={bar}></span></div>
		</div>
	</div>
</section>

<style>
	.lb {
		position: relative;
		padding: clamp(4rem, 8vw, 7rem) 0;
	}

	.lb.pinned {
		padding: 0;
	}

	.pinned .sticky {
		position: sticky;
		top: 0;
		height: 100vh;
		height: 100svh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: clamp(1.25rem, 3vh, 2.5rem);
		overflow: hidden;
	}

	.head {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 2rem;
		margin-bottom: 2rem;
	}

	.pinned .head {
		margin-bottom: 0;
	}

	.head .eyebrow {
		margin-bottom: 1rem;
	}

	.hint {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		font-size: 11px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ink-3);
		white-space: nowrap;
	}

	.viewport {
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		scrollbar-width: none;
		overscroll-behavior-x: contain;
	}

	.viewport::-webkit-scrollbar {
		display: none;
	}

	.pinned .viewport {
		overflow: visible;
	}

	.track {
		display: flex;
		gap: clamp(1rem, 2vw, 2rem);
		width: max-content;
		padding-inline: var(--gutter);
		will-change: transform;
	}

	.look {
		width: min(78vw, 340px);
		scroll-snap-align: center;
		display: grid;
		gap: 1.1rem;
		align-content: start;
	}

	.pinned .look {
		width: auto;
		grid-template-columns: auto minmax(220px, 260px);
		gap: 1.5rem;
		align-items: end;
	}

	.img {
		position: relative;
		aspect-ratio: 3 / 4;
	}

	.pinned .img {
		height: min(66vh, 640px);
		aspect-ratio: 3 / 4;
	}

	.num {
		position: absolute;
		top: 1.2rem;
		left: 1.4rem;
		font-family: var(--serif);
		font-style: italic;
		font-size: 22px;
		mix-blend-mode: difference;
		color: #f4efe7;
	}

	.info h3 {
		font-size: 28px;
		margin-bottom: 1rem;
	}

	.info ul {
		display: grid;
		border-top: 1px solid var(--line);
	}

	.info a {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.7rem 0;
		border-bottom: 1px solid var(--line);
		font-size: 13.5px;
		transition:
			padding 0.4s var(--ease-out),
			color 0.3s;
	}

	.info a:hover {
		padding-left: 6px;
		color: var(--wine);
	}

	.price {
		color: var(--ink-3);
		white-space: nowrap;
	}

	.end {
		align-self: stretch;
	}

	.pinned .end {
		grid-template-columns: 1fr;
		width: 340px;
	}

	.end-card {
		height: 100%;
		min-height: 320px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 1.2rem;
		padding: 2rem;
		border: 1px solid var(--line-2);
		transition: background 0.5s var(--ease);
	}

	.end-card:hover {
		background: var(--sand);
	}

	.end-title {
		font-family: var(--serif);
		font-size: 34px;
		line-height: 1.05;
	}

	.circle {
		width: 64px;
		height: 64px;
		border-radius: 50%;
		border: 1px solid var(--ink);
		display: grid;
		place-items: center;
		transition:
			background 0.4s,
			color 0.4s,
			transform 0.6s var(--ease-out);
	}

	.end-card:hover .circle {
		background: var(--ink);
		color: var(--paper);
		transform: translateX(8px);
	}

	.progress {
		height: 1px;
		background: var(--line);
		margin-top: 1.5rem;
		overflow: hidden;
	}

	.lb:not(.pinned) .progress {
		display: none;
	}

	.progress span {
		display: block;
		height: 100%;
		background: var(--ink);
		transform: scaleX(0);
		transform-origin: left;
	}
</style>
