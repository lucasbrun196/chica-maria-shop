<script lang="ts">
	import { page } from '$app/state';
	import { reveal } from '$lib/actions/reveal';
	import { categories } from '$lib/data/products';
	import { store } from '$lib/data/store';
	import Icon from './Icon.svelte';
	import Newsletter from './Newsletter.svelte';

	const minimal = $derived(page.url.pathname.startsWith('/checkout'));
	const year = new Date().getFullYear();
</script>

{#if minimal}
	<footer class="mini">
		<div class="container mini-row">
			<span>© {year} Chica Maria. Todos os direitos reservados.</span>
			<span>Desenvolvido por Lucas Brun</span>
		</div>
	</footer>
{:else}
	<footer class="footer">
		<div class="container">
			<div class="top">
				<div class="news" data-reveal use:reveal>
					<p class="eyebrow">Newsletter</p>
					<h2>Novidades, reposições e convites para os eventos da loja.</h2>
					<Newsletter />
				</div>

				<nav class="cols" aria-label="Rodapé">
					<div>
						<p class="eyebrow">Loja</p>
						<ul>
							<li><a href="/loja/novidades">Novidades</a></li>
							{#each categories.slice(0, 6) as c (c.slug)}
								<li><a href="/loja/{c.slug}">{c.short}</a></li>
							{/each}
							<li><a href="/loja/promocoes">Promoções</a></li>
						</ul>
					</div>
					<div>
						<p class="eyebrow">Ajuda</p>
						<ul>
							<li><a href="/ajuda#entregas">Entregas</a></li>
							<li><a href="/ajuda#trocas">Trocas e devoluções</a></li>
							<li><a href="/ajuda#medidas">Guia de medidas</a></li>
							<li><a href="/ajuda#pagamentos">Pagamentos</a></li>
							<li><a href="/ajuda#perguntas">Perguntas frequentes</a></li>
						</ul>
					</div>
					<div>
						<p class="eyebrow">Chica Maria</p>
						<ul>
							<li><a href="/sobre">Nossa história</a></li>
							<li><a href="/colecao">Coleção</a></li>
							<li><a href="/sobre#loja">Loja física</a></li>
							<li><a href="/conta">Minha conta</a></li>
						</ul>
					</div>
					<div>
						<p class="eyebrow">Atendimento</p>
						<ul class="contact">
							<li><Icon name="phone" size={15} /> {store.whatsapp}</li>
							<li><Icon name="mail" size={15} /> {store.email}</li>
							<li><Icon name="instagram" size={15} /> {store.instagram}</li>
							<li><Icon name="pin" size={15} /> {store.address}<br />{store.city}, {store.state}</li>
						</ul>
					</div>
				</nav>
			</div>

			<div class="mark" data-reveal="lines" use:reveal>
				<span class="line-mask"><span>Chica <em>Maria</em></span></span>
			</div>

			<div class="bottom">
				<span>© {year} Chica Maria Moda Feminina. Todos os direitos reservados. · CNPJ 00.000.000/0001-00 · Passo Fundo, RS</span>
				<span>Desenvolvido por <strong>Lucas Brun</strong></span>
			</div>
		</div>
	</footer>
{/if}

<style>
	.footer {
		margin-top: clamp(5rem, 10vw, 9rem);
		background: var(--ink);
		color: var(--ivory);
		padding: clamp(4rem, 7vw, 6rem) 0 2rem;
		overflow: hidden;
	}

	.footer .eyebrow {
		color: rgb(244 239 231 / 0.55);
		margin-bottom: 1.2rem;
	}

	.top {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr);
		gap: clamp(3rem, 6vw, 7rem);
	}

	@media (max-width: 1023px) {
		.top {
			grid-template-columns: 1fr;
		}
	}

	.news h2 {
		font-size: clamp(26px, 2.6vw, 36px);
		line-height: 1.12;
		margin-bottom: 2rem;
		max-width: 20ch;
	}

	.cols {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr)) minmax(0, 1.5fr);
		gap: 2rem;
	}

	@media (max-width: 760px) {
		.cols {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	.cols ul {
		display: grid;
		gap: 0.55rem;
		font-size: 14px;
		color: rgb(244 239 231 / 0.82);
	}

	.cols a {
		transition: color 0.3s;
	}

	.cols a:hover {
		color: var(--paper);
		text-decoration: underline;
		text-underline-offset: 4px;
	}

	.contact li {
		display: flex;
		gap: 0.6rem;
		align-items: flex-start;
		line-height: 1.5;
		overflow-wrap: anywhere;
	}

	.contact :global(svg) {
		flex: none;
		margin-top: 3px;
		opacity: 0.7;
	}

	.mark {
		margin: clamp(4rem, 8vw, 7rem) 0 1.5rem;
		font-family: var(--serif);
		font-size: clamp(64px, 17.5vw, 290px);
		line-height: 0.82;
		letter-spacing: -0.035em;
		white-space: nowrap;
		text-align: center;
	}

	.bottom {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 0.75rem 2rem;
		padding-top: 1.5rem;
		border-top: 1px solid rgb(244 239 231 / 0.14);
		font-size: 12px;
		color: rgb(244 239 231 / 0.55);
	}

	.bottom strong {
		font-weight: 500;
		color: var(--ivory);
	}

	.mini {
		margin-top: 4rem;
		border-top: 1px solid var(--line);
		padding: 1.5rem 0;
		font-size: 12px;
		color: var(--ink-3);
	}

	.mini-row {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 0.5rem 2rem;
	}
</style>
