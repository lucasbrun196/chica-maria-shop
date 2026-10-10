<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLInputAttributes, 'value'> {
		label: string;
		value?: string;
		error?: string;
		hint?: string;
		mask?: (v: string) => string;
		trailing?: Snippet;
		span?: 1 | 2 | 3 | 4 | 6;
	}

	let {
		label,
		value = $bindable(''),
		error = '',
		hint = '',
		mask,
		trailing,
		span,
		required,
		...rest
	}: Props = $props();

	const id = $props.id();

	function onInput(e: Event & { currentTarget: HTMLInputElement }) {
		const el = e.currentTarget;
		const next = mask ? mask(el.value) : el.value;
		value = next;
		// garante que caracteres rejeitados pela máscara sumam do campo
		if (el.value !== next) el.value = next;
	}
</script>

<div class="field" class:invalid={!!error} style:grid-column={span ? `span ${span}` : null}>
	<label for={id}>{label}{#if required}<span class="req" aria-hidden="true"> *</span>{/if}</label>
	<div class="control">
		<input
			{id}
			class="input"
			{value}
			oninput={onInput}
			aria-invalid={!!error}
			aria-describedby={error || hint ? `${id}-msg` : undefined}
			{required}
			{...rest}
		/>
		{#if trailing}<div class="trailing">{@render trailing()}</div>{/if}
	</div>
	{#if error}
		<p class="msg error" id="{id}-msg">{error}</p>
	{:else if hint}
		<p class="msg" id="{id}-msg">{hint}</p>
	{/if}
</div>

<style>
	.field {
		display: grid;
		gap: 0.2rem;
		min-width: 0;
	}

	label {
		font-size: 10.5px;
		font-weight: 500;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ink-2);
	}

	.req {
		color: var(--wine);
	}

	.control {
		position: relative;
		display: flex;
		align-items: center;
	}

	.trailing {
		position: absolute;
		right: 0;
		top: 0;
		bottom: 0;
		display: flex;
		align-items: center;
	}

	.invalid :global(.input) {
		border-color: var(--danger);
	}

	.msg {
		font-size: 12.5px;
		color: var(--ink-3);
		animation: msg-in 0.35s var(--ease-out);
	}

	.msg.error {
		color: var(--danger);
	}

	@keyframes msg-in {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
	}
</style>
