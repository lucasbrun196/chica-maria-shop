<script lang="ts">
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import { auth, type Address } from '$lib/stores/auth.svelte';
	import { ui } from '$lib/stores/ui.svelte';
	import { maskCPF, maskDate, maskPhone, passwordStrength } from '$lib/utils/masks';
	import {
		emptyAddress,
		focusFirstError,
		safeRedirect,
		validateAddress,
		validatePassword,
		validatePersonal,
		type Personal
	} from '$lib/utils/validate';
	import AddressFields from '$lib/components/AddressFields.svelte';
	import AuthAside from '$lib/components/AuthAside.svelte';
	import Field from '$lib/components/Field.svelte';
	import Icon from '$lib/components/Icon.svelte';

	let personal = $state<Personal>({ name: '', email: '', cpf: '', birth: '', phone: '' });
	let address = $state<Address>(emptyAddress());
	let password = $state('');
	let confirm = $state('');
	let show = $state(false);
	let newsletter = $state(true);
	let terms = $state(false);

	let touched = $state<Record<string, boolean>>({});
	let submitted = $state(false);
	let loading = $state(false);
	let formError = $state('');
	let redirecting = false;
	let form: HTMLFormElement;

	const personalErrors = $derived(validatePersonal(personal));
	const addressErrors = $derived(validateAddress(address));
	const passErrors = $derived(validatePassword(password, confirm));
	const strength = $derived(passwordStrength(password));
	const strengthLabel = $derived(['Muito fraca', 'Fraca', 'Razoável', 'Boa', 'Forte'][strength]);

	const show_ = (k: string) => submitted || touched[k];
	const pErr = (k: keyof Personal) => (show_(k) ? personalErrors[k] : '');
	const visibleAddressErrors = $derived(
		Object.fromEntries(
			Object.entries(addressErrors).filter(([k]) => show_(`a.${k}`))
		) as typeof addressErrors
	);

	const target = () => safeRedirect(new URLSearchParams(location.search).get('voltar'), '/conta');

	$effect(() => {
		if (auth.ready && auth.user && !redirecting) {
			redirecting = true;
			goto(target(), { replaceState: true });
		}
	});

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		submitted = true;
		formError = '';
		const hasErrors =
			Object.keys(personalErrors).length ||
			Object.keys(addressErrors).length ||
			Object.keys(passErrors).length ||
			!terms;
		if (hasErrors) {
			formError = !terms && !Object.keys({ ...personalErrors, ...addressErrors, ...passErrors }).length
				? 'Para continuar, aceite os termos de uso.'
				: 'Confira os campos destacados.';
			focusFirstError(form);
			return;
		}
		loading = true;
		redirecting = true;
		await new Promise((r) => setTimeout(r, 700));
		const res = await auth.register({ ...personal, address, newsletter }, password);
		loading = false;
		if (!res.ok) {
			redirecting = false;
			formError = res.error;
			touched.email = true;
			return;
		}
		ui.toast(`Conta criada. Seja bem-vinda, ${auth.firstName}.`, 3800);
		goto(target(), { replaceState: true });
	}
</script>

<svelte:head>
	<title>Criar conta — Chica Maria</title>
</svelte:head>

