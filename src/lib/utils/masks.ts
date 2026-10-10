export const digits = (v: string) => v.replace(/\D/g, '');

export function maskCPF(v: string) {
	const d = digits(v).slice(0, 11);
	return d
		.replace(/(\d{3})(\d)/, '$1.$2')
		.replace(/(\d{3})(\d)/, '$1.$2')
		.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function maskPhone(v: string) {
	const d = digits(v).slice(0, 11);
	if (!d.length) return '';
	if (d.length <= 2) return `(${d}`;
	if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
	if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
	return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function maskCEP(v: string) {
	const d = digits(v).slice(0, 8);
	return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

export function maskDate(v: string) {
	const d = digits(v).slice(0, 8);
	if (d.length <= 2) return d;
	if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
	return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

export function maskCard(v: string) {
	const d = digits(v).slice(0, 16);
	return d.replace(/(\d{4})(?=\d)/g, '$1 ');
}

export function maskExpiry(v: string) {
	const d = digits(v).slice(0, 4);
	return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

export const maskCVV = (v: string) => digits(v).slice(0, 4);
export const maskNumber = (v: string) => v.replace(/[^\dA-Za-z\s/-]/g, '').slice(0, 10);

export function isValidCPF(v: string) {
	const d = digits(v);
	if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
	const calc = (len: number) => {
		let sum = 0;
		for (let i = 0; i < len; i++) sum += Number(d[i]) * (len + 1 - i);
		const r = (sum * 10) % 11;
		return r === 10 ? 0 : r;
	};
	return calc(9) === Number(d[9]) && calc(10) === Number(d[10]);
}

export const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

export function isValidDate(v: string) {
	const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v);
	if (!m) return false;
	const [, dd, mm, yyyy] = m.map(Number);
	const date = new Date(yyyy, mm - 1, dd);
	const age = (Date.now() - date.getTime()) / (365.25 * 864e5);
	return date.getDate() === dd && date.getMonth() === mm - 1 && age >= 14 && age < 110;
}

export function isValidExpiry(v: string) {
	const m = /^(\d{2})\/(\d{2})$/.exec(v);
	if (!m) return false;
	const month = Number(m[1]);
	const year = 2000 + Number(m[2]);
	if (month < 1 || month > 12) return false;
	const now = new Date();
	return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
}

export function cardBrand(v: string) {
	const d = digits(v);
	if (/^(4011|4312|4389|4514|4576|5041|5066|5067|509|6277|6362|6363|650|6516|6550)/.test(d)) return 'Elo';
	if (/^(606282|3841)/.test(d)) return 'Hipercard';
	if (/^3[47]/.test(d)) return 'American Express';
	if (/^(5[1-5]|2[2-7])/.test(d)) return 'Mastercard';
	if (/^4/.test(d)) return 'Visa';
	return '';
}

/** 0 a 4 */
export function passwordStrength(p: string) {
	let s = 0;
	if (p.length >= 8) s++;
	if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++;
	if (/\d/.test(p)) s++;
	if (/[^A-Za-z0-9]/.test(p) || p.length >= 12) s++;
	return s;
}
