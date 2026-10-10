<script lang="ts">
	import { goto } from '$app/navigation';
	import { fade, fly, slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { getProduct } from '$lib/data/products';
	import { PIX_DISCOUNT } from '$lib/data/store';
	import { auth, type Address } from '$lib/stores/auth.svelte';
	import { cart } from '$lib/stores/cart.svelte';
	import { orders, type PaymentMethod } from '$lib/stores/orders.svelte';
	import { addBusinessDays, dateLong, installments, money } from '$lib/utils/format';
	import {
		cardBrand,
		digits,
		isValidExpiry,
		maskCard,
		maskCVV,
		maskExpiry
	} from '$lib/utils/masks';
	import { quoteShipping } from '$lib/utils/shipping';
	import { emptyAddress, focusFirstError, validateAddress } from '$lib/utils/validate';
	import AddressFields from '$lib/components/AddressFields.svelte';
	import CardPreview from '$lib/components/CardPreview.svelte';
	import CouponForm from '$lib/components/CouponForm.svelte';
	import Field from '$lib/components/Field.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import PhotoPlaceholder from '$lib/components/PhotoPlaceholder.svelte';

	type Step = 1 | 2 | 3;
	const STEPS = ['Entrega', 'Pagamento', 'Revisão'];
	const METHODS: { id: PaymentMethod; label: string; sub: string }[] = [
		{ id: 'pix', label: 'Pix', sub: '5% de desconto · aprovação na hora' },
		{ id: 'card', label: 'Cartão de crédito', sub: 'Em até 6x sem juros' },
		{ id: 'boleto', label: 'Boleto bancário', sub: 'Vence em 3 dias úteis' }
	];

	let step = $state<Step>(1);
	let maxStep = $state<Step>(1);
	let address = $state<Address>(emptyAddress());
	let recipient = $state('');
	let editing = $state(false);
	let saveDefault = $state(false);
	let addressTouched = $state(false);
	let shippingId = $state('');
	let method = $state<PaymentMethod>('pix');
	let card = $state({ number: '', name: '', expiry: '', cvv: '' });
	let cardTouched = $state(false);
	let cvvFocus = $state(false);
	let parcelas = $state(1);
	let terms = $state(false);
	let termsError = $state(false);
	let processing = $state(false);
	let procText = $state('');
	let placed = false;
	let initialized = false;
	let summaryOpen = $state(false);
	let root: HTMLElement;

	// redireciona quem não está logado
	$effect(() => {
		if (auth.ready && !auth.user && !placed) goto('/entrar?voltar=/checkout', { replaceState: true });
	});

	// preenche com os dados da conta uma única vez
	$effect(() => {
		if (initialized || !auth.user) return;
		initialized = true;
		address = { ...auth.user.address };
		recipient = auth.user.name;
		if (Object.keys(validateAddress(address)).length) editing = true;
	});

	const addressErrors = $derived(validateAddress(address));
	const addressOk = $derived(!Object.keys(addressErrors).length && recipient.trim().length > 2);
	const afterCoupon = $derived(cart.subtotal - cart.couponDiscount);
	const options = $derived(addressOk ? quoteShipping(address.cep, afterCoupon) : []);
	const shipping = $derived(options.find((o) => o.id === shippingId));

	$effect(() => {
		if (options.length && !options.some((o) => o.id === shippingId)) {
			shippingId = (options.find((o) => o.id === 'motoboy') ?? options.find((o) => o.id === 'pac') ?? options[0]).id;
		}
	});

	const pixDiscount = $derived(method === 'pix' ? afterCoupon * PIX_DISCOUNT : 0);
	const total = $derived(afterCoupon - pixDiscount + (shipping?.price ?? 0));
	const maxParcelas = $derived(installments(total).n);
	const brand = $derived(cardBrand(card.number));

	$effect(() => {
		if (parcelas > maxParcelas) parcelas = maxParcelas;
	});

	const cardErrors = $derived.by(() => {
		const e: Record<string, string> = {};
		const len = digits(card.number).length;
		if (len < 15) e.number = 'Número do cartão incompleto.';
		if (card.name.trim().length < 4) e.name = 'Digite o nome como está no cartão.';
		if (!isValidExpiry(card.expiry)) e.expiry = 'Validade inválida.';
		if (card.cvv.length < 3) e.cvv = 'CVV inválido.';
		return e;
	});
	const cErr = (k: string) => (cardTouched ? cardErrors[k] : '');

	const eta = $derived(shipping ? dateLong(addBusinessDays(Date.now(), shipping.days)) : '');

	function go(to: Step) {
		if (to > maxStep) return;
		step = to;
		scrollTo({ top: 0, behavior: 'smooth' });
	}

	function confirmAddress() {
		addressTouched = true;
		if (!addressOk) {
			focusFirstError(root);
			return;
		}
		editing = false;
	}

	function toPayment() {
		if (editing) return confirmAddress();
		if (!shipping) return;
		maxStep = Math.max(maxStep, 2) as Step;
		go(2);
	}

	function toReview() {
		if (method === 'card') {
			cardTouched = true;
			if (Object.keys(cardErrors).length) {
				focusFirstError(root);
				return;
			}
		}
		maxStep = 3;
		go(3);
	}

	async function placeOrder() {
		if (!terms) {
			termsError = true;
			return;
		}
		if (!auth.user || !shipping) return;
		processing = true;
		procText = method === 'card' ? 'Autorizando pagamento' : 'Registrando seu pedido';
		await new Promise((r) => setTimeout(r, 1300));
		procText = method === 'card' ? 'Pagamento aprovado' : method === 'pix' ? 'Gerando QR Code Pix' : 'Gerando boleto';
		await new Promise((r) => setTimeout(r, 900));

		const order = orders.create({
			email: auth.user.email,
			lines: cart.lines.map((l) => {
				const p = getProduct(l.id)!;
				const c = p.colors.find((x) => x.name === l.color) ?? p.colors[0];
				return { id: p.id, name: p.name, slug: p.slug, price: p.price, size: l.size, color: l.color, tone: c.hex, qty: l.qty };
			}),
			subtotal: cart.subtotal,
			couponDiscount: cart.couponDiscount,
			pixDiscount,
			shipping: shipping.price,
			total,
			coupon: cart.coupon,
			delivery: { id: shipping.id, label: shipping.label, detail: shipping.detail, days: shipping.days },
			address: { ...address },
			recipient: recipient.trim(),
			payment:
				method === 'card'
					? { method, installments: parcelas, brand: brand || 'Cartão', last4: digits(card.number).slice(-4) }
					: { method },
			status: method === 'card' ? 'aprovado' : 'aguardando'
		});

		if (saveDefault) auth.update({ address: { ...address } });
		placed = true;
		cart.clear();
		goto(`/pedido-confirmado?pedido=${order.id}`, { replaceState: true });
	}

	function payLabel() {
		if (method === 'pix') return 'Pix · QR Code gerado após a confirmação';
		if (method === 'boleto') return 'Boleto bancário · vence em 3 dias úteis';
		return `${brand || 'Cartão'} final ${digits(card.number).slice(-4)} · ${parcelas}x de ${money(total / parcelas)}`;
	}
</script>

<svelte:head>
	<title>Checkout — Chica Maria</title>
</svelte:head>

<div class="container checkout" bind:this={root}>
	{#if !auth.ready || !auth.user}
		<div class="loading"><span class="spinner"></span></div>
	{:else if !cart.lines.length}
		<div class="empty">
			<p class="empty-title">Sua sacola está vazia.</p>
			<p class="muted">Adicione algumas peças para finalizar a compra.</p>
			<a href="/loja" class="btn">Ir para a loja</a>
		</div>
	{:else}
		<ol class="steps" aria-label="Etapas">
			{#each STEPS as label, i (label)}
				{@const n = (i + 1) as Step}
				<li class:current={step === n} class:done={n < step}>
					<button onclick={() => go(n)} disabled={n > maxStep} aria-current={step === n ? 'step' : undefined}>
						<span class="n">{#if n < step}<Icon name="check" size={12} />{:else}{n}{/if}</span>
						{label}
					</button>
				</li>
			{/each}
		</ol>

		<div class="layout">
			<div class="main">
				{#key step}
					<div in:fly={{ y: 18, duration: 550, easing: quintOut }}>
						{#if step === 1}
							<section class="card">
								<div class="card-head">
									<h2>Endereço de entrega</h2>
									{#if !editing}<button class="text-link" onclick={() => (editing = true)}>Alterar</button>{/if}
								</div>
								{#if editing}
									<div class="edit" transition:slide={{ duration: 400 }}>
										<Field label="Nome de quem vai receber" bind:value={recipient} autocomplete="name" required />
										<AddressFields bind:address errors={addressTouched ? addressErrors : {}} />
										<label class="check">
											<input type="checkbox" bind:checked={saveDefault} />
											Salvar como meu endereço principal
										</label>
										<button class="btn btn--ghost btn--sm" onclick={confirmAddress}>Usar este endereço</button>
									</div>
								{:else}
									<address>
										<strong>{recipient}</strong>
										{address.street}, {address.number}{address.complement ? ` · ${address.complement}` : ''}<br />
										{address.district} · {address.city}, {address.state}<br />
										CEP {address.cep}
									</address>
								{/if}
							</section>

							<section class="card">
								<h2>Forma de entrega</h2>
								{#if options.length}
									<div class="radios">
										{#each options as o (o.id)}
											<label class="radio" class:on={shippingId === o.id}>
												<input type="radio" name="shipping" value={o.id} bind:group={shippingId} />
												<span class="dot"></span>
												<span class="r-main">
													<strong>{o.label}</strong>
													<small>{o.detail}</small>
												</span>
												<span class="r-price" class:free={o.price === 0}>{o.price === 0 ? 'Grátis' : money(o.price)}</span>
											</label>
										{/each}
									</div>
								{:else}
									<p class="muted">Confirme o endereço para ver as opções de entrega.</p>
								{/if}
							</section>

							<button class="btn btn--block" onclick={toPayment} disabled={!editing && !shipping}>
								Continuar para o pagamento
							</button>
						{:else if step === 2}
							<section class="card">
								<h2>Pagamento</h2>
								<div class="methods" role="radiogroup" aria-label="Forma de pagamento">
									{#each METHODS as m (m.id)}
										<label class="method" class:on={method === m.id}>
											<input type="radio" name="method" value={m.id} bind:group={method} />
											<span class="dot"></span>
											<span class="m-main">
												<strong>{m.label}</strong>
												<small>{m.sub}</small>
											</span>
											{#if m.id === 'pix'}<span class="tag">−5%</span>{/if}
										</label>
									{/each}
								</div>

								{#key method}
									<div class="pane" in:fade={{ duration: 350 }}>
										{#if method === 'pix'}
											<p>
												O QR Code e o código copia e cola aparecem logo depois que você finalizar. O pagamento é confirmado
												na hora e o pedido segue para separação.
											</p>
											<p class="save">Você economiza <strong>{money(pixDiscount)}</strong> pagando no Pix.</p>
										{:else if method === 'card'}
											<div class="card-form">
												<CardPreview number={card.number} name={card.name} expiry={card.expiry} {brand} flipped={cvvFocus} />
												<div class="card-fields">
													<Field
														label="Número do cartão"
														bind:value={card.number}
														mask={maskCard}
														inputmode="numeric"
														autocomplete="cc-number"
														placeholder="0000 0000 0000 0000"
														error={cErr('number')}
														hint={brand}
													/>
													<Field
														label="Nome impresso no cartão"
														bind:value={card.name}
														mask={(v) => v.toUpperCase().replace(/[^A-ZÀ-Ú\s]/g, '')}
														autocomplete="cc-name"
														error={cErr('name')}
													/>
													<div class="two">
														<Field
															label="Validade"
															bind:value={card.expiry}
															mask={maskExpiry}
															inputmode="numeric"
															autocomplete="cc-exp"
															placeholder="MM/AA"
															error={cErr('expiry')}
														/>
														<Field
															label="CVV"
															bind:value={card.cvv}
															mask={maskCVV}
															inputmode="numeric"
															autocomplete="cc-csc"
															placeholder="000"
															error={cErr('cvv')}
															onfocus={() => (cvvFocus = true)}
															onblur={() => (cvvFocus = false)}
														/>
													</div>
													<div class="select">
														<label for="parcelas">Parcelas</label>
														<select id="parcelas" class="input" bind:value={parcelas}>
															{#each Array.from({ length: maxParcelas }, (_, i) => i + 1) as n (n)}
																<option value={n}>{n}x de {money(total / n)} sem juros</option>
															{/each}
														</select>
													</div>
												</div>
											</div>
										{:else}
											<p>
												O boleto é gerado depois que você finalizar e vence em 3 dias úteis. O pedido é liberado após a
												compensação, que pode levar até 2 dias úteis.
											</p>
										{/if}
									</div>
								{/key}
							</section>

							<div class="nav">
								<button class="btn btn--ghost" onclick={() => go(1)}>Voltar</button>
								<button class="btn" onclick={toReview}>Revisar pedido</button>
							</div>
						{:else}
							<section class="card review">
								<div class="card-head">
									<h2>Entrega</h2>
									<button class="text-link" onclick={() => go(1)}>Editar</button>
								</div>
								<p>
									<strong>{recipient}</strong><br />
									{address.street}, {address.number}{address.complement ? ` · ${address.complement}` : ''}, {address.district}<br />
									{address.city}, {address.state} · CEP {address.cep}
								</p>
								{#if shipping}
									<p class="eta">
										<Icon name={shipping.id === 'retirada' ? 'store' : 'truck'} size={18} />
										<span>
											{shipping.label} · {shipping.price === 0 ? 'grátis' : money(shipping.price)}<br />
											<small>Previsão: {shipping.id === 'retirada' ? 'pronto para retirada em' : 'até'} {eta}</small>
										</span>
									</p>
								{/if}
							</section>

							<section class="card review">
								<div class="card-head">
									<h2>Pagamento</h2>
									<button class="text-link" onclick={() => go(2)}>Editar</button>
								</div>
								<p>{payLabel()}</p>
							</section>

							<section class="card review">
								<h2>Itens</h2>
								<ul class="review-items">
									{#each cart.lines as l (l.key)}
										{@const p = getProduct(l.id)!}
										<li>
											<span>{l.qty}× {p.name} <small>{l.color} · {l.size}</small></span>
											<span>{money(p.price * l.qty)}</span>
										</li>
									{/each}
								</ul>
							</section>

							<label class="check terms" class:invalid={termsError && !terms}>
								<input type="checkbox" bind:checked={terms} onchange={() => (termsError = false)} />
								<span>
									Li e concordo com as <a href="/ajuda#trocas" class="text-link">condições de compra e a política de trocas</a>.
								</span>
							</label>
							{#if termsError && !terms}<p class="err" transition:fade>Aceite as condições para finalizar.</p>{/if}

							<div class="nav">
								<button class="btn btn--ghost" onclick={() => go(2)}>Voltar</button>
								<button class="btn" onclick={placeOrder}>Finalizar pedido · {money(total)}</button>
							</div>
						{/if}
					</div>
				{/key}
			</div>

			<aside class="summary">
				<button class="summary-toggle" onclick={() => (summaryOpen = !summaryOpen)} aria-expanded={summaryOpen}>
					<span>{summaryOpen ? 'Ocultar' : 'Ver'} resumo ({cart.count} {cart.count === 1 ? 'item' : 'itens'})</span>
					<strong>{money(total)}</strong>
				</button>
				<div class="summary-body" class:open={summaryOpen}>
					<h2>Resumo do pedido</h2>
					<ul class="items">
						{#each cart.lines as l (l.key)}
							{@const p = getProduct(l.id)!}
							{@const c = p.colors.find((x) => x.name === l.color) ?? p.colors[0]}
							<li>
								<span class="thumb">
									<PhotoPlaceholder tone={c.hex} />
									<span class="q">{l.qty}</span>
								</span>
								<span class="i-meta">
									<span class="i-name">{p.name}</span>
									<small>{l.color} · {l.size}</small>
								</span>
								<span class="i-price">{money(p.price * l.qty)}</span>
							</li>
						{/each}
					</ul>
					<div class="coupon"><CouponForm /></div>
					<dl>
						<div><dt>Subtotal</dt><dd>{money(cart.subtotal)}</dd></div>
						{#if cart.couponDiscount}<div class="green"><dt>Cupom</dt><dd>−{money(cart.couponDiscount)}</dd></div>{/if}
						<div>
							<dt>Frete</dt>
							<dd>{shipping ? (shipping.price === 0 ? 'Grátis' : money(shipping.price)) : '—'}</dd>
						</div>
						{#if pixDiscount}<div class="green"><dt>Desconto Pix</dt><dd>−{money(pixDiscount)}</dd></div>{/if}
					</dl>
					<div class="total">
						<span>Total</span>
						<strong>{money(total)}</strong>
					</div>
					{#if method === 'card' && step >= 2}
						<p class="inst">em {parcelas}x de {money(total / parcelas)} sem juros</p>
					{/if}
				</div>
				<p class="secure"><Icon name="lock" size={14} /> Ambiente seguro. Seus dados são criptografados.</p>
			</aside>
		</div>
	{/if}
</div>

{#if processing}
	<div class="processing" transition:fade={{ duration: 300 }} role="alert" aria-live="assertive">
		<svg viewBox="0 0 50 50" width="64" height="64" aria-hidden="true">
			<circle cx="25" cy="25" r="22" fill="none" stroke="var(--line)" stroke-width="1" />
			<circle class="arc" cx="25" cy="25" r="22" fill="none" stroke="var(--ink)" stroke-width="1.2" />
		</svg>
		{#key procText}
			<p in:fly={{ y: 10, duration: 400 }}>{procText}</p>
		{/key}
		<small>Não feche esta página.</small>
	</div>
{/if}

<style>
	.checkout {
		padding-top: clamp(1.5rem, 3vw, 2.5rem);
		min-height: 70vh;
	}

	.loading {
		display: grid;
		place-items: center;
		min-height: 50vh;
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

	.steps {
		display: flex;
		gap: clamp(1rem, 4vw, 3rem);
		padding-bottom: 1.5rem;
		margin-bottom: 2.5rem;
		border-bottom: 1px solid var(--line);
		overflow-x: auto;
	}

	.steps button {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		font-size: 11.5px;
		font-weight: 500;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ink-3);
		white-space: nowrap;
		transition: color 0.3s;
	}

	.steps button:disabled {
		cursor: default;
	}

	.steps .current button,
	.steps .done button {
		color: var(--ink);
	}

	.n {
		width: 24px;
		height: 24px;
		display: grid;
		place-items: center;
		border: 1px solid currentColor;
		border-radius: 50%;
		font-size: 11px;
		letter-spacing: 0;
		transition:
			background 0.3s,
			color 0.3s;
	}

	.current .n,
	.done .n {
		background: var(--ink);
		color: var(--paper);
		border-color: var(--ink);
	}

	.layout {
		display: grid;
		grid-template-columns: minmax(0, 1.5fr) minmax(320px, 1fr);
		gap: clamp(2rem, 5vw, 5rem);
		align-items: start;
	}

	@media (max-width: 900px) {
		.layout {
			grid-template-columns: 1fr;
		}

		.summary {
			order: -1;
		}
	}

	.main > div {
		display: grid;
		gap: 1.25rem;
	}

	.card {
		padding: clamp(1.25rem, 3vw, 2rem);
		background: var(--paper);
		border: 1px solid var(--line);
		display: grid;
		gap: 1.25rem;
	}

	.card h2 {
		font-size: 26px;
	}

	.card-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 1rem;
	}

	.card-head .text-link {
		font-size: 13px;
	}

	.edit {
		display: grid;
		gap: 1.5rem;
		justify-items: start;
	}

	.edit > :global(*) {
		width: 100%;
	}

	.edit > .btn {
		width: auto;
	}

	address {
		font-style: normal;
		font-size: 14.5px;
		line-height: 1.7;
		color: var(--ink-2);
	}

	address strong {
		display: block;
		font-weight: 500;
		color: var(--ink);
	}

	.radios,
	.methods {
		display: grid;
		gap: 0.5rem;
	}

	.radio,
	.method {
		position: relative;
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 1rem;
		padding: 1rem 1.1rem;
		border: 1px solid var(--line-2);
		cursor: pointer;
		transition:
			border-color 0.25s,
			background 0.25s;
	}

	.radio:hover,
	.method:hover {
		border-color: var(--ink-3);
	}

	.radio.on,
	.method.on {
		border-color: var(--ink);
		background: var(--ivory);
	}

	.radio input,
	.method input {
		position: absolute;
		opacity: 0;
		pointer-events: none;
	}

	.radio:has(input:focus-visible),
	.method:has(input:focus-visible) {
		outline: 1px solid var(--ink);
		outline-offset: 2px;
	}

	.dot {
		width: 18px;
		height: 18px;
		border: 1px solid var(--line-2);
		border-radius: 50%;
		display: grid;
		place-items: center;
	}

	.dot::after {
		content: '';
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--ink);
		transform: scale(0);
		transition: transform 0.3s var(--ease-out);
	}

	.on .dot {
		border-color: var(--ink);
	}

	.on .dot::after {
		transform: scale(1);
	}

	.r-main,
	.m-main {
		display: grid;
		gap: 0.1rem;
		font-size: 14px;
	}

	.r-main strong,
	.m-main strong {
		font-weight: 500;
	}

	small {
		font-size: 12.5px;
		color: var(--ink-3);
	}

	.r-price {
		font-size: 14px;
		white-space: nowrap;
	}

	.r-price.free {
		color: var(--ok);
	}

	.tag {
		padding: 4px 8px;
		background: var(--ok);
		color: var(--paper);
		font-size: 11px;
		letter-spacing: 0.08em;
	}

	.pane {
		font-size: 14px;
		color: var(--ink-2);
		display: grid;
		gap: 0.75rem;
	}

	.save strong {
		font-weight: 500;
		color: var(--ok);
	}

	.card-form {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 2rem;
		align-items: start;
		padding-top: 0.5rem;
	}

	@media (max-width: 1100px) {
		.card-form {
			grid-template-columns: 1fr;
		}
	}

	.card-fields {
		display: grid;
		gap: 1.25rem;
	}

	.two {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.25rem;
	}

	.select {
		display: grid;
		gap: 0.2rem;
	}

	.select label {
		font-size: 10.5px;
		font-weight: 500;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ink-2);
	}

	.nav {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.5rem;
	}

	.review p {
		font-size: 14.5px;
		line-height: 1.7;
		color: var(--ink-2);
	}

	.review strong {
		font-weight: 500;
		color: var(--ink);
	}

	.eta {
		display: flex;
		gap: 0.75rem;
		align-items: flex-start;
		padding-top: 1rem;
		border-top: 1px solid var(--line);
	}

	.eta :global(svg) {
		flex: none;
		margin-top: 4px;
	}

	.review-items {
		display: grid;
		gap: 0.6rem;
		font-size: 14px;
	}

	.review-items li {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
	}

	.review-items small {
		display: block;
	}

	.terms {
		margin-top: 0.5rem;
	}

	.terms.invalid input {
		border-color: var(--danger);
	}

	.err {
		font-size: 12.5px;
		color: var(--danger);
		margin-top: -0.5rem;
	}

	/* Resumo */
	.summary {
		position: sticky;
		top: calc(var(--header-h) + 1.5rem);
	}

	.summary-toggle {
		display: none;
	}

	.summary-body {
		padding: clamp(1.25rem, 3vw, 2rem);
		background: var(--paper);
		border: 1px solid var(--line);
		display: grid;
		gap: 1.25rem;
	}

	.summary-body h2 {
		font-size: 26px;
	}

	.items {
		display: grid;
		gap: 1rem;
		max-height: 320px;
		overflow-y: auto;
	}

	.items li {
		display: grid;
		grid-template-columns: 56px 1fr auto;
		gap: 0.9rem;
		align-items: center;
	}

	.thumb {
		position: relative;
		display: block;
	}

	.q {
		position: absolute;
		top: -6px;
		right: -6px;
		min-width: 20px;
		height: 20px;
		padding: 0 5px;
		border-radius: 10px;
		background: var(--ink);
		color: var(--paper);
		font-size: 11px;
		display: grid;
		place-items: center;
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

	.i-price {
		font-size: 13.5px;
		white-space: nowrap;
	}

	.coupon {
		padding: 1rem 0;
		border-block: 1px solid var(--line);
	}

	dl {
		margin: 0;
		display: grid;
		gap: 0.6rem;
		font-size: 14px;
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
		font-size: 32px;
		font-weight: 500;
		letter-spacing: 0;
	}

	.inst {
		text-align: right;
		font-size: 13px;
		color: var(--ink-2);
		margin-top: -0.75rem;
	}

	.secure {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin-top: 1rem;
		font-size: 12px;
		color: var(--ink-3);
	}

	@media (max-width: 900px) {
		.summary {
			position: static;
		}

		.summary-toggle {
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			padding: 1rem 1.1rem;
			background: var(--paper);
			border: 1px solid var(--line);
			font-size: 12px;
			letter-spacing: 0.12em;
			text-transform: uppercase;
		}

		.summary-toggle strong {
			font-family: var(--serif);
			font-size: 22px;
			font-weight: 500;
			letter-spacing: 0;
			text-transform: none;
		}

		.summary-body {
			display: none;
			border-top: 0;
		}

		.summary-body.open {
			display: grid;
		}

		.secure {
			display: none;
		}
	}

	.empty {
		display: grid;
		justify-items: center;
		gap: 0.75rem;
		text-align: center;
		padding: 5rem 0;
	}

	.empty-title {
		font-family: var(--serif);
		font-size: 34px;
	}

	.empty .btn {
		margin-top: 1rem;
	}

	/* Processando */
	.processing {
		position: fixed;
		inset: 0;
		z-index: 200;
		display: grid;
		place-content: center;
		justify-items: center;
		gap: 1.25rem;
		background: rgb(244 239 231 / 0.96);
		text-align: center;
	}

	.processing p {
		font-family: var(--serif);
		font-size: 30px;
	}

	.arc {
		stroke-dasharray: 138;
		stroke-dashoffset: 100;
		transform-origin: center;
		animation:
			spin 1.4s linear infinite,
			dash 1.4s var(--ease-io) infinite alternate;
	}

	@keyframes dash {
		to {
			stroke-dashoffset: 30;
		}
	}
</style>
