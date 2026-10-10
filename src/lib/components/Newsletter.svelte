<script lang="ts">
	import { isValidEmail } from '$lib/utils/masks';
	import Icon from './Icon.svelte';

	let email = $state('');
	let error = $state('');
	let sent = $state('');

	function submit(e: SubmitEvent) {
		e.preventDefault();
		if (!isValidEmail(email)) {
			error = 'Digite um e-mail válido.';
			return;
		}
		error = '';
		sent = email.trim();
		email = '';
	}
</script>

<div class="nl">
	{#if sent}
		<p class="ok">Pronto. As novidades vão chegar em <strong>{sent}</strong>.</p>
	{:else}
		<form onsubmit={submit} novalidate>
			<label class="sr-only" for="nl-email">Seu e-mail</label>
			<input id="nl-email" type="email" bind:value={email} placeholder="Seu melhor e-mail" autocomplete="email" />
			<button type="submit" aria-label="Cadastrar e-mail"><Icon name="arrow-right" size={20} /></button>
		</form>
		{#if error}<p class="err">{error}</p>{/if}
	{/if}
</div>

<style>
	form {
		display: flex;
		border-bottom: 1px solid currentColor;
	}

	input {
		flex: 1;
		min-width: 0;
		height: 54px;
		background: none;
		border: 0;
		outline: none;
		font-size: 15px;
	}

	input::placeholder {
		color: inherit;
		opacity: 0.6;
	}

	button {
		width: 48px;
		display: grid;
		place-items: center;
		transition: transform 0.4s var(--ease-out);
	}

	button:hover {
		transform: translateX(4px);
	}

	.ok {
		font-family: var(--serif);
		font-size: 22px;
		line-height: 1.3;
		animation: in 0.6s var(--ease-out);
	}

	.ok strong {
		font-weight: 500;
		font-style: italic;
	}

	.err {
		margin-top: 0.5rem;
		font-size: 12.5px;
		color: var(--danger);
	}

	@keyframes in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
	}
</style>
