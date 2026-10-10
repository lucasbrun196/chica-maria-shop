import { collections, getCategory, products, type Product } from '$lib/data/products';
import { normalize } from './format';

let index: { p: Product; hay: string }[] | null = null;

function build() {
	return products.map((p) => ({
		p,
		hay: normalize(
			[
				p.name,
				getCategory(p.category)?.name ?? '',
				p.colors.map((c) => c.name).join(' '),
				p.composition,
				p.collection ? collections[p.collection].name : '',
				p.description
			].join(' ')
		)
	}));
}

export function searchProducts(query: string): Product[] {
	const terms = normalize(query).split(/\s+/).filter((t) => t.length > 1);
	if (!terms.length) return [];
	index ??= build();
	// nome pesa mais que descrição
	return index
		.filter(({ hay }) => terms.every((t) => hay.includes(t)))
		.map(({ p }) => ({ p, score: terms.reduce((s, t) => s + (normalize(p.name).includes(t) ? 2 : 0), 0) }))
		.sort((a, b) => b.score - a.score)
		.map(({ p }) => p);
}

export const popularSearches = ['Vestido linho', 'Alfaiataria', 'Tricô', 'Seda', 'Saia midi', 'Bolsa'];
