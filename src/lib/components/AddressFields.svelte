<script lang="ts">
	import type { Address } from '$lib/stores/auth.svelte';
	import { lookupCep, UFS } from '$lib/utils/cep';
	import { digits, maskCEP, maskNumber } from '$lib/utils/masks';
	import type { Errors } from '$lib/utils/validate';
	import Field from './Field.svelte';

	interface Props {
		address: Address;
		errors?: Errors<Address>;
		onblur?: (key: keyof Address) => void;
	}

	let { address = $bindable(), errors = {}, onblur }: Props = $props();

	let looking = $state(false);
	let notFound = $state(false);
	let lastCep = '';
	let numberWrap: HTMLDivElement;
	const stateId = $props.id();

	async function onCep() {
		const d = digits(address.cep);
		if (d.length !== 8 || d === lastCep) return;
		lastCep = d;
		looking = true;
		notFound = false;
		const r = await lookupCep(d);
		looking = false;
		if (!r) {
			notFound = true;
			return;
		}
		address.street = r.street || address.street;
		address.district = r.district || address.district;
		address.city = r.city;
		address.state = r.state;
		numberWrap?.querySelector('input')?.focus();
	}

	$effect(() => {
		void address.cep;
		onCep();
	});
</script>

<div class="grid">
	<Field
		label="CEP"
		bind:value={address.cep}
		mask={maskCEP}
		inputmode="numeric"
		autocomplete="postal-code"
		placeholder="00000-000"
		required
		span={2}
		error={errors.cep}
		hint={looking ? 'Buscando endereço…' : notFound ? 'CEP não encontrado. Preencha o endereço manualmente.' : ''}
		onblur={() => onblur?.('cep')}
	/>
	<div class="cep-help">
		<a href="https://buscacepinter.correios.com.br/app/endereco/index.php" target="_blank" rel="noopener noreferrer" class="text-link"
			>Não sei meu CEP</a
		>
	</div>
	<Field
		label="Rua"
		bind:value={address.street}
		autocomplete="address-line1"
		required
		span={4}
		error={errors.street}
		onblur={() => onblur?.('street')}
	/>
	<div class="span2" bind:this={numberWrap}>
		<Field
			label="Número"
			bind:value={address.number}
			mask={maskNumber}
			required
			error={errors.number}
			onblur={() => onblur?.('number')}
		/>
	</div>
	<Field label="Complemento" bind:value={address.complement} autocomplete="address-line2" placeholder="Apto, bloco, referência" span={4} />
	<Field
		label="Bairro"
		bind:value={address.district}
		required
		span={2}
		error={errors.district}
		onblur={() => onblur?.('district')}
	/>
	<div class="span2 city">
		<Field
			label="Cidade"
			bind:value={address.city}
			autocomplete="address-level2"
			required
			error={errors.city}
			onblur={() => onblur?.('city')}
		/>
	</div>
	<div class="select span2 uf" class:invalid={!!errors.state}>
		<label for={stateId}>Estado<span class="req" aria-hidden="true"> *</span></label>
		<select
			id={stateId}
			class="input"
			bind:value={address.state}
			autocomplete="address-level1"
			aria-invalid={!!errors.state}
			onblur={() => onblur?.('state')}
		>
			<option value="" disabled>Selecione</option>
			{#each UFS as uf (uf)}<option value={uf}>{uf}</option>{/each}
		</select>
		{#if errors.state}<p class="msg">{errors.state}</p>{/if}
	</div>
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		gap: 1.4rem 1.25rem;
	}

	.span2 {
		grid-column: span 2;
	}

	.cep-help {
		grid-column: span 4;
		align-self: center;
		padding-top: 1rem;
		font-size: 12.5px;
		color: var(--ink-3);
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

	.req {
		color: var(--wine);
	}

	.select.invalid select {
		border-color: var(--danger);
	}

	.msg {
		font-size: 12.5px;
		color: var(--danger);
	}

	@media (max-width: 560px) {
		.grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.grid > :global(*) {
			grid-column: span 2 !important;
		}

		.grid > .city,
		.grid > .uf {
			grid-column: span 1 !important;
		}

		.cep-help {
			padding-top: 0;
		}
	}
</style>
