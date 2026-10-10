<script lang="ts">
	import { sizeGuide } from '$lib/data/products';
	import { FREE_SHIPPING_FROM, store } from '$lib/data/store';
	import { money } from '$lib/utils/format';
	import Accordion from '$lib/components/Accordion.svelte';
	import Icon from '$lib/components/Icon.svelte';

	const sections = [
		{ id: 'entregas', label: 'Entregas' },
		{ id: 'trocas', label: 'Trocas e devoluções' },
		{ id: 'medidas', label: 'Guia de medidas' },
		{ id: 'pagamentos', label: 'Pagamentos' },
		{ id: 'perguntas', label: 'Perguntas frequentes' }
	];

	const faq = [
		{
			q: 'Preciso ter conta para comprar?',
			a: 'Você pode navegar e montar sua sacola sem cadastro. Para finalizar a compra, pedimos que entre ou crie uma conta, assim conseguimos enviar o pedido e você acompanha tudo pela área do cliente.'
		},
		{
			q: 'Como sei qual tamanho escolher?',
			a: 'Cada produto tem a tabela de medidas e uma observação sobre a modelagem. Se ficar em dúvida, chame a gente no WhatsApp com suas medidas que ajudamos a escolher.'
		},
		{
			q: 'Posso retirar o pedido na loja?',
			a: 'Pode. Escolha "Retirar na loja" no checkout. Avisamos por WhatsApp quando estiver pronto, normalmente em 1 dia útil.'
		},
		{
			q: 'Vocês têm cupom de primeira compra?',
			a: 'Sim. Use BEMVINDA10 para ganhar 10% de desconto na primeira compra pelo site. O cupom não é cumulativo com outras promoções.'
		},
		{
			q: 'As cores das fotos são fiéis?',
			a: 'Fotografamos as peças com luz natural para ficar o mais próximo possível do real, mas a cor pode variar um pouco conforme a tela.'
		},
		{
			q: 'Fazem embalagem para presente?',
			a: 'Todo pedido vai em embalagem da Chica Maria. Se for presente, avise na observação ou pelo WhatsApp que incluímos um cartão escrito à mão, sem o valor da compra.'
		}
	];

	let active = $state('entregas');

	$effect(() => {
		const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) if (e.isIntersecting) active = e.target.id;
			},
			{ rootMargin: '-35% 0px -60% 0px' }
		);
		els.forEach((el) => io.observe(el));
		return () => io.disconnect();
	});
</script>

<svelte:head>
	<title>Ajuda — Chica Maria</title>
</svelte:head>

<section class="container head">
	<p class="eyebrow">Central de ajuda</p>
	<h1 class="display">Como podemos <em>ajudar?</em></h1>
	<p class="lead">
		Entregas, trocas, medidas e pagamentos. Se não encontrar o que procura, fale com a gente pelo WhatsApp
		{store.whatsapp}.
	</p>
</section>

