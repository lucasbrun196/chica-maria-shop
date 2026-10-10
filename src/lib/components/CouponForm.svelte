<script lang="ts">
	import { coupons } from '$lib/data/store';
	import { cart } from '$lib/stores/cart.svelte';
	import { money } from '$lib/utils/format';

	let code = $state('');
	let error = $state('');
	let open = $state(false);

	function apply(e: SubmitEvent) {
		e.preventDefault();
		if (!code.trim()) return;
		const err = cart.applyCoupon(code);
		error = err ?? '';
		if (!err) {
			code = '';
			open = false;
		}
	}
</script>

{#if cart.coupon}
	<div class="applied">
		<span>
			<strong>{cart.coupon}</strong>
			<small>{coupons[cart.coupon].label} · −{money(cart.couponDiscount)}</small>
		</span>
		<button class="text-link" onclick={() => cart.removeCoupon()}>Remover</button>
	</div>
{:else if !open}
	<button class="toggle" onclick={() => (open = true)}>Tem um cupom de desconto?</button>
{:else}
	<form onsubmit={apply} novalidate>
		<label class="sr-only" for="coupon">Cupom</label>
		<input id="coupon" class="input" bind:value={code} placeholder="Código do cupom" autocomplete="off" />
		<button class="btn btn--ghost btn--sm" type="submit">Aplicar</button>
	</form>
	{#if error}<p class="err">{error}</p>{/if}
{/if}

<style>
	.toggle {
		font-size: 13px;
		text-decoration: underline;
		text-underline-offset: 3px;
		color: var(--ink-2);
	}

	form {
		display: flex;
		gap: 0.75rem;
		align-items: center;
		animation: in 0.4s var(--ease-out);
	}

	form .input {
		height: 42px;
		text-transform: uppercase;
	}

	.err {
		margin-top: 0.5rem;
		font-size: 12.5px;
		color: var(--danger);
	}

	.applied {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		padding: 0.8rem 1rem;
		background: var(--sand);
		font-size: 13px;
	}

	.applied strong {
		display: block;
		font-weight: 500;
		letter-spacing: 0.1em;
	}

	.applied small {
		color: var(--ink-2);
	}

	@keyframes in {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
	}
</style>
