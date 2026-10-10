export const store = {
	name: 'Chica Maria',
	city: 'Passo Fundo',
	state: 'RS',
	address: 'Av. Brasil Centro, 1000 — Centro',
	cep: '99010-000',
	hours: [
		['Segunda a sexta', '9h às 19h'],
		['Sábado', '9h às 13h']
	],
	whatsapp: '(54) 99999-0000',
	email: 'contato@chicamaria.com.br',
	instagram: '@chicamaria'
};

export const FREE_SHIPPING_FROM = 399;
export const PIX_DISCOUNT = 0.05;
export const MAX_INSTALLMENTS = 6;
export const MIN_INSTALLMENT = 50;

export const coupons: Record<string, { label: string; percent: number }> = {
	BEMVINDA10: { label: '10% na primeira compra', percent: 0.1 },
	CHICA15: { label: '15% de desconto', percent: 0.15 }
};