<div class="container layout">
	<nav class="side" aria-label="Tópicos">
		{#each sections as s (s.id)}
			<a href="#{s.id}" class:on={active === s.id}>{s.label}</a>
		{/each}
	</nav>

	<div class="content">
		<section id="entregas">
			<h2>Entregas</h2>
			<div class="cards">
				<div class="c">
					<Icon name="truck" size={22} />
					<h3>Correios</h3>
					<p>PAC e SEDEX para todo o Brasil. Frete grátis no PAC em compras acima de {money(FREE_SHIPPING_FROM)}.</p>
				</div>
				<div class="c">
					<Icon name="pin" size={22} />
					<h3>Entrega local</h3>
					<p>Em Passo Fundo, entregamos por motoboy em até 1 dia útil. Grátis acima de {money(FREE_SHIPPING_FROM)}.</p>
				</div>
				<div class="c">
					<Icon name="store" size={22} />
					<h3>Retirada na loja</h3>
					<p>Sem custo. O pedido fica pronto em 1 dia útil e você retira no Centro.</p>
				</div>
			</div>
			<p>
				Os pedidos são despachados em até 2 dias úteis após a confirmação do pagamento. O prazo de entrega começa a
				contar a partir do envio, e você recebe o código de rastreio por e-mail.
			</p>
		</section>

		<section id="trocas">
			<h2>Trocas e devoluções</h2>
			<ol class="steps">
				<li><span>1</span><p>Solicite a troca em até 30 dias após o recebimento, pela área do cliente ou pelo WhatsApp.</p></li>
				<li><span>2</span><p>Enviamos um código de postagem. A primeira troca de cada pedido é grátis.</p></li>
				<li><span>3</span><p>Assim que a peça chegar, enviamos o novo tamanho ou liberamos um vale-compras.</p></li>
			</ol>
			<p>
				A peça precisa estar sem uso, sem lavagem e com a etiqueta. Brincos, por questões de higiene, não podem ser
				trocados. Em caso de desistência, o reembolso é feito em até 10 dias úteis após recebermos a devolução.
			</p>
		</section>

		<section id="medidas">
			<h2>Guia de medidas</h2>
			<p>Medidas do corpo em centímetros. Se estiver entre dois tamanhos, escolha o maior.</p>
			<div class="tables">
				{#each [{ t: 'Roupas', g: sizeGuide.roupas }, { t: 'Jeans', g: sizeGuide.jeans }] as tb (tb.t)}
					<div>
						<h3>{tb.t}</h3>
						<table>
							<thead><tr>{#each tb.g.headers as h (h)}<th>{h}</th>{/each}</tr></thead>
							<tbody>
								{#each tb.g.rows as row (row[0])}<tr>{#each row as c, i (i)}<td>{c}</td>{/each}</tr>{/each}
							</tbody>
						</table>
					</div>
				{/each}
			</div>
		</section>

		<section id="pagamentos">
			<h2>Pagamentos</h2>
			<ul class="pay">
				<li><strong>Pix</strong><span>5% de desconto, aprovação imediata.</span></li>
				<li><strong>Cartão de crédito</strong><span>Visa, Mastercard, Elo, American Express e Hipercard. Até 6x sem juros, parcela mínima de R$ 50.</span></li>
				<li><strong>Boleto</strong><span>Vence em 3 dias úteis. O pedido é liberado após a compensação.</span></li>
			</ul>
		</section>

		<section id="perguntas">
			<h2>Perguntas frequentes</h2>
			<div class="faq">
				{#each faq as item (item.q)}
					<Accordion title={item.q}>
						<p>{item.a}</p>
					</Accordion>
				{/each}
			</div>
		</section>
	</div>
</div>

<style>
	.head {
		padding-top: clamp(2.5rem, 6vw, 5rem);
		padding-bottom: clamp(2.5rem, 5vw, 4rem);
		display: grid;
		gap: 1.25rem;
	}

	.head h1 {
		font-size: clamp(3rem, 7vw, 6.5rem);
		animation: in 1s var(--ease-out) both;
	}

	@keyframes in {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
	}

	.layout {
		display: grid;
		grid-template-columns: 220px minmax(0, 1fr);
		gap: clamp(2rem, 6vw, 6rem);
		align-items: start;
		border-top: 1px solid var(--line);
		padding-top: 3rem;
	}

	.side {
		position: sticky;
		top: calc(var(--header-h) + 2rem);
		display: grid;
		gap: 0.2rem;
	}

	.side a {
		position: relative;
		padding: 0.5rem 0 0.5rem 1rem;
		font-size: 14px;
		color: var(--ink-3);
		transition: color 0.3s;
	}

	.side a::before {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		width: 1px;
		height: 0;
		background: var(--ink);
		transform: translateY(-50%);
		transition: height 0.4s var(--ease-out);
	}

	.side a.on {
		color: var(--ink);
	}

	.side a.on::before {
		height: 70%;
	}

	@media (max-width: 900px) {
		.layout {
			grid-template-columns: 1fr;
		}

		.side {
			display: none;
		}
	}

	section[id] {
		scroll-margin-top: calc(var(--header-h) + 1.5rem);
		padding-bottom: 4rem;
		margin-bottom: 4rem;
		border-bottom: 1px solid var(--line);
		display: grid;
		gap: 1.5rem;
	}

	section[id]:last-child {
		border-bottom: 0;
	}

	h2 {
		font-size: clamp(32px, 3.4vw, 46px);
	}

	h3 {
		font-size: 22px;
	}

	.content p {
		color: var(--ink-2);
		max-width: 70ch;
	}

	.cards {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
	}

	@media (max-width: 760px) {
		.cards {
			grid-template-columns: 1fr;
		}
	}

	.c {
		display: grid;
		gap: 0.6rem;
		align-content: start;
		padding: 1.5rem;
		background: var(--paper);
		border: 1px solid var(--line);
	}

	.c :global(svg) {
		color: var(--wine);
		margin-bottom: 0.25rem;
	}

	.c p {
		font-size: 14px;
	}

	.steps {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1.5rem;
	}

	@media (max-width: 760px) {
		.steps {
			grid-template-columns: 1fr;
		}
	}

	.steps li {
		display: grid;
		gap: 0.75rem;
		padding-top: 1rem;
		border-top: 1px solid var(--ink);
	}

	.steps span {
		font-family: var(--serif);
		font-size: 34px;
		font-style: italic;
		line-height: 1;
	}

	.steps p {
		font-size: 14px;
	}

	.tables {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
	}

	@media (max-width: 760px) {
		.tables {
			grid-template-columns: 1fr;
		}
	}

	.tables h3 {
		margin-bottom: 0.75rem;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 14px;
		font-variant-numeric: tabular-nums;
	}

	th {
		text-align: left;
		font-size: 10.5px;
		font-weight: 500;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		padding: 0.7rem 0.4rem;
		border-bottom: 1px solid var(--ink);
	}

	td {
		padding: 0.7rem 0.4rem;
		border-bottom: 1px solid var(--line);
	}

	tbody tr {
		transition: background 0.2s;
	}

	tbody tr:hover {
		background: var(--paper);
	}

	.pay {
		display: grid;
		border-top: 1px solid var(--line);
	}

	.pay li {
		display: grid;
		grid-template-columns: 200px 1fr;
		gap: 1rem;
		padding: 1.1rem 0;
		border-bottom: 1px solid var(--line);
		font-size: 14.5px;
	}

	.pay strong {
		font-weight: 500;
	}

	.pay span {
		color: var(--ink-2);
	}

	@media (max-width: 560px) {
		.pay li {
			grid-template-columns: 1fr;
			gap: 0.25rem;
		}
	}

	.faq {
		border-top: 1px solid var(--line);
	}
</style>
