<script lang="ts">
	interface Props {
		number: string;
		name: string;
		expiry: string;
		brand: string;
		flipped: boolean;
	}

	let { number, name, expiry, brand, flipped }: Props = $props();

	const shown = $derived(
		(number.replace(/\s/g, '') + '•'.repeat(16)).slice(0, 16).replace(/(.{4})(?=.)/g, '$1 ')
	);
</script>

<div class="scene" aria-hidden="true">
	<div class="card" class:flipped>
		<div class="face front">
			<div class="top">
				<span class="chip"></span>
				<span class="brand">{brand || 'Cartão'}</span>
			</div>
			<p class="number">{shown}</p>
			<div class="bottom">
				<span>
					<small>Titular</small>
					{name.trim() || 'NOME COMO NO CARTÃO'}
				</span>
				<span>
					<small>Validade</small>
					{expiry || 'MM/AA'}
				</span>
			</div>
		</div>
		<div class="face back">
			<span class="stripe"></span>
			<span class="cvv">CVV</span>
		</div>
	</div>
</div>

<style>
	.scene {
		perspective: 1200px;
		width: min(340px, 100%);
	}

	.card {
		position: relative;
		aspect-ratio: 1.586;
		transform-style: preserve-3d;
		transition: transform 0.8s var(--ease-out);
	}

	.card.flipped {
		transform: rotateY(180deg);
	}

	.face {
		position: absolute;
		inset: 0;
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
		border-radius: 12px;
		padding: 1.25rem 1.4rem;
		color: var(--ivory);
		background:
			radial-gradient(120% 140% at 0% 0%, rgb(255 255 255 / 0.12), transparent 50%),
			linear-gradient(135deg, #3a2f2a, #1f1b18 60%, #4a2a30);
		box-shadow: 0 24px 48px -24px rgb(31 27 24 / 0.55);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.top {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.chip {
		width: 38px;
		height: 28px;
		border-radius: 5px;
		background: linear-gradient(135deg, #d8c08a, #a8894f);
	}

	.brand {
		font-family: var(--serif);
		font-style: italic;
		font-size: 20px;
	}

	.number {
		font-size: clamp(16px, 4.6vw, 20px);
		letter-spacing: 0.12em;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}

	.bottom {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		font-size: 12.5px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.bottom span {
		display: grid;
		min-width: 0;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.bottom span:last-child {
		flex: none;
		text-align: right;
	}

	small {
		font-size: 9px;
		letter-spacing: 0.2em;
		opacity: 0.6;
	}

	.back {
		transform: rotateY(180deg);
		padding: 1.4rem 0;
		justify-content: flex-start;
		gap: 1.25rem;
	}

	.stripe {
		height: 40px;
		background: #0e0c0b;
	}

	.cvv {
		align-self: flex-end;
		margin-right: 1.4rem;
		padding: 0.4rem 0.8rem;
		background: var(--ivory);
		color: var(--ink);
		font-size: 12px;
		letter-spacing: 0.2em;
	}
</style>
