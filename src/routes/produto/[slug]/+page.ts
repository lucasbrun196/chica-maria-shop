import { error } from '@sveltejs/kit';
import { getProductBySlug, products } from '$lib/data/products';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => products.map((p) => ({ slug: p.slug }));

export const load: PageLoad = ({ params }) => {
	const product = getProductBySlug(params.slug);
	if (!product) error(404, 'Produto não encontrado');
	return { product };
};
