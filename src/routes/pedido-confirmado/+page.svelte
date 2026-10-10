<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { store } from '$lib/data/store';
	import { auth } from '$lib/stores/auth.svelte';
	import { orders, type Order } from '$lib/stores/orders.svelte';
	import { ui } from '$lib/stores/ui.svelte';
	import { addBusinessDays, dateLong, money } from '$lib/utils/format';
	import { barcodePath, boletoLine, pixCode, qrPath } from '$lib/utils/fakecodes';
	import Icon from '$lib/components/Icon.svelte';
	import PhotoPlaceholder from '$lib/components/PhotoPlaceholder.svelte';

	let orderId = $state<string | null>(null);
	let remaining = $state(30 * 60);
	let confirming = $state(false);

	$effect(() => {
		orderId = new URLSearchParams(location.search).get('pedido');
	});

	const order = $derived.by((): Order | undefined => {
		if (!auth.user) return undefined;
		const mine = orders.forUser(auth.user.email);
		return (orderId && mine.find((o) => o.id === orderId)) || mine[0];
	});

	const pending = $derived(order?.status === 'aguardando');
	const pix = $derived(order ? pixCode(order.id, order.total) : '');
	const qr = $derived(order ? qrPath(order.id) : '');
	const boleto = $derived(order ? boletoLine(order.id, order.total) : '');
	const bars = $derived(order ? barcodePath(order.id) : { d: '', width: 0 });
	const eta = $derived(order ? dateLong(addBusinessDays(order.createdAt, order.delivery.days + (pending ? 1 : 0))) : '');
	const mmss = $derived(
		`${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`
	);

	// contagem regressiva do Pix
	$effect(() => {
		if (order?.payment.method !== 'pix' || !pending) return;
		const t = setInterval(() => (remaining = Math.max(0, remaining - 1)), 1000);
		return () => clearInterval(t);
	});

	async function copy(text: string, label: string) {
		try {
			await navigator.clipboard.writeText(text);
			ui.toast(`${label} copiado`);
		} catch {
			ui.toast('Não foi possível copiar. Selecione o código manualmente.');
		}
	}

	async function simulatePaid() {
		if (!order) return;
		confirming = true;
		await new Promise((r) => setTimeout(r, 1200));
		orders.setStatus(order.id, 'aprovado');
		confirming = false;
		ui.toast('Pagamento confirmado');
	}

	const steps = $derived(
		order
			? [
					{ label: 'Pedido recebido', done: true },
					{ label: pending ? 'Aguardando pagamento' : 'Pagamento aprovado', done: !pending },
					{ label: 'Em separação', done: false },
					{ label: order.delivery.id === 'retirada' ? 'Pronto para retirada' : 'Enviado', done: false }
				]
			: []
	);
</script>

<svelte:head>
	<title>Pedido confirmado — Chica Maria</title>
</svelte:head>

