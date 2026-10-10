<script lang="ts">
	// O script inline do app.html decide se a abertura aparece (uma vez por sessão).
	function done(e: AnimationEvent) {
		if (e.target !== e.currentTarget) return;
		document.documentElement.classList.remove('has-intro');
	}
</script>

<div class="intro" aria-hidden="true" onanimationend={done}>
	<div class="inner">
		<span class="mask"><span class="w w1">Chica</span></span>
		<span class="mask"><span class="w w2">Maria</span></span>
		<span class="place">Passo Fundo · Rio Grande do Sul</span>
	</div>
</div>

<style>
	.intro {
		display: none;
	}

	:global(.has-intro) .intro {
		position: fixed;
		inset: 0;
		z-index: 400;
		display: grid;
		place-items: center;
		background: var(--ink);
		color: var(--ivory);
		animation: lift 1s var(--ease-io) 1.55s forwards;
	}

	.inner {
		display: grid;
		justify-items: center;
		text-align: center;
	}

	.mask {
		display: block;
		overflow: hidden;
		line-height: 0.95;
		padding-bottom: 0.06em;
	}

	.w {
		display: block;
		font-family: var(--serif);
		font-size: clamp(56px, 11vw, 150px);
		font-weight: 400;
		letter-spacing: -0.01em;
		animation: rise 1.1s var(--ease-out) both;
	}

	.w2 {
		font-style: italic;
		animation-delay: 0.12s;
	}

	.place {
		margin-top: 1.6rem;
		font-size: 10.5px;
		letter-spacing: 0.32em;
		text-transform: uppercase;
		opacity: 0;
		animation: fade-in 0.8s var(--ease) 0.55s forwards;
	}

	@keyframes rise {
		from {
			transform: translate3d(0, 105%, 0);
		}
	}

	@keyframes fade-in {
		to {
			opacity: 0.7;
		}
	}

	@keyframes lift {
		to {
			clip-path: inset(0 0 100% 0);
			visibility: hidden;
		}
	}
</style>
