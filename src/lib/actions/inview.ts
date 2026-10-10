/** Adiciona a classe .is-paused enquanto o elemento está fora da tela (pausa animações CSS). */
export function pauseOffscreen(node: HTMLElement) {
	const io = new IntersectionObserver(([e]) => node.classList.toggle('is-paused', !e.isIntersecting));
	io.observe(node);
	return { destroy: () => io.disconnect() };
}

/** Fecha com Esc e devolve o foco ao elemento que abriu o painel. */
export function dialog(node: HTMLElement, onClose: () => void) {
	const previous = document.activeElement as HTMLElement | null;
	const focusable = () =>
		node.querySelectorAll<HTMLElement>(
			'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
		);

	const onKey = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			e.preventDefault();
			onClose();
			return;
		}
		if (e.key !== 'Tab') return;
		const list = focusable();
		if (!list.length) return;
		const first = list[0];
		const last = list[list.length - 1];
		if (e.shiftKey && document.activeElement === first) {
			e.preventDefault();
			last.focus();
		} else if (!e.shiftKey && document.activeElement === last) {
			e.preventDefault();
			first.focus();
		}
	};

	node.addEventListener('keydown', onKey);
	requestAnimationFrame(() => {
		const target = node.querySelector<HTMLElement>('[data-autofocus]') ?? focusable()[0];
		target?.focus({ preventScroll: true });
	});

	return {
		destroy() {
			node.removeEventListener('keydown', onKey);
			previous?.focus?.({ preventScroll: true });
		}
	};
}
