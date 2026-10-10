export type CategorySlug =
	| 'vestidos'
	| 'blusas'
	| 'calcas'
	| 'saias'
	| 'conjuntos'
	| 'tricos'
	| 'acessorios';

export type ColorFamily =
	| 'neutros'
	| 'preto'
	| 'terrosos'
	| 'verdes'
	| 'azuis'
	| 'rosados'
	| 'bordo'
	| 'estampados'
	| 'dourado';

export type Tag = 'novo' | 'mais-vendido' | 'ultimas';
export type CollectionSlug = 'linho' | 'primavera' | 'inverno';

export interface ProductColor {
	name: string;
	hex: string;
	family: ColorFamily;
}

export interface Category {
	slug: CategorySlug;
	name: string;
	short: string;
	description: string;
	tone: string;
}

export interface Product {
	id: string;
	slug: string;
	name: string;
	category: CategorySlug;
	price: number;
	compareAt?: number;
	colors: ProductColor[];
	sizes: string[];
	unavailable: string[];
	tags: Tag[];
	collection?: CollectionSlug;
	description: string;
	details: string[];
	composition: string;
	care: string[];
	fit: string;
	added: number;
}

export const categories: Category[] = [
	{
		slug: 'vestidos',
		name: 'Vestidos',
		short: 'Vestidos',
		description: 'Do midi de linho ao longo de cetim, para o dia inteiro e para a noite.',
		tone: '#cdb79c'
	},
	{
		slug: 'blusas',
		name: 'Blusas e camisas',
		short: 'Blusas',
		description: 'Seda, laise, tricô fino e linho lavado. As bases de qualquer guarda-roupa.',
		tone: '#e2d6c4'
	},
	{
		slug: 'calcas',
		name: 'Calças',
		short: 'Calças',
		description: 'Pantalonas de alfaiataria, jeans de cintura alta e linho para o calor.',
		tone: '#b9a68c'
	},
	{
		slug: 'saias',
		name: 'Saias',
		short: 'Saias',
		description: 'Plissadas, lápis e longas. Comprimentos que valorizam o movimento.',
		tone: '#d4c1a9'
	},
	{
		slug: 'conjuntos',
		name: 'Conjuntos',
		short: 'Conjuntos',
		description: 'Peças pensadas para andar juntas, e que funcionam muito bem separadas.',
		tone: '#c2ad91'
	},
	{
		slug: 'tricos',
		name: 'Tricôs e casacos',
		short: 'Tricôs',
		description: 'Para o inverno do planalto: lã, mohair, tranças e alfaiataria quente.',
		tone: '#a8916f'
	},
	{
		slug: 'acessorios',
		name: 'Acessórios',
		short: 'Acessórios',
		description: 'Bolsas de couro, cintos, lenços de seda e joias para todos os dias.',
		tone: '#bfa27a'
	}
];

export const collections: Record<CollectionSlug, { name: string; description: string }> = {
	linho: {
		name: 'Cápsula Linho',
		description: 'Linho puro e lavado, em tons de areia, oliva e sálvia.'
	},
	primavera: {
		name: 'Primavera–Verão 26/27',
		description: 'Estampas exclusivas, laise e tecidos leves para a nova estação.'
	},
	inverno: {
		name: 'Inverno na Serra',
		description: 'Tricôs, lã batida e mohair. Ainda dá tempo de garantir.'
	}
};

export const colorFamilies: Record<ColorFamily, { label: string; swatch: string }> = {
	neutros: { label: 'Neutros', swatch: '#d9ccb8' },
	preto: { label: 'Preto', swatch: '#1d1b1a' },
	terrosos: { label: 'Terrosos', swatch: '#a6754c' },
	verdes: { label: 'Verdes', swatch: '#77714f' },
	azuis: { label: 'Azuis', swatch: '#3b4a61' },
	rosados: { label: 'Rosados', swatch: '#c4a09a' },
	bordo: { label: 'Bordô', swatch: '#5c1f2a' },
	estampados: { label: 'Estampados', swatch: '#c8957f' },
	dourado: { label: 'Dourado', swatch: '#c4a05a' }
};

