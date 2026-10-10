<script lang="ts">
	import Icon from './Icon.svelte';

	interface Props {
		value: number;
		min?: number;
		max?: number;
		small?: boolean;
		onchange: (v: number) => void;
	}

	let { value, min = 1, max = 10, small = false, onchange }: Props = $props();
</script>

<div class="qty" class:small role="group" aria-label="Quantidade">
	<button onclick={() => onchange(value - 1)} disabled={value <= min} aria-label="Diminuir quantidade">
		<Icon name="minus" size={14} />
	</button>
	<span aria-live="polite">{value}</span>
	<button onclick={() => onchange(value + 1)} disabled={value >= max} aria-label="Aumentar quantidade">
		<Icon name="plus" size={14} />
	</button>
</div>

<style>
	.qty {
		display: inline-flex;
		align-items: center;
		border: 1px solid var(--line-2);
		height: 52px;
	}

	.qty.small {
		height: 34px;
	}

	button {
		width: 42px;
		height: 100%;
		display: grid;
		place-items: center;
		transition: background 0.2s;
	}

	.small button {
		width: 30px;
	}

	button:hover:not(:disabled) {
		background: var(--sand);
	}

	button:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	span {
		min-width: 28px;
		text-align: center;
		font-size: 14px;
		font-variant-numeric: tabular-nums;
	}
</style>
