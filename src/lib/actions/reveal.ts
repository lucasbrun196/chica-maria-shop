/**
 * Revela elementos com [data-reveal] quando entram na tela.
 * Um único IntersectionObserver é compartilhado por todos os elementos,
 * e cada um deixa de ser observado assim que aparece.
 */
let observer: IntersectionObserver | null = null;

function getObserver() {
	observer ??= new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				entry.target.classList.add('is-in');
				observer!.unobserve(entry.target);
			}
		},
		{ rootMargin: '0px 0px -8% 0px', threshold: 0 }
	);
	return observer;
}

export function reveal(node: HTMLElement, delay = 0) {
	if (delay) node.style.setProperty('--rd', `${delay}ms`);
	if (typeof IntersectionObserver === 'undefined') {
		node.classList.add('is-in');
		return;
	}
	const io = getObserver();
	io.observe(node);
	return {
		destroy() {
			io.unobserve(node);
		}
	};
}
