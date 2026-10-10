import { MAX_INSTALLMENTS, MIN_INSTALLMENT, PIX_DISCOUNT } from '$lib/data/store';

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const longDate = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
const shortDate = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
const monthYear = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' });

export const money = (v: number) => brl.format(v);
export const dateLong = (ts: number) => longDate.format(ts);
export const dateShort = (ts: number) => shortDate.format(ts);
export const dateMonthYear = (ts: number) => monthYear.format(ts);

export function installments(value: number) {
	const n = Math.max(1, Math.min(MAX_INSTALLMENTS, Math.floor(value / MIN_INSTALLMENT)));
	return { n, value: value / n };
}

export const pixPrice = (v: number) => v * (1 - PIX_DISCOUNT);

export function addBusinessDays(from: number, days: number) {
	const d = new Date(from);
	let added = 0;
	while (added < days) {
		d.setDate(d.getDate() + 1);
		const wd = d.getDay();
		if (wd !== 0 && wd !== 6) added++;
	}
	return d.getTime();
}

export const normalize = (s: string) =>
	s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Luminância relativa aproximada (0–1) de uma cor hexadecimal. */
export function luminance(hex: string) {
	const n = parseInt(hex.slice(1), 16);
	const r = (n >> 16) & 255;
	const g = (n >> 8) & 255;
	const b = n & 255;
	return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}