<div class="auth">
	<AuthAside
		tone="#d8b6a6"
		title="Uma conta, todas as vantagens."
		text="Cadastre-se para comprar, salvar seus endereços e ganhar 10% de desconto na primeira compra."
	/>

	<section class="panel">
		<form class="box" bind:this={form} onsubmit={submit} novalidate>
			<p class="eyebrow">Cadastro</p>
			<h1 class="title">Criar conta</h1>
			<p class="intro muted">
				Já tem cadastro? <a href="/entrar" class="text-link">Entrar</a>
			</p>

			<fieldset>
				<legend><span>01</span> Dados pessoais</legend>
				<div class="grid">
					<Field
						label="Nome completo"
						bind:value={personal.name}
						autocomplete="name"
						required
						span={6}
						error={pErr('name')}
						onblur={() => (touched.name = true)}
					/>
					<Field
						label="E-mail"
						type="email"
						bind:value={personal.email}
						autocomplete="email"
						required
						span={6}
						error={pErr('email')}
						onblur={() => (touched.email = true)}
					/>
					<Field
						label="CPF"
						bind:value={personal.cpf}
						mask={maskCPF}
						inputmode="numeric"
						placeholder="000.000.000-00"
						required
						span={3}
						error={pErr('cpf')}
						onblur={() => (touched.cpf = true)}
					/>
					<Field
						label="Data de nascimento"
						bind:value={personal.birth}
						mask={maskDate}
						inputmode="numeric"
						placeholder="DD/MM/AAAA"
						autocomplete="bday"
						required
						span={3}
						error={pErr('birth')}
						onblur={() => (touched.birth = true)}
					/>
					<Field
						label="Celular / WhatsApp"
						type="tel"
						bind:value={personal.phone}
						mask={maskPhone}
						inputmode="tel"
						placeholder="(54) 99999-9999"
						autocomplete="tel"
						required
						span={6}
						error={pErr('phone')}
						onblur={() => (touched.phone = true)}
					/>
				</div>
			</fieldset>

			<fieldset>
				<legend><span>02</span> Endereço de entrega</legend>
				<AddressFields bind:address errors={visibleAddressErrors} onblur={(k) => (touched[`a.${k}`] = true)} />
			</fieldset>

			<fieldset>
				<legend><span>03</span> Senha</legend>
				<div class="grid">
					<Field
						label="Senha"
						type={show ? 'text' : 'password'}
						bind:value={password}
						autocomplete="new-password"
						required
						span={3}
						error={show_('password') ? passErrors.password : ''}
						hint="Mínimo de 8 caracteres, com letras e números."
						onblur={() => (touched.password = true)}
					>
						{#snippet trailing()}
							<button type="button" class="eye" onclick={() => (show = !show)} aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}>
								<Icon name={show ? 'eye-off' : 'eye'} size={18} />
							</button>
						{/snippet}
					</Field>
					<Field
						label="Confirmar senha"
						type={show ? 'text' : 'password'}
						bind:value={confirm}
						autocomplete="new-password"
						required
						span={3}
						error={show_('confirm') ? passErrors.confirm : ''}
						onblur={() => (touched.confirm = true)}
					/>
				</div>
				{#if password}
					<div class="strength" data-s={strength} transition:fade={{ duration: 200 }}>
						<div class="bars">{#each [1, 2, 3, 4] as i (i)}<span class:on={strength >= i}></span>{/each}</div>
						<span class="s-label">Senha {strengthLabel.toLowerCase()}</span>
					</div>
				{/if}
			</fieldset>

			<div class="checks">
				<label class="check">
					<input type="checkbox" bind:checked={newsletter} />
					Quero receber novidades, lançamentos e convites da Chica Maria por e-mail.
				</label>
				<label class="check" class:invalid={submitted && !terms}>
					<input type="checkbox" bind:checked={terms} />
					<span>Li e aceito os <a href="/ajuda#perguntas" class="text-link">termos de uso</a> e a política de privacidade.</span>
				</label>
			</div>

			{#if formError}<p class="form-error" in:fade>{formError}</p>{/if}

			<button class="btn btn--block" type="submit" disabled={loading}>
				{loading ? 'Criando sua conta…' : 'Criar conta'}
			</button>
			<p class="secure"><Icon name="shield" size={15} /> Seus dados ficam protegidos e não são compartilhados.</p>
		</form>
	</section>
</div>

<style>
	.auth {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
		min-height: calc(100vh - var(--header-total));
	}

	@media (max-width: 900px) {
		.auth {
			grid-template-columns: 1fr;
		}
	}

	.panel {
		padding: clamp(2.5rem, 5vw, 4.5rem) var(--gutter) 4rem;
		display: flex;
		justify-content: center;
	}

	.box {
		width: min(600px, 100%);
		animation: in 0.9s var(--ease-out) both;
	}

	@keyframes in {
		from {
			opacity: 0;
			transform: translate3d(0, 20px, 0);
		}
	}

	.eyebrow {
		margin-bottom: 0.75rem;
	}

	.intro {
		margin: 0.9rem 0 1rem;
		font-size: 14px;
	}

	fieldset {
		border: 0;
		margin: 0;
		padding: 2.25rem 0 0.5rem;
	}

	legend {
		display: flex;
		align-items: baseline;
		gap: 0.75rem;
		width: 100%;
		padding: 0 0 1rem;
		margin-bottom: 1.5rem;
		border-bottom: 1px solid var(--line);
		font-family: var(--serif);
		font-size: 26px;
	}

	legend span {
		font-family: var(--sans);
		font-size: 11px;
		letter-spacing: 0.16em;
		color: var(--ink-3);
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

	.eye {
		width: 40px;
		height: 40px;
		display: grid;
		place-items: center;
		color: var(--ink-3);
	}

	.strength {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-top: 1rem;
		font-size: 12px;
		color: var(--ink-3);
	}

	.bars {
		display: flex;
		gap: 4px;
	}

	.bars span {
		width: 34px;
		height: 3px;
		background: var(--line);
		transition: background 0.35s;
	}

	.strength[data-s='1'] .bars span.on,
	.strength[data-s='0'] .bars span.on {
		background: var(--danger);
	}

	.strength[data-s='2'] .bars span.on {
		background: #b8873a;
	}

	.strength[data-s='3'] .bars span.on,
	.strength[data-s='4'] .bars span.on {
		background: var(--ok);
	}

	.checks {
		display: grid;
		gap: 1rem;
		margin: 2.25rem 0 1.75rem;
	}

	.check.invalid input {
		border-color: var(--danger);
	}

	.form-error {
		margin-bottom: 1rem;
		font-size: 13px;
		color: var(--danger);
	}

	.secure {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		margin-top: 1rem;
		font-size: 12.5px;
		color: var(--ink-3);
	}
</style>
