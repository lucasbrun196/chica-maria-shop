<script lang="ts">
	import { page } from '$app/state';
	import { popularSearches } from '$lib/utils/search';
</script>

<svelte:head>
	<title>{page.status === 404 ? 'Página não encontrada' : 'Erro'} — Chica Maria</title>
</svelte:head>

<section class="container err">
	<p class="code" aria-hidden="true">{page.status}</p>
	<h1 class="title">
		{page.status === 404 ? 'Essa página saiu da arara.' : 'Algo não saiu como esperado.'}
	</h1>
	<p class="lead">
		{page.status === 404
			? 'O endereço pode ter mudado ou a peça não está mais disponível. Que tal continuar por aqui?'
			: 'Tente recarregar a página em alguns instantes.'}
	</p>
	<div class="actions">
		<a href="/" class="btn">Página inicial</a>
		<a href="/loja/novidades" class="btn btn--ghost">Ver novidades</a>
	</div>
	<div class="popular">
		<span class="eyebrow">Mais procurados</span>
		{#each popularSearches as t (t)}
			<a href="/loja?busca={encodeURIComponent(t)}">{t}</a>
		{/each}
	</div>
</section>

<style>
	.err {
		display: grid;
		justify-items: center;
		text-align: center;
		gap: 1.25rem;
		padding-top: clamp(3rem, 8vw, 6rem);
		padding-bottom: 2rem;
	}

	.code {
		font-family: var(--serif);
		font-style: italic;
		font-size: clamp(8rem, 26vw, 22rem);
		line-height: 0.8;
		color: transparent;
		-webkit-text-stroke: 1px var(--ink);
		animation: in 1.2s var(--ease-out) both;
	}

	@keyframes in {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
	}

	.lead {
		margin-inline: auto;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.75rem;
		margin-top: 0.5rem;
	}

	.popular {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 0.6rem 1.25rem;
		margin-top: 2.5rem;
		font-size: 14px;
	}

	.popular .eyebrow {
		color: var(--ink-3);
		width: 100%;
	}

	.popular a {
		text-decoration: underline;
		text-underline-offset: 3px;
		text-decoration-color: var(--line-2);
	}
</style>