<section class="container page">
	{#if !auth.ready}
		<div class="center"><span class="spinner"></span></div>
	{:else if !order}
		<div class="center">
			<p class="big">Nenhum pedido por aqui.</p>
			<p class="muted">Entre na sua conta para ver seus pedidos.</p>
			<a href={auth.user ? '/conta' : '/entrar'} class="btn">{auth.user ? 'Minha conta' : 'Entrar'}</a>
		</div>
	{:else}
		<header class="hero">
			<div class="mark" in:fade={{ duration: 600 }}>
				<svg viewBox="0 0 52 52" width="68" height="68" aria-hidden="true">
					<circle cx="26" cy="26" r="25" fill="none" stroke="currentColor" stroke-width="1" class="c" />
					<path d="M15 27l7 7 15-16" fill="none" stroke="currentColor" stroke-width="1.4" class="k" />
				</svg>
			</div>
			<p class="eyebrow">Pedido {order.id}</p>
			<h1 class="display">
				<span class="line-mask"><span>Obrigada,</span></span>
				<span class="line-mask"><span><em>{auth.firstName}.</em></span></span>
			</h1>
			<p class="lead">
				{#if order.payment.method === 'card' || !pending}
					Seu pedido foi confirmado e já está com a nossa equipe. Enviamos os detalhes para {order.email}.
				{:else if order.payment.method === 'pix'}
					Falta só o pagamento. Use o QR Code abaixo no app do seu banco para concluir.
				{:else}
					Seu boleto foi gerado. Assim que o pagamento for compensado, começamos a separar as peças.
				{/if}
			</p>
		</header>

		<div class="layout">
			<div class="main">
				{#if order.payment.method === 'pix' && pending}
					<section class="card pay" in:fly={{ y: 20, duration: 600, delay: 300, easing: quintOut }}>
						<div class="qr">
							<svg viewBox="-2 -2 33 33" width="190" height="190" role="img" aria-label="QR Code Pix">
								<rect x="-2" y="-2" width="33" height="33" fill="#fff" />
								<path d={qr} fill="#1f1b18" shape-rendering="crispEdges" />
							</svg>
						</div>
						<div class="pay-info">
							<p class="eyebrow">Pague com Pix</p>
							<p class="amount">{money(order.total)}</p>
							<p class="timer">O código expira em <strong>{mmss}</strong></p>
							<ol class="how">
								<li>Abra o app do seu banco e escolha pagar com Pix</li>
								<li>Escaneie o QR Code ou use o código copia e cola</li>
								<li>Confirme o pagamento. A aprovação é imediata</li>
							</ol>
							<div class="code">
								<input readonly value={pix} aria-label="Código Pix copia e cola" onfocus={(e) => e.currentTarget.select()} />
								<button class="btn btn--sm" onclick={() => copy(pix, 'Código Pix')}>Copiar</button>
							</div>
							<button class="text-link sim" onclick={simulatePaid} disabled={confirming}>
								{confirming ? 'Confirmando pagamento…' : 'Já paguei'}
							</button>
						</div>
					</section>
				{:else if order.payment.method === 'boleto' && pending}
					<section class="card boleto" in:fly={{ y: 20, duration: 600, delay: 300, easing: quintOut }}>
						<div class="b-head">
							<p class="eyebrow">Boleto bancário</p>
							<p class="amount">{money(order.total)}</p>
							<p class="muted">Vencimento em {dateLong(addBusinessDays(order.createdAt, 3))}</p>
						</div>
						<svg class="bars" viewBox="0 0 {bars.width} 60" preserveAspectRatio="none" aria-hidden="true">
							<path d={bars.d} fill="#1f1b18" />
						</svg>
						<div class="code">
							<input readonly value={boleto} aria-label="Linha digitável" onfocus={(e) => e.currentTarget.select()} />
							<button class="btn btn--sm" onclick={() => copy(boleto, 'Código do boleto')}>Copiar</button>
						</div>
						<button class="text-link sim" onclick={simulatePaid} disabled={confirming}>
							{confirming ? 'Compensando…' : 'Simular compensação do boleto'}
						</button>
					</section>
				{:else}
					<section class="card ok" in:fly={{ y: 20, duration: 600, delay: 300, easing: quintOut }}>
						<Icon name="check" size={22} />
						<div>
							<p class="ok-title">Pagamento aprovado</p>
							<p class="muted">
								{#if order.payment.method === 'card'}
									{order.payment.brand} final {order.payment.last4} · {order.payment.installments}x de
									{money(order.total / (order.payment.installments ?? 1))}
								{:else}
									{order.payment.method === 'pix' ? 'Pix' : 'Boleto'} · {money(order.total)}
								{/if}
							</p>
						</div>
					</section>
				{/if}

				<section class="card">
					<h2>Acompanhamento</h2>
					<ol class="timeline">
						{#each steps as s, i (s.label)}
							<li class:done={s.done} style:--i={i}>
								<span class="tl-dot">{#if s.done}<Icon name="check" size={11} />{/if}</span>
								<span>{s.label}</span>
							</li>
						{/each}
					</ol>
				</section>

				<section class="card two">
					<div>
						<h3>{order.delivery.id === 'retirada' ? 'Retirada' : 'Entrega'}</h3>
						{#if order.delivery.id === 'retirada'}
							<p>
								{store.address}<br />{store.city}, {store.state}<br />
								<small>Disponível a partir de {eta}</small>
							</p>
						{:else}
							<p>
								{order.recipient}<br />
								{order.address.street}, {order.address.number}{order.address.complement ? ` · ${order.address.complement}` : ''}<br />
								{order.address.district} · {order.address.city}, {order.address.state}<br />
								<small>{order.delivery.label} · previsão até {eta}</small>
							</p>
						{/if}
					</div>
					<div>
						<h3>Dúvidas?</h3>
						<p>
							Fale com a gente pelo WhatsApp {store.whatsapp} ou pelo e-mail {store.email}. Informe o número
							{order.id}.
						</p>
					</div>
				</section>
			</div>

			<aside class="summary">
				<h2>Resumo</h2>
				<ul class="items">
					{#each order.lines as l (l.id + l.size + l.color)}
						<li>
							<a href="/produto/{l.slug}" class="thumb"><PhotoPlaceholder tone={l.tone} /></a>
							<span class="i-meta">
								<a href="/produto/{l.slug}" class="i-name">{l.name}</a>
								<small>{l.color} · {l.size} · {l.qty} {l.qty === 1 ? 'unidade' : 'unidades'}</small>
							</span>
							<span>{money(l.price * l.qty)}</span>
						</li>
					{/each}
				</ul>
				<dl>
					<div><dt>Subtotal</dt><dd>{money(order.subtotal)}</dd></div>
					{#if order.couponDiscount}<div class="green"><dt>Cupom {order.coupon}</dt><dd>−{money(order.couponDiscount)}</dd></div>{/if}
					{#if order.pixDiscount}<div class="green"><dt>Desconto Pix</dt><dd>−{money(order.pixDiscount)}</dd></div>{/if}
					<div><dt>Frete</dt><dd>{order.shipping ? money(order.shipping) : 'Grátis'}</dd></div>
				</dl>
				<div class="total"><span>Total</span><strong>{money(order.total)}</strong></div>
				<div class="actions">
					<a href="/conta" class="btn btn--block">Meus pedidos</a>
					<a href="/loja" class="btn btn--ghost btn--block">Continuar comprando</a>
				</div>
			</aside>
		</div>
	{/if}
</section>

<style>
	.page {
		padding-top: clamp(2.5rem, 5vw, 4rem);
	}

	.center {
		display: grid;
		justify-items: center;
		gap: 0.75rem;
		text-align: center;
		padding: 5rem 0;
	}

	.big {
		font-family: var(--serif);
		font-size: 34px;
	}

	.spinner {
		width: 28px;
		height: 28px;
		border: 1px solid var(--line-2);
		border-top-color: var(--ink);
		border-radius: 50%;
		animation: spin 0.9s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.hero {
		display: grid;
		justify-items: center;
		text-align: center;
		gap: 1.2rem;
		padding-bottom: clamp(3rem, 6vw, 4.5rem);
	}

	.mark {
		color: var(--ok);
	}

	.c {
		stroke-dasharray: 160;
		stroke-dashoffset: 160;
		animation: draw 1.1s var(--ease-out) 0.1s forwards;
	}

	.k {
		stroke-dasharray: 40;
		stroke-dashoffset: 40;
		animation: draw 0.7s var(--ease-out) 0.8s forwards;
	}

	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}

	.hero h1 {
		font-size: clamp(3rem, 7vw, 6.4rem);
	}

	.hero .line-mask > span {
		animation: rise 1.2s var(--ease-out) both;
	}

	.hero .line-mask:nth-child(2) > span {
		animation-delay: 0.1s;
	}

	@keyframes rise {
		from {
			transform: translate3d(0, 105%, 0);
		}
	}

	.hero .lead {
		max-width: 52ch;
	}

	.layout {
		display: grid;
		grid-template-columns: minmax(0, 1.5fr) minmax(300px, 1fr);
		gap: clamp(2rem, 5vw, 4rem);
		align-items: start;
	}

	@media (max-width: 900px) {
		.layout {
			grid-template-columns: 1fr;
		}
	}

	.main {
		display: grid;
		gap: 1.25rem;
	}

	.card {
		padding: clamp(1.25rem, 3vw, 2rem);
		background: var(--paper);
		border: 1px solid var(--line);
	}

	.card h2 {
		font-size: 26px;
		margin-bottom: 1.25rem;
	}

	.card h3 {
		font-size: 22px;
		margin-bottom: 0.6rem;
	}

	.card p {
		font-size: 14px;
		line-height: 1.7;
		color: var(--ink-2);
	}

	small {
		font-size: 12.5px;
		color: var(--ink-3);
	}

	.pay {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 2rem;
		align-items: start;
	}

	@media (max-width: 640px) {
		.pay {
			grid-template-columns: 1fr;
			justify-items: center;
		}
	}

	.qr {
		padding: 12px;
		background: #fff;
		border: 1px solid var(--line);
	}

	.pay-info {
		display: grid;
		gap: 0.75rem;
		min-width: 0;
		width: 100%;
	}

	.amount {
		font-family: var(--serif);
		font-size: 36px !important;
		line-height: 1 !important;
		color: var(--ink) !important;
	}

	.timer strong {
		font-variant-numeric: tabular-nums;
		color: var(--wine);
		font-weight: 500;
	}

	.how {
		list-style: decimal;
		padding-left: 1.2rem;
		font-size: 13.5px;
		color: var(--ink-2);
		display: grid;
		gap: 0.25rem;
	}

	.code {
		display: flex;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}

	.code input {
		flex: 1;
		min-width: 0;
		height: 42px;
		padding: 0 0.75rem;
		border: 1px solid var(--line-2);
		background: var(--ivory);
		font-size: 12.5px;
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		color: var(--ink-2);
		outline: none;
	}

	.sim {
		justify-self: start;
		margin-top: 0.5rem;
		font-size: 13px;
	}

	.boleto {
		display: grid;
		gap: 1.25rem;
	}

	.bars {
		width: 100%;
		height: 64px;
	}

	.ok {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.ok > :global(svg) {
		flex: none;
		width: 44px;
		height: 44px;
		padding: 10px;
		border-radius: 50%;
		background: var(--ok);
		color: var(--paper);
	}

	.ok-title {
		font-family: var(--serif);
		font-size: 24px !important;
		color: var(--ink) !important;
		line-height: 1.2 !important;
	}

	.timeline {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.5rem;
		position: relative;
	}

	.timeline li {
		position: relative;
		display: grid;
		gap: 0.6rem;
		font-size: 12.5px;
		color: var(--ink-3);
		animation: tl 0.6s var(--ease-out) both;
		animation-delay: calc(400ms + var(--i) * 120ms);
	}

	.timeline li::before {
		content: '';
		position: absolute;
		top: 10px;
		left: 22px;
		right: -0.5rem;
		height: 1px;
		background: var(--line-2);
	}

	.timeline li:last-child::before {
		display: none;
	}

	.timeline li.done {
		color: var(--ink);
	}

	.timeline li.done::before {
		background: var(--ink);
	}

	.tl-dot {
		position: relative;
		width: 21px;
		height: 21px;
		border-radius: 50%;
		border: 1px solid var(--line-2);
		background: var(--paper);
		display: grid;
		place-items: center;
	}

	.done .tl-dot {
		background: var(--ink);
		border-color: var(--ink);
		color: var(--paper);
	}

	@keyframes tl {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
	}

	@media (max-width: 560px) {
		.timeline {
			grid-template-columns: 1fr;
		}

		.timeline li {
			grid-template-columns: auto 1fr;
			align-items: center;
		}

		.timeline li::before {
			display: none;
		}
	}

	.two {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
	}

	@media (max-width: 640px) {
		.two {
			grid-template-columns: 1fr;
		}
	}

	.summary {
		position: sticky;
		top: calc(var(--header-h) + 1.5rem);
		padding: clamp(1.25rem, 3vw, 2rem);
		background: var(--paper);
		border: 1px solid var(--line);
		display: grid;
		gap: 1.25rem;
	}

	.summary h2 {
		font-size: 26px;
	}

	.items {
		display: grid;
		gap: 1rem;
	}

	.items li {
		display: grid;
		grid-template-columns: 56px 1fr auto;
		gap: 0.9rem;
		align-items: center;
		font-size: 13.5px;
	}

	.i-meta {
		display: grid;
		min-width: 0;
	}

	.i-name {
		font-family: var(--serif);
		font-size: 16px;
		line-height: 1.2;
	}

	dl {
		margin: 0;
		display: grid;
		gap: 0.6rem;
		font-size: 14px;
		padding-top: 1rem;
		border-top: 1px solid var(--line);
	}

	dl div {
		display: flex;
		justify-content: space-between;
	}

	dd {
		margin: 0;
	}

	.green {
		color: var(--ok);
	}

	.total {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		padding-top: 1rem;
		border-top: 1px solid var(--line);
		font-size: 12px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}

	.total strong {
		font-family: var(--serif);
		font-size: 30px;
		font-weight: 500;
		letter-spacing: 0;
	}

	.actions {
		display: grid;
		gap: 0.5rem;
	}
</style>