const C = {
	areia: { name: 'Areia', hex: '#d6c4a8', family: 'neutros' },
	oliva: { name: 'Oliva', hex: '#77714f', family: 'verdes' },
	champanhe: { name: 'Champanhe', hex: '#e2cfae', family: 'neutros' },
	bordo: { name: 'Bordô', hex: '#5c1f2a', family: 'bordo' },
	offwhite: { name: 'Off-white', hex: '#efe8dc', family: 'neutros' },
	petroleo: { name: 'Azul-petróleo', hex: '#2f4c53', family: 'azuis' },
	preto: { name: 'Preto', hex: '#1d1b1a', family: 'preto' },
	floral: { name: 'Floral terracota', hex: '#c8957f', family: 'estampados' },
	cru: { name: 'Cru', hex: '#e6dccb', family: 'neutros' },
	caramelo: { name: 'Caramelo', hex: '#a6754c', family: 'terrosos' },
	rosaAntigo: { name: 'Rosa antigo', hex: '#c4a09a', family: 'rosados' },
	branco: { name: 'Branco', hex: '#f4f1ea', family: 'neutros' },
	terracota: { name: 'Terracota', hex: '#a35c42', family: 'terrosos' },
	chocolate: { name: 'Chocolate', hex: '#4a3429', family: 'terrosos' },
	linho: { name: 'Linho natural', hex: '#d8cab3', family: 'neutros' },
	salvia: { name: 'Verde-sálvia', hex: '#99a48c', family: 'verdes' },
	bege: { name: 'Bege', hex: '#c9b597', family: 'neutros' },
	jeansClaro: { name: 'Jeans claro', hex: '#9cb1c5', family: 'azuis' },
	jeansEscuro: { name: 'Jeans escuro', hex: '#3b4a61', family: 'azuis' },
	marinho: { name: 'Marinho', hex: '#232b3d', family: 'azuis' },
	musgo: { name: 'Verde-musgo', hex: '#59603f', family: 'verdes' },
	folhagem: { name: 'Folhagem terracota', hex: '#b77c5f', family: 'estampados' },
	mescla: { name: 'Cinza mescla', hex: '#9b9893', family: 'neutros' },
	camelo: { name: 'Camelo', hex: '#b0895f', family: 'terrosos' },
	rosaCha: { name: 'Rosa chá', hex: '#d8b6a6', family: 'rosados' },
	flores: { name: 'Flores do campo', hex: '#b58a6a', family: 'estampados' },
	dourado: { name: 'Dourado', hex: '#c4a05a', family: 'dourado' }
} satisfies Record<string, ProductColor>;

const CARE = {
	linho: [
		'Lavar à mão ou na máquina, em ciclo delicado e água fria',
		'Não usar alvejante',
		'Secar à sombra',
		'Passar em temperatura média, de preferência com a peça úmida'
	],
	seda: [
		'Lavar a seco',
		'Se lavar à mão, usar sabão neutro e água fria',
		'Não torcer',
		'Passar pelo avesso em temperatura baixa'
	],
	leve: [
		'Lavar na máquina em ciclo delicado',
		'Não usar alvejante',
		'Secar à sombra, em cabide',
		'Passar em temperatura baixa'
	],
	malha: [
		'Lavar na máquina em ciclo delicado',
		'Secar na horizontal',
		'Não usar secadora',
		'Passar em temperatura baixa'
	],
	trico: [
		'Lavar à mão com água fria',
		'Secar na horizontal, à sombra',
		'Não torcer nem pendurar molhado',
		'Guardar dobrado'
	],
	alfaiataria: [
		'Lavar a seco ou à mão com água fria',
		'Não usar alvejante',
		'Secar em cabide',
		'Passar em temperatura média'
	],
	jeans: [
		'Lavar pelo avesso com cores semelhantes',
		'Não usar alvejante',
		'Secar à sombra',
		'Passar em temperatura média'
	],
	couro: [
		'Limpar com pano seco e macio',
		'Evitar contato com água',
		'Guardar em saco de tecido, longe do sol',
		'Hidratar o couro a cada seis meses'
	],
	joia: [
		'Evitar contato com perfume, cremes e água',
		'Guardar separado, em saquinho de tecido',
		'Limpar com flanela seca'
	]
};

