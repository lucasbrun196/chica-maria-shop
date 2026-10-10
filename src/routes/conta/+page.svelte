<script lang="ts">
	import { goto } from '$app/navigation';
	import { fly, slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { auth, type Address } from '$lib/stores/auth.svelte';
	import { orders, type Order, type OrderStatus } from '$lib/stores/orders.svelte';
	import { ui } from '$lib/stores/ui.svelte';
	import { wishlist } from '$lib/stores/wishlist.svelte';
	import { dateLong, dateMonthYear, dateShort, money } from '$lib/utils/format';
	import { maskDate, maskPhone } from '$lib/utils/masks';
	import { emptyAddress, focusFirstError, validateAddress, validatePassword, validatePersonal } from '$lib/utils/validate';
	import AddressFields from '$lib/components/AddressFields.svelte';
	import Field from '$lib/components/Field.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import PhotoPlaceholder from '$lib/components/PhotoPlaceholder.svelte';

	type Tab = 'pedidos' | 'dados' | 'endereco' | 'senha';
	const TABS: { id: Tab; label: string; icon: 'box' | 'user' | 'pin' | 'lock' }[] = [
		{ id: 'pedidos', label: 'Meus pedidos', icon: 'box' },
		{ id: 'dados', label: 'Dados pessoais', icon: 'user' },
		{ id: 'endereco', label: 'Endereço', icon: 'pin' },
		{ id: 'senha', label: 'Senha', icon: 'lock' }
	];
	const STATUS: Record<OrderStatus, string> = {
		aguardando: 'Aguardando pagamento',
		aprovado: 'Pagamento aprovado',
		separacao: 'Em separação',
		enviado: 'Enviado',
		entregue: 'Entregue'
	};

	let tab = $state<Tab>('pedidos');
	let expanded = $state<string | null>(null);
	let root: HTMLElement;

	let profile = $state({ name: '', phone: '', birth: '', newsletter: false });
	let address = $state<Address>(emptyAddress());
	let profileTouched = $state(false);
	let addressTouched = $state(false);
	let pass = $state({ current: '', next: '', confirm: '' });
	let passTouched = $state(false);
	let passError = $state('');
	let saving = $state(false);
	let leaving = false;

	$effect(() => {
		if (auth.ready && !auth.user && !leaving) goto('/entrar?voltar=/conta', { replaceState: true });
	});

	function resetForms() {
		if (!auth.user) return;
		profile = { name: auth.user.name, phone: auth.user.phone, birth: auth.user.birth, newsletter: auth.user.newsletter };
		address = { ...auth.user.address };
		profileTouched = addressTouched = passTouched = false;
		pass = { current: '', next: '', confirm: '' };
		passError = '';
	}

	// carrega os formulários quando a sessão fica pronta
	let loadedFor = '';
	$effect(() => {
		if (auth.user && loadedFor !== auth.user.email) {
			loadedFor = auth.user.email;
			resetForms();
		}
	});

	const myOrders = $derived(auth.user ? orders.forUser(auth.user.email) : []);
	const profileErrors = $derived(
		validatePersonal({ ...profile, email: auth.user?.email ?? '', cpf: auth.user?.cpf ?? '' }, false)
	);
	const addressErrors = $derived(validateAddress(address));
	const passErrors = $derived(validatePassword(pass.next, pass.confirm));

	function select(t: Tab) {
		tab = t;
		resetForms();
	}

	async function fakeSave() {
		saving = true;
		await new Promise((r) => setTimeout(r, 500));
		saving = false;
	}

	async function saveProfile(e: SubmitEvent) {
		e.preventDefault();
		profileTouched = true;
		if (Object.keys(profileErrors).length) return focusFirstError(root);
		await fakeSave();
		auth.update({ ...profile, name: profile.name.trim() });
		ui.toast('Dados atualizados');
	}

	async function saveAddress(e: SubmitEvent) {
		e.preventDefault();
		addressTouched = true;
		if (Object.keys(addressErrors).length) return focusFirstError(root);
		await fakeSave();
		auth.update({ address: { ...address } });
		ui.toast('Endereço salvo');
	}

	async function savePassword(e: SubmitEvent) {
		e.preventDefault();
		passTouched = true;
		passError = '';
		if (!pass.current || Object.keys(passErrors).length) return focusFirstError(root);
		saving = true;
		const res = await auth.changePassword(pass.current, pass.next);
		saving = false;
		if (!res.ok) {
			passError = res.error;
			return;
		}
		pass = { current: '', next: '', confirm: '' };
		passTouched = false;
		ui.toast('Senha alterada');
	}

	function logout() {
		leaving = true;
		auth.logout();
		ui.toast('Você saiu da sua conta');
		goto('/');
	}

	function progress(o: Order) {
		const order: OrderStatus[] = ['aguardando', 'aprovado', 'separacao', 'enviado', 'entregue'];
		return order.indexOf(o.status);
	}

	function payText(o: Order) {
		if (o.payment.method === 'card') return `${o.payment.brand} final ${o.payment.last4} · ${o.payment.installments}x`;
		return o.payment.method === 'pix' ? 'Pix' : 'Boleto';
	}
</script>

<svelte:head>
	<title>Minha conta — Chica Maria</title>
</svelte:head>

<div class="container page" bind:this={root}>
	{#if !auth.ready || !auth.user}
		<div class="center"><span class="spinner"></span></div>
	{:else}
		<header class="head">
			<div>
				<p class="eyebrow">Minha conta</p>
				<h1 class="display">Olá, <em>{auth.firstName}</em></h1>
				<p class="muted">Cliente desde {dateMonthYear(auth.user.createdAt)}</p>
			</div>
			<button class="link logout" onclick={logout}><Icon name="logout" size={15} /> Sair</button>
		</header>

		<div class="layout">
			<nav class="side" aria-label="Seções da conta">
				{#each TABS as t (t.id)}
					<button class:on={tab === t.id} onclick={() => select(t.id)} aria-current={tab === t.id ? 'page' : undefined}>
						<Icon name={t.icon} size={18} />
						{t.label}
						{#if t.id === 'pedidos' && myOrders.length}<span class="n">{myOrders.length}</span>{/if}
					</button>
				{/each}
				<a href="/favoritos">
					<Icon name="heart" size={18} />
					Favoritos
					{#if wishlist.count}<span class="n">{wishlist.count}</span>{/if}
				</a>
			</nav>

			<div class="content">
				{#key tab}
					<div in:fly={{ y: 16, duration: 500, easing: quintOut }}>
						{#if tab === 'pedidos'}
							<h2>Meus pedidos</h2>
							{#if myOrders.length}
								<ul class="orders">
									{#each myOrders as o (o.id)}
										{@const open = expanded === o.id}
										{@const n = o.lines.reduce((s, l) => s + l.qty, 0)}
										<li class="order" class:open>
											<button class="o-head" onclick={() => (expanded = open ? null : o.id)} aria-expanded={open}>
												<span class="o-id">
													<strong>{o.id}</strong>
													<small>{dateShort(o.createdAt)} · {n} {n === 1 ? 'item' : 'itens'}</small>
												</span>
												<span class="status" data-s={o.status}>{STATUS[o.status]}</span>
												<span class="o-total">{money(o.total)}</span>
												<Icon name="chevron-down" size={16} class="chev" />
											</button>
											{#if open}
												<div class="o-body" transition:slide={{ duration: 400, easing: quintOut }}>
													<ol class="track">
														{#each ['Recebido', 'Pago', 'Separação', o.delivery.id === 'retirada' ? 'Pronto' : 'Enviado', 'Entregue'] as label, i (label)}
															<li class:done={i <= progress(o)}><span></span>{label}</li>
														{/each}
													</ol>
													<ul class="o-lines">
														{#each o.lines as l (l.id + l.size + l.color)}
															<li>
																<a href="/produto/{l.slug}" class="thumb"><PhotoPlaceholder tone={l.tone} /></a>
																<span>
																	<a href="/produto/{l.slug}" class="l-name">{l.name}</a>
																	<small>{l.color} · {l.size} · {l.qty}×</small>
																</span>
																<span>{money(l.price * l.qty)}</span>
															</li>
														{/each}
													</ul>
													<div class="o-meta">
														<p><small>Entrega</small>{o.delivery.label} · {o.address.city}, {o.address.state}</p>
														<p><small>Pagamento</small>{payText(o)}</p>
														<p><small>Data</small>{dateLong(o.createdAt)}</p>
													</div>
													<div class="o-actions">
														<a href="/pedido-confirmado?pedido={o.id}" class="btn btn--sm">Ver detalhes</a>
														<a href="/ajuda#trocas" class="btn btn--ghost btn--sm">Solicitar troca</a>
													</div>
												</div>
											{/if}
										</li>
									{/each}
								</ul>
							{:else}
								<div class="empty">
									<Icon name="box" size={36} stroke={0.8} />
									<p class="e-title">Você ainda não fez pedidos.</p>
									<p class="muted">Quando fizer, eles aparecem aqui com o status da entrega.</p>
									<a href="/loja/novidades" class="btn">Ver novidades</a>
								</div>
							{/if}
						{:else if tab === 'dados'}
							<h2>Dados pessoais</h2>
							<form class="form" onsubmit={saveProfile} novalidate>
								<div class="grid">
									<Field label="Nome completo" bind:value={profile.name} span={6} error={profileTouched ? profileErrors.name : ''} />
									<Field label="E-mail" value={auth.user.email} span={3} readonly hint="Para alterar o e-mail, fale com a gente." />
									<Field label="CPF" value={auth.user.cpf} span={3} readonly />
									<Field
										label="Data de nascimento"
										bind:value={profile.birth}
										mask={maskDate}
										inputmode="numeric"
										span={3}
										error={profileTouched ? profileErrors.birth : ''}
									/>
									<Field
										label="Celular / WhatsApp"
										bind:value={profile.phone}
										mask={maskPhone}
										inputmode="tel"
										span={3}
										error={profileTouched ? profileErrors.phone : ''}
									/>
								</div>
								<label class="check">
									<input type="checkbox" bind:checked={profile.newsletter} />
									Quero receber novidades e convites por e-mail
								</label>
								<button class="btn" type="submit" disabled={saving}>{saving ? 'Salvando…' : 'Salvar alterações'}</button>
							</form>
						{:else if tab === 'endereco'}
							<h2>Endereço principal</h2>
							<p class="muted intro">Usado como padrão no checkout. Você pode trocar o endereço a cada compra.</p>
							<form class="form" onsubmit={saveAddress} novalidate>
								<AddressFields bind:address errors={addressTouched ? addressErrors : {}} />
								<button class="btn" type="submit" disabled={saving}>{saving ? 'Salvando…' : 'Salvar endereço'}</button>
							</form>
						{:else}
							<h2>Alterar senha</h2>
							<form class="form narrow" onsubmit={savePassword} novalidate>
								<Field
									label="Senha atual"
									type="password"
									bind:value={pass.current}
									autocomplete="current-password"
									error={passTouched && !pass.current ? 'Digite sua senha atual.' : passError}
								/>
								<Field
									label="Nova senha"
									type="password"
									bind:value={pass.next}
									autocomplete="new-password"
									hint="Mínimo de 8 caracteres, com letras e números."
									error={passTouched ? passErrors.password : ''}
								/>
								<Field
									label="Confirmar nova senha"
									type="password"
									bind:value={pass.confirm}
									autocomplete="new-password"
									error={passTouched ? passErrors.confirm : ''}
								/>
								<button class="btn" type="submit" disabled={saving}>{saving ? 'Salvando…' : 'Alterar senha'}</button>
							</form>
						{/if}
					</div>
				{/key}
			</div>
		</div>
	{/if}
</div>

<style>
	.page {
		padding-top: clamp(2rem, 4vw, 3.5rem);
		min-height: 70vh;
	}

	.center {
		display: grid;
		place-items: center;
		min-height: 40vh;
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

	.head {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 1.5rem;
		padding-bottom: 2rem;
		margin-bottom: 2.5rem;
		border-bottom: 1px solid var(--line);
		animation: in 0.8s var(--ease-out) both;
	}

	@keyframes in {
		from {
			opacity: 0;
			transform: translateY(16px);
		}
	}

	.head .eyebrow {
		margin-bottom: 0.75rem;
	}

	.head h1 {
		font-size: clamp(2.8rem, 6vw, 5rem);
		margin-bottom: 0.6rem;
	}

	.logout {
		color: var(--ink-2);
	}

	.layout {
		display: grid;
		grid-template-columns: 240px minmax(0, 1fr);
		gap: clamp(2rem, 5vw, 5rem);
		align-items: start;
	}

	@media (max-width: 900px) {
		.layout {
			grid-template-columns: 1fr;
		}
	}

	.side {
		position: sticky;
		top: calc(var(--header-h) + 1.5rem);
		display: grid;
		gap: 0.25rem;
	}

	.side button,
	.side a {
		display: flex;
		align-items: center;
		gap: 0.8rem;
		padding: 0.8rem 0.9rem;
		font-size: 13px;
		letter-spacing: 0.04em;
		color: var(--ink-2);
		text-align: left;
		border-left: 1px solid transparent;
		transition:
			background 0.25s,
			color 0.25s,
			border-color 0.25s;
	}

	.side button:hover,
	.side a:hover {
		color: var(--ink);
		background: var(--paper);
	}

	.side .on {
		color: var(--ink);
		background: var(--paper);
		border-left-color: var(--ink);
	}

	.n {
		margin-left: auto;
		font-size: 11px;
		color: var(--ink-3);
	}

	@media (max-width: 900px) {
		.side {
			position: static;
			display: flex;
			overflow-x: auto;
			scrollbar-width: none;
			border-bottom: 1px solid var(--line);
			gap: 0;
		}

		.side button,
		.side a {
			flex: none;
			border-left: 0;
			border-bottom: 1px solid transparent;
			margin-bottom: -1px;
			background: none !important;
		}

		.side .on {
			border-bottom-color: var(--ink);
		}
	}

	.content h2 {
		font-size: 32px;
		margin-bottom: 1.75rem;
	}

	.intro {
		margin: -1rem 0 1.75rem;
		font-size: 14px;
	}

	.orders {
		display: grid;
		gap: 0.75rem;
	}

	.order {
		border: 1px solid var(--line);
		background: var(--paper);
		transition: border-color 0.3s;
	}

	.order.open {
		border-color: var(--line-2);
	}

	.o-head {
		width: 100%;
		display: grid;
		grid-template-columns: 1fr auto auto auto;
		align-items: center;
		gap: 1.5rem;
		padding: 1.15rem 1.25rem;
		text-align: left;
	}

	.o-id {
		display: grid;
	}

	.o-id strong {
		font-weight: 500;
		letter-spacing: 0.06em;
	}

	small {
		font-size: 12.5px;
		color: var(--ink-3);
	}

	.status {
		padding: 5px 10px;
		font-size: 11px;
		letter-spacing: 0.08em;
		background: var(--sand);
		white-space: nowrap;
	}

	.status[data-s='aprovado'],
	.status[data-s='entregue'] {
		background: #dfe5d8;
		color: var(--ok);
	}

	.status[data-s='aguardando'] {
		background: #f1e3cf;
		color: #8a5a1c;
	}

	.o-total {
		font-size: 14px;
	}

	.o-head :global(.chev) {
		transition: transform 0.4s var(--ease-out);
	}

	.open .o-head :global(.chev) {
		transform: rotate(180deg);
	}

	@media (max-width: 640px) {
		.o-head {
			grid-template-columns: 1fr auto;
			gap: 0.6rem 1rem;
		}

		.status {
			grid-row: 2;
			justify-self: start;
		}

		.o-head :global(.chev) {
			display: none;
		}
	}

	.o-body {
		padding: 0 1.25rem 1.5rem;
		border-top: 1px solid var(--line);
	}

	.track {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 0.25rem;
		padding: 1.5rem 0;
		font-size: 11.5px;
		color: var(--ink-3);
	}

	.track li {
		display: grid;
		gap: 0.5rem;
	}

	.track li span {
		height: 2px;
		background: var(--line);
	}

	.track li.done {
		color: var(--ink);
	}

	.track li.done span {
		background: var(--ink);
	}

	.o-lines {
		display: grid;
		gap: 0.9rem;
		padding-bottom: 1.25rem;
		border-bottom: 1px solid var(--line);
	}

	.o-lines li {
		display: grid;
		grid-template-columns: 52px 1fr auto;
		gap: 0.9rem;
		align-items: center;
		font-size: 13.5px;
	}

	.o-lines li > span:nth-child(2) {
		display: grid;
	}

	.l-name {
		font-family: var(--serif);
		font-size: 16px;
	}

	.o-meta {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		padding: 1.25rem 0;
		font-size: 13.5px;
	}

	.o-meta small {
		display: block;
		font-size: 10.5px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		margin-bottom: 0.25rem;
	}

	@media (max-width: 640px) {
		.o-meta {
			grid-template-columns: 1fr;
		}
	}

	.o-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.empty {
		display: grid;
		justify-items: center;
		gap: 0.6rem;
		text-align: center;
		padding: 3.5rem 1rem;
		border: 1px dashed var(--line-2);
	}

	.empty :global(svg) {
		color: var(--stone);
		margin-bottom: 0.5rem;
	}

	.e-title {
		font-family: var(--serif);
		font-size: 26px;
	}

	.empty .btn {
		margin-top: 1rem;
	}

	.form {
		display: grid;
		gap: 1.75rem;
		justify-items: start;
		max-width: 680px;
	}

	.form > :global(*) {
		width: 100%;
	}

	.form > .btn,
	.form > .check {
		width: auto;
	}

	.form.narrow {
		max-width: 420px;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		gap: 1.4rem 1.25rem;
	}

	@media (max-width: 560px) {
		.grid > :global(*) {
			grid-column: span 6 !important;
		}
	}
</style>
