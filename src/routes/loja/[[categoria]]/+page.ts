import { error } from '@sveltejs/kit';
import { categories, getCategory, virtualCollections } from '$lib/data/products';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => [
	...categories.map((c) => ({ categoria: c.slug })),
	...Object.keys(virtualCollections).map((categoria) => ({ categoria }))
];

export const load: PageLoad = ({ params }) => {
	const slug = params.categoria ?? '';
	if (!slug) {
		return {
			slug,
			kind: 'all' as const,
			title: 'Toda a loja',
			description: 'Todas as peças da Chica Maria, das novidades aos clássicos do nosso acervo.'
		};
	}
	const cat = getCategory(slug);
	if (cat) {
		return { slug, kind: 'category' as const, title: cat.name, description: cat.description };
	}
	const vc = virtualCollections[slug];
	if (vc) {
		return { slug, kind: 'collection' as const, title: vc.name, description: vc.description };
	}
	error(404, 'Categoria não encontrada');
};