const ROUPA = ['PP', 'P', 'M', 'G', 'GG'];
const JEANS = ['36', '38', '40', '42', '44', '46'];
const UNICO = ['Único'];

export const slugify = (s: string) =>
	s
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');

type Draft = Omit<Product, 'id' | 'slug' | 'unavailable' | 'tags' | 'added' | 'sizes'> & {
	sizes?: string[];
	unavailable?: string[];
	tags?: Tag[];
};

const drafts: Draft[] = [
	{
		name: 'Vestido Midi Linho Aurora',
		category: 'vestidos',
		price: 389.9,
		colors: [C.areia, C.oliva],
		unavailable: ['PP'],
		tags: ['novo'],
		collection: 'linho',
		description:
			'Vestido midi em linho puro, com alças largas, decote reto e amarração nas costas. A saia evasê tem bolsos embutidos e cai leve no corpo.',
		details: ['Comprimento midi', 'Bolsos laterais embutidos', 'Amarração nas costas', 'Forro de algodão no busto'],
		composition: '100% linho',
		care: CARE.linho,
		fit: 'Ajustado no busto e amplo na saia. A modelo tem 1,72 m e veste P.'
	},
	{
		name: 'Vestido Longo Cetim Lua',
		category: 'vestidos',
		price: 459.9,
		colors: [C.champanhe, C.bordo],
		tags: ['mais-vendido'],
		description:
			'Vestido longo de cetim com corte enviesado, que acompanha o movimento do corpo. Alças finas reguláveis e decote levemente drapeado.',
		details: ['Corte enviesado', 'Alças reguláveis', 'Decote drapeado', 'Comprimento no tornozelo'],
		composition: '97% poliéster, 3% elastano',
		care: CARE.seda,
		fit: 'Fluido, segue o contorno do corpo. Para um caimento mais solto, escolha um tamanho acima.'
	},
	{
		name: 'Vestido Chemise Liz',
		category: 'vestidos',
		price: 329.9,
		colors: [C.offwhite, C.petroleo],
		description:
			'Chemise em viscose com botões de madrepérola, gola clássica e faixa para amarrar na cintura. Também funciona aberta, como sobreposição.',
		details: ['Abotoamento frontal', 'Faixa removível', 'Mangas que podem ser dobradas', 'Comprimento abaixo do joelho'],
		composition: '100% viscose',
		care: CARE.leve,
		fit: 'Reto e levemente amplo. Com a faixa, marca a cintura.'
	},
	{
		name: 'Vestido Tubinho Alfaiataria Clara',
		category: 'vestidos',
		price: 349.9,
		compareAt: 429.9,
		colors: [C.preto],
		unavailable: ['PP', 'GG'],
		tags: ['ultimas'],
		description:
			'Tubinho de alfaiataria com leve elasticidade, decote quadrado e zíper invisível nas costas. Vai do trabalho ao jantar sem precisar trocar.',
		details: ['Decote quadrado', 'Zíper invisível', 'Fenda traseira', 'Totalmente forrado'],
		composition: '64% poliéster, 32% viscose, 4% elastano',
		care: CARE.alfaiataria,
		fit: 'Justo ao corpo, com elasticidade que garante conforto.'
	},
	{
		name: 'Vestido Envelope Floral',
		category: 'vestidos',
		price: 299.9,
		colors: [C.floral],
		tags: ['novo'],
		collection: 'primavera',
		description:
			'Vestido transpassado com estampa floral exclusiva, mangas curtas bufantes e amarração lateral. Ajusta na cintura sem apertar.',
		details: ['Estampa exclusiva', 'Modelagem transpassada', 'Mangas bufantes', 'Comprimento midi'],
		composition: '100% viscose',
		care: CARE.leve,
		fit: 'Ajustável pela amarração. Veste bem diferentes tipos de corpo.'
	},
	{
		name: 'Vestido Tricô Canelado Serra',
		category: 'vestidos',
		price: 419.9,
		colors: [C.cru, C.caramelo],
		collection: 'inverno',
		description:
			'Vestido longo em tricô canelado, gola alta e mangas compridas. Pensado para o frio daqui: aquece sem pesar.',
		details: ['Gola alta', 'Mangas longas', 'Tricô canelado', 'Comprimento midi longo'],
		composition: '50% algodão, 40% acrílico, 10% lã',
		care: CARE.trico,
		fit: 'Acompanha o corpo sem marcar. A malha cede um pouco com o uso.'
	},
	{
		name: 'Camisa Seda Helena',
		category: 'blusas',
		price: 289.9,
		colors: [C.offwhite, C.rosaAntigo],
		tags: ['mais-vendido'],
		description:
			'Camisa de seda com toque frio e brilho discreto. Gola padre, punhos com dois botões e barra arredondada.',
		details: ['Gola padre', 'Punhos com dois botões', 'Barra arredondada', 'Botões forrados'],
		composition: '100% seda',
		care: CARE.seda,
		fit: 'Levemente solta. Fica bonita por dentro ou por fora da calça.'
	},
	{
		name: 'Blusa Laise Antonia',
		category: 'blusas',
		price: 219.9,
		colors: [C.branco],
		tags: ['novo'],
		collection: 'primavera',
		description:
			'Blusa em laise bordada, mangas três-quartos levemente bufantes e decote canoa. Forrada no corpo.',
		details: ['Laise bordada', 'Decote canoa', 'Mangas três-quartos', 'Forro no corpo'],
		composition: '100% algodão',
		care: CARE.leve,
		fit: 'Solta no corpo, com elástico suave nos punhos.'
	},
	{
		name: 'Regata Tricô Fio Fino',
		category: 'blusas',
		price: 149.9,
		colors: [C.preto, C.areia, C.terracota],
		description:
			'Regata de tricô em fio fino, canelada e justa. Fica ótima sozinha ou por baixo de blazer e cardigan.',
		details: ['Tricô canelado', 'Alças largas', 'Decote redondo', 'Comprimento na cintura'],
		composition: '70% viscose, 30% poliamida',
		care: CARE.trico,
		fit: 'Justa ao corpo. Se preferir mais folga, escolha um tamanho acima.'
	},
	{
		name: 'Body Gola Alta Malha',
		category: 'blusas',
		price: 169.9,
		colors: [C.preto, C.chocolate],
		description:
			'Body de malha canelada com gola alta e fechamento por colchetes. Fica liso por baixo de calças e saias de cintura alta.',
		details: ['Gola alta', 'Mangas longas', 'Fechamento por colchetes', 'Malha canelada'],
		composition: '92% viscose, 8% elastano',
		care: CARE.malha,
		fit: 'Justo, com bastante elasticidade.'
	},
	{
		name: 'Camisa Linho Oversized Marina',
		category: 'blusas',
		price: 259.9,
		compareAt: 319.9,
		colors: [C.linho, C.salvia],
		collection: 'linho',
		description:
			'Camisa oversized em linho lavado, ombro caído e bolso no peito. Fica bonita amassada, do jeito que linho tem que ser.',
		details: ['Linho lavado', 'Ombro caído', 'Bolso no peito', 'Barra mais longa atrás'],
		composition: '100% linho',
		care: CARE.linho,
		fit: 'Bem ampla. Para um efeito menos oversized, escolha um tamanho abaixo.'
	},
	{
		name: 'Calça Pantalona Vitória',
		category: 'calcas',
		price: 339.9,
		colors: [C.preto, C.bege],
		tags: ['mais-vendido'],
		description:
			'Pantalona de alfaiataria com cintura alta, pregas frontais e barra larga. Alonga a silhueta e vai do salto ao tênis.',
		details: ['Cintura alta', 'Pregas frontais', 'Bolsos faca', 'Fechamento por zíper e colchete'],
		composition: '63% poliéster, 33% viscose, 4% elastano',
		care: CARE.alfaiataria,
		fit: 'Ajustada na cintura e ampla nas pernas. Comprimento para usar com salto médio.'
	},
	{
		name: 'Calça Wide Leg Jeans',
		category: 'calcas',
		price: 299.9,
		colors: [C.jeansClaro, C.jeansEscuro],
		sizes: JEANS,
		unavailable: ['46'],
		description:
			'Jeans wide leg de cintura alta, sem elastano, com lavagem suave e barra a fio. Encorpado e com caimento reto.',
		details: ['Cintura alta', 'Sem elastano', 'Barra a fio', 'Cinco bolsos'],
		composition: '100% algodão',
		care: CARE.jeans,
		fit: 'Sem elasticidade: se estiver entre dois tamanhos, escolha o maior.'
	},
	{
		name: 'Calça Linho Flor',
		category: 'calcas',
		price: 279.9,
		colors: [C.areia, C.oliva],
		collection: 'linho',
		description:
			'Calça de linho com elástico nas costas, cordão para amarrar e pernas retas. Confortável no calor sem perder a elegância.',
		details: ['Cós com elástico nas costas', 'Cordão de amarrar', 'Bolsos laterais', 'Pernas retas'],
		composition: '100% linho',
		care: CARE.linho,
		fit: 'Reta e confortável. Comprimento no tornozelo.'
	},
	{
		name: 'Calça Cigarrete Crepe',
		category: 'calcas',
		price: 249.9,
		colors: [C.preto, C.marinho],
		description:
			'Cigarrete em crepe com elasticidade, cintura média e comprimento no tornozelo. Corte limpo, sem bolsos aparentes.',
		details: ['Cintura média', 'Zíper lateral invisível', 'Comprimento no tornozelo', 'Crepe com elastano'],
		composition: '95% poliéster, 5% elastano',
		care: CARE.alfaiataria,
		fit: 'Ajustada, afunila suavemente até o tornozelo.'
	},
	{
		name: 'Saia Midi Plissada Isadora',
		category: 'saias',
		price: 269.9,
		colors: [C.champanhe, C.musgo],
		tags: ['novo'],
		collection: 'primavera',
		description:
			'Saia midi plissada em cetim, com cós largo e elástico embutido. Faz um movimento bonito a cada passo.',
		details: ['Plissado permanente', 'Cós largo', 'Elástico embutido', 'Forro em microfibra'],
		composition: '100% poliéster',
		care: CARE.leve,
		fit: 'O cós elástico se ajusta bem à cintura.'
	},
	{
		name: 'Saia Lápis Couro Ecológico',
		category: 'saias',
		price: 289.9,
		colors: [C.preto, C.caramelo],
		description:
			'Saia lápis em couro ecológico macio, com fenda atrás e zíper lateral. Combina com tricô no inverno e regata no verão.',
		details: ['Couro ecológico', 'Fenda traseira', 'Zíper lateral', 'Comprimento no joelho'],
		composition: 'Base 100% poliéster, revestimento de poliuretano',
		care: CARE.couro,
		fit: 'Justa ao corpo. Cintura alta.'
	},
	{
		name: 'Saia Longa Fluida Estampada',
		category: 'saias',
		price: 239.9,
		colors: [C.folhagem],
		collection: 'primavera',
		description:
			'Saia longa em viscose com estampa de folhagens, cós de elástico e fenda lateral discreta.',
		details: ['Estampa exclusiva', 'Cós de elástico', 'Fenda lateral', 'Comprimento longo'],
		composition: '100% viscose',
		care: CARE.leve,
		fit: 'Fluida e confortável, com bastante movimento.'
	},
	{
		name: 'Conjunto Linho Colete e Bermuda',
		category: 'conjuntos',
		price: 459.9,
		colors: [C.areia],
		tags: ['novo'],
		collection: 'linho',
		description:
			'Colete de alfaiataria em linho com botões de coco e bermuda de cintura alta com pregas. Vendidos juntos, ficam ótimos separados.',
		details: ['Colete com botões de coco', 'Bermuda com pregas', 'Bolsos laterais', 'Peças vendidas juntas'],
		composition: '100% linho',
		care: CARE.linho,
		fit: 'Colete ajustado e bermuda levemente ampla.'
	},
	{
		name: 'Conjunto Tricô Cardigan e Saia',
		category: 'conjuntos',
		price: 529.9,
		colors: [C.cru, C.rosaAntigo],
		collection: 'inverno',
		description:
			'Cardigan curto de tricô com botões perolados e saia midi canelada no mesmo fio. Um conjunto para os dias frios de Passo Fundo.',
		details: ['Cardigan curto', 'Botões perolados', 'Saia midi canelada', 'Peças vendidas juntas'],
		composition: '55% viscose, 45% poliamida',
		care: CARE.trico,
		fit: 'Cardigan justo e saia que acompanha o corpo.'
	},
	{
		name: 'Conjunto Alfaiataria Blazer e Calça',
		category: 'conjuntos',
		price: 699.9,
		colors: [C.preto, C.offwhite],
		tags: ['mais-vendido'],
		description:
			'Blazer de corte reto com ombreira leve e calça de cintura alta no mesmo tecido. Forrado, com acabamento interno em viés.',
		details: ['Blazer forrado', 'Ombreira leve', 'Calça cintura alta', 'Peças vendidas juntas'],
		composition: '68% poliéster, 28% viscose, 4% elastano',
		care: CARE.alfaiataria,
		fit: 'Blazer reto e calça com pernas amplas.'
	},
	{
		name: 'Cardigan Tranças Serra Gaúcha',
		category: 'tricos',
		price: 359.9,
		colors: [C.cru, C.mescla],
		collection: 'inverno',
		description:
			'Cardigan amplo com pontos de trança, gola V e bolsos. Feito para ser a peça mais usada do inverno.',
		details: ['Pontos de trança', 'Gola V', 'Bolsos frontais', 'Botões de madeira'],
		composition: '60% acrílico, 30% poliamida, 10% lã',
		care: CARE.trico,
		fit: 'Amplo, para usar por cima de outras peças.'
	},
	{
		name: 'Casaco Lã Batida Clássico',
		category: 'tricos',
		price: 789.9,
		colors: [C.camelo, C.preto],
		unavailable: ['PP', 'P'],
		tags: ['ultimas'],
		collection: 'inverno',
		description:
			'Casaco longo de lã batida, com abotoamento duplo e lapela larga. Forrado em cetim, com bolsos faca.',
		details: ['Abotoamento duplo', 'Lapela larga', 'Forro de cetim', 'Comprimento abaixo do joelho'],
		composition: '60% lã, 40% poliéster. Forro 100% poliéster',
		care: CARE.alfaiataria,
		fit: 'Reto, com espaço para usar tricô por baixo.'
	},
	{
		name: 'Blazer Alfaiataria Acinturado',
		category: 'tricos',
		price: 489.9,
		colors: [C.bege, C.preto],
		description:
			'Blazer acinturado de um botão, com ombros estruturados e bolsos com lapela. Totalmente forrado.',
		details: ['Um botão', 'Ombros estruturados', 'Bolsos com lapela', 'Forrado'],
		composition: '65% poliéster, 31% viscose, 4% elastano',
		care: CARE.alfaiataria,
		fit: 'Marca a cintura. Escolha seu tamanho habitual.'
	},
	{
		name: 'Suéter Mohair Gola V',
		category: 'tricos',
		price: 319.9,
		compareAt: 389.9,
		colors: [C.rosaCha, C.cru],
		collection: 'inverno',
		description:
			'Suéter de mohair com toque felpudo e leve, gola V profunda e barras caneladas.',
		details: ['Mohair', 'Gola V profunda', 'Barras caneladas', 'Ombro levemente caído'],
		composition: '40% mohair, 35% poliamida, 25% lã',
		care: CARE.trico,
		fit: 'Levemente amplo e curto, na altura do quadril.'
	},
	{
		name: 'Bolsa Tiracolo Couro Duna',
		category: 'acessorios',
		price: 399.9,
		colors: [C.caramelo, C.preto],
		sizes: UNICO,
		tags: ['novo'],
		description:
			'Bolsa tiracolo em couro legítimo, com alça regulável, fecho magnético e bolso interno com zíper.',
		details: ['Couro bovino', '24 × 17 × 7 cm', 'Alça regulável de 110 a 130 cm', 'Ferragens douradas'],
		composition: 'Couro bovino. Forro 100% algodão',
		care: CARE.couro,
		fit: 'Cabe celular, carteira, chaves e um batom.'
	},
	{
		name: 'Lenço de Seda Estampado',
		category: 'acessorios',
		price: 129.9,
		colors: [C.flores],
		sizes: UNICO,
		description:
			'Lenço quadrado de seda com estampa de flores do campo e barra feita à mão. No pescoço, no cabelo ou na alça da bolsa.',
		details: ['Seda pura', '70 × 70 cm', 'Barra feita à mão', 'Estampa exclusiva'],
		composition: '100% seda',
		care: CARE.seda,
		fit: 'Tamanho único, 70 × 70 cm.'
	},
	{
		name: 'Cinto Couro Fivela Dourada',
		category: 'acessorios',
		price: 149.9,
		colors: [C.preto, C.caramelo],
		sizes: ['P', 'M', 'G'],
		description:
			'Cinto de couro com fivela dourada escovada. Largura de 3 cm, bom para calças e vestidos.',
		details: ['Couro bovino', 'Largura de 3 cm', 'Fivela dourada escovada', 'Cinco furos de ajuste'],
		composition: 'Couro bovino e metal',
		care: CARE.couro,
		fit: 'P: 70 a 80 cm · M: 80 a 90 cm · G: 90 a 100 cm.'
	},
	{
		name: 'Brinco Argola Banho de Ouro',
		category: 'acessorios',
		price: 89.9,
		colors: [C.dourado],
		sizes: UNICO,
		tags: ['mais-vendido'],
		description:
			'Argola média com banho de ouro 18k e textura martelada. Leve, para usar todos os dias.',
		details: ['Banho de ouro 18k', 'Diâmetro de 3 cm', 'Textura martelada', 'Fecho click'],
		composition: 'Latão com banho de ouro 18k',
		care: CARE.joia,
		fit: 'Tamanho único.'
	}
];

