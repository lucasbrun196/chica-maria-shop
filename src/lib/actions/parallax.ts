/**
 * Parallax leve: um único listener de scroll (passivo, agrupado em rAF)
 * atualiza apenas os elementos que estão visíveis. Usa transform, então
 * não provoca reflow. Desligado quando o usuário prefere menos movimento.
 */
interface Item {
	el: HTMLElement;
	speed: number;
	scale: number;
	visible: boolean;
}

const items = new Set<Item>();
const byEl = new WeakMap<Element, Item>();
let io: IntersectionObserver | null = null;
let ticking = false;
let listening = false;

function update() {
	ticking = false;
	const vh = window.innerHeight;
	for (const it of items) {
		if (!it.visible) continue;
		const host = it.el.parentElement ?? it.el;
		const r = host.getBoundingClientRect();
		const offset = r.top + r.height / 2 - vh / 2;
		const y = (-offset * it.speed).toFixed(1);
		it.el.style.transform = `translate3d(0, ${y}px, 0)${it.scale !== 1 ? ` scale(${it.scale})` : ''}`;
	}
}

function schedule() {
	if (ticking) return;
	ticking = true;
	requestAnimationFrame(update);
}

function listen(on: boolean) {
	if (on === listening) return;
	listening = on;
	const fn = on ? addEventListener : removeEventListener;
	fn('scroll', schedule, { passive: true } as AddEventListenerOptions);
	fn('resize', schedule, { passive: true } as AddEventListenerOptions);
}

export function parallax(node: HTMLElement, opts: { speed?: number; scale?: number } = {}) {
	if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	io ??= new IntersectionObserver(
		(entries) => {
			for (const e of entries) {
				const it = byEl.get(e.target);
				if (it) it.visible = e.isIntersecting;
			}
			schedule();
		},
		{ rootMargin: '15% 0px' }
	);

	const item: Item = { el: node, speed: opts.speed ?? 0.12, scale: opts.scale ?? 1, visible: false };
	const host = node.parentElement ?? node;
	items.add(item);
	byEl.set(host, item);
	node.style.willChange = 'transform';
	io.observe(host);
	listen(true);

	return {
		destroy() {
			items.delete(item);
			io?.unobserve(host);
			if (!items.size) listen(false);
		}
	};
}
