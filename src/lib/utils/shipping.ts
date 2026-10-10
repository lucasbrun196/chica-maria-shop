import { FREE_SHIPPING_FROM } from '$lib/data/store';
import { digits } from './masks';

export interface ShippingOption {
	id: 'retirada' | 'motoboy' | 'pac' | 'sedex';
	label: string;
	detail: string;
	price: number;
	days: number;
}

/** Cotação simulada a partir do CEP. Passo Fundo: 99000-000 a 99099-999. */
export function quoteShipping(cep: string, subtotal: number): ShippingOption[] {
	const d = digits(cep);
	if (d.length !== 8) return [];
	const n = Number(d);
	const passoFundo = n >= 99000000 && n <= 99099999;
	const rs = n >= 90000000 && n <= 99999999;
	const sulSudeste = n >= 1000000 && n <= 89999999 && !(n >= 40000000 && n <= 79999999);
	const free = subtotal >= FREE_SHIPPING_FROM;

	const base = rs ? 19.9 : sulSudeste ? 29.9 : 39.9;
	const pacDays = rs ? 4 : sulSudeste ? 7 : 10;

	const options: ShippingOption[] = [
		{
			id: 'retirada',
			label: 'Retirar na loja',
			detail: 'Av. Brasil Centro, Passo Fundo · pronto em 1 dia útil',
			price: 0,
			days: 1
		}
	];
	if (passoFundo) {
		options.push({
			id: 'motoboy',
			label: 'Entrega local',
			detail: 'Motoboy em Passo Fundo · até 1 dia útil',
			price: free ? 0 : 12.9,
			days: 1
		});
	}
	options.push(
		{
			id: 'pac',
			label: 'PAC',
			detail: `Correios · até ${pacDays} dias úteis`,
			price: free ? 0 : base,
			days: pacDays
		},
		{
			id: 'sedex',
			label: 'SEDEX',
			detail: `Correios · até ${Math.max(2, Math.ceil(pacDays / 2.5))} dias úteis`,
			price: Math.ceil(base * 1.85) - 0.1,
			days: Math.max(2, Math.ceil(pacDays / 2.5))
		}
	);
	return options;
}