export const products: Product[] = drafts.map((d, i) => ({
	...d,
	id: `cm${String(i + 1).padStart(3, '0')}`,
	slug: slugify(d.name),
	sizes: d.sizes ?? ROUPA,
	unavailable: d.unavailable ?? [],
	tags: d.tags ?? [],
	// itens marcados como novos sobem na ordenação por novidade
	added: (d.tags?.includes('novo') ? 100 : 0) + i
}));

const byId = new Map(products.map((p) => [p.id, p]));
const bySlug = new Map(products.map((p) => [p.slug, p]));

export const getProduct = (id: string) => byId.get(id);
export const getProductBySlug = (slug: string) => bySlug.get(slug);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);

export const isOnSale = (p: Product) => !!p.compareAt && p.compareAt > p.price;
export const discountPercent = (p: Product) =>
	p.compareAt ? Math.round((1 - p.price / p.compareAt) * 100) : 0;

export const newest = () => [...products].sort((a, b) => b.added - a.added);
export const bestSellers = () => products.filter((p) => p.tags.includes('mais-vendido'));

export function related(p: Product, limit = 8) {
	return products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, limit);
}

// Sugestões de outras categorias para montar um look
export function completeTheLook(p: Product, limit = 4) {
	const order: CategorySlug[] =
		p.category === 'acessorios'
			? ['vestidos', 'blusas', 'calcas', 'saias']
			: ['acessorios', 'tricos', 'blusas', 'calcas', 'saias', 'vestidos'];
	const out: Product[] = [];
	const seed = Number(p.id.slice(2));
	for (const cat of order) {
		if (cat === p.category) continue;
		const pool = products.filter((x) => x.category === cat);
		if (pool.length) out.push(pool[seed % pool.length]);
		if (out.length === limit) break;
	}
	return out;
}

