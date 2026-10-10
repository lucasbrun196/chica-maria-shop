<script lang="ts">
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import { auth } from '$lib/stores/auth.svelte';
	import { ui } from '$lib/stores/ui.svelte';
	import { isValidEmail } from '$lib/utils/masks';
	import { safeRedirect } from '$lib/utils/validate';
	import AuthAside from '$lib/components/AuthAside.svelte';
	import Field from '$lib/components/Field.svelte';
	import Icon from '$lib/components/Icon.svelte';

	let email = $state('');
	let password = $state('');
	let show = $state(false);
	let error = $state('');
	let loading = $state(false);
	let fromCheckout = $state(false);
	let redirecting = false;

	const target = () => safeRedirect(new URLSearchParams(location.search).get('voltar'), '/conta');

	$effect(() => {
		fromCheckout = new URLSearchParams(location.search).get('voltar') === '/checkout';
	});

	// quem já está logado não precisa ver o login
	$effect(() => {
		if (auth.ready && auth.user && !redirecting) {
			redirecting = true;
			goto(target(), { replaceState: true });
		}
	});

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		error = '';
		if (!isValidEmail(email) || !password) {
			error = 'Preencha seu e-mail e sua senha.';
			return;
		}
		loading = true;
		await new Promise((r) => setTimeout(r, 450));
		redirecting = true;
		const res = await auth.login(email, password);
		loading = false;
		if (!res.ok) {
			redirecting = false;
			error = res.error;
			return;
		}
		ui.toast(`Que bom te ver de novo, ${auth.firstName}.`);
		goto(target(), { replaceState: true });
	}

	function forgot() {
		ui.toast(
			isValidEmail(email)
				? `Se houver uma conta com ${email.trim()}, enviaremos um link para criar uma nova senha.`
				: 'Digite seu e-mail no campo acima para redefinir a senha.',
			4200
		);
	}

	const signupHref = $derived(fromCheckout ? '/cadastro?voltar=/checkout' : '/cadastro');
</script>

<svelte:head>
	<title>Entrar — Chica Maria</title>
</svelte:head>

<div class="auth">
	<AuthAside
		title="Seus pedidos, favoritos e endereços em um só lugar."
		text="Entre para finalizar sua compra, acompanhar entregas e guardar as peças que você mais gostou."
	/>

	<section class="panel">
		<div class="box">
			{#if fromCheckout}
				<div class="notice" in:fade>
					<Icon name="lock" size={16} />
					<p>Para finalizar a compra, entre na sua conta ou crie uma em menos de dois minutos.</p>
				</div>
			{/if}

			<p class="eyebrow">Minha conta</p>
			<h1 class="title">Entrar</h1>

			<form onsubmit={submit} novalidate>
				<Field label="E-mail" type="email" bind:value={email} autocomplete="email" required />
				<Field label="Senha" type={show ? 'text' : 'password'} bind:value={password} autocomplete="current-password" required>
					{#snippet trailing()}
						<button type="button" class="eye" onclick={() => (show = !show)} aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}>
							<Icon name={show ? 'eye-off' : 'eye'} size={18} />
						</button>
					{/snippet}
				</Field>

				<div class="row">
					<button type="button" class="text-link forgot" onclick={forgot}>Esqueci minha senha</button>
				</div>

				{#if error}<p class="error" in:fade>{error}</p>{/if}

				<button class="btn btn--block" type="submit" disabled={loading}>
					{loading ? 'Entrando…' : 'Entrar'}
				</button>
			</form>

			<div class="divider"><span>Ainda não tem conta?</span></div>

			<ul class="benefits">
				<li><Icon name="check" size={16} /> Checkout mais rápido com seu endereço salvo</li>
				<li><Icon name="check" size={16} /> Acompanhe seus pedidos e trocas</li>
				<li><Icon name="check" size={16} /> 10% na primeira compra com o cupom BEMVINDA10</li>
			</ul>
			<a href={signupHref} class="btn btn--ghost btn--block">Criar minha conta</a>
		</div>
	</section>
</div>

<style>
	.auth {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		min-height: calc(100vh - var(--header-total));
	}

	@media (max-width: 900px) {
		.auth {
			grid-template-columns: 1fr;
		}
	}

	.panel {
		display: grid;
		place-items: center;
		padding: clamp(2.5rem, 6vw, 5rem) var(--gutter);
	}

	.box {
		width: min(420px, 100%);
		animation: in 0.9s var(--ease-out) both;
	}

	@keyframes in {
		from {
			opacity: 0;
			transform: translate3d(0, 20px, 0);
		}
	}

	.notice {
		display: flex;
		gap: 0.75rem;
		align-items: flex-start;
		padding: 1rem 1.1rem;
		margin-bottom: 2rem;
		background: var(--sand);
		font-size: 13.5px;
		line-height: 1.5;
	}

	.notice :global(svg) {
		flex: none;
		margin-top: 2px;
	}

	.eyebrow {
		margin-bottom: 0.75rem;
	}

	h1 {
		margin-bottom: 2.25rem;
	}

	form {
		display: grid;
		gap: 1.5rem;
	}

	.eye {
		width: 40px;
		height: 40px;
		display: grid;
		place-items: center;
		color: var(--ink-3);
	}

	.row {
		display: flex;
		justify-content: flex-end;
		margin-top: -0.75rem;
	}

	.forgot {
		font-size: 12.5px;
		color: var(--ink-2);
	}

	.error {
		font-size: 13px;
		color: var(--danger);
		margin-top: -0.5rem;
	}

	.divider {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin: 2.75rem 0 1.5rem;
		font-size: 11px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ink-3);
	}

	.divider::before,
	.divider::after {
		content: '';
		flex: 1;
		height: 1px;
		background: var(--line);
	}

	.benefits {
		display: grid;
		gap: 0.6rem;
		margin-bottom: 1.5rem;
		font-size: 13.5px;
		color: var(--ink-2);
	}

	.benefits li {
		display: flex;
		gap: 0.6rem;
		align-items: flex-start;
	}

	.benefits :global(svg) {
		flex: none;
		margin-top: 2px;
		color: var(--wine);
	}
</style>