/* Coleções virtuais acessíveis em /loja/[slug] */
export const virtualCollections: Record<
	string,
	{ name: string; description: string; filter: (p: Product) => boolean }
> = {
	novidades: {
		name: 'Novidades',
		description: 'As peças que acabaram de chegar na loja.',
		filter: (p) => p.tags.includes('novo') || p.collection === 'primavera'
	},
	'mais-vendidas': {
		name: 'Mais vendidas',
		description: 'As preferidas das nossas clientes.',
		filter: (p) => p.tags.includes('mais-vendido')
	},
	promocoes: {
		name: 'Promoções',
		description: 'Peças selecionadas com preço especial, enquanto durarem.',
		filter: isOnSale
	},
	linho: {
		name: collections.linho.name,
		description: collections.linho.description,
		filter: (p) => p.collection === 'linho'
	},
	inverno: {
		name: collections.inverno.name,
		description: collections.inverno.description,
		filter: (p) => p.collection === 'inverno'
	}
};

export const sizeGuide = {
	roupas: {
		headers: ['Tamanho', 'Busto', 'Cintura', 'Quadril'],
		rows: [
			['PP', '80–84', '62–66', '88–92'],
			['P', '85–89', '67–71', '93–97'],
			['M', '90–94', '72–76', '98–102'],
			['G', '95–100', '77–82', '103–108'],
			['GG', '101–106', '83–88', '109–114']
		]
	},
	jeans: {
		headers: ['Numeração', 'Cintura', 'Quadril', 'Gancho'],
		rows: [
			['36', '66', '92', '27'],
			['38', '70', '96', '28'],
			['40', '74', '100', '29'],
			['42', '78', '104', '30'],
			['44', '82', '108', '31'],
			['46', '86', '112', '32']
		]
	}
};

export const looks = [
	{ n: '01', title: 'Linho ao meio-dia', tone: '#d6c4a8', items: ['cm001', 'cm026', 'cm029'] },
	{ n: '02', title: 'Seda e alfaiataria', tone: '#c9b597', items: ['cm007', 'cm012', 'cm028'] },
	{ n: '03', title: 'Domingo no parque', tone: '#c8957f', items: ['cm005', 'cm027'] },
	{ n: '04', title: 'Fim de tarde', tone: '#99a48c', items: ['cm011', 'cm014', 'cm026'] },
	{ n: '05', title: 'Jantar fora', tone: '#5c1f2a', items: ['cm002', 'cm029'] },
	{ n: '06', title: 'Escritório', tone: '#2f2a27', items: ['cm021', 'cm009'] }
];
