/* Códigos visuais da simulação de pagamento (não são escaneáveis). */

function prng(seed: string) {
	let h = 2166136261;
	for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
	return () => {
		h = Math.imul(h ^ (h >>> 15), 2246822507);
		h = Math.imul(h ^ (h >>> 13), 3266489909);
		return ((h ^= h >>> 16) >>> 0) / 4294967296;
	};
}

/** Caminho SVG de uma grade 29×29 com cara de QR Code. */
export function qrPath(seed: string, size = 29) {
	const rnd = prng(seed);
	const finder = (x: number, y: number) => {
		const inBox = (ox: number, oy: number) => x >= ox && x < ox + 7 && y >= oy && y < oy + 7;
		for (const [ox, oy] of [
			[0, 0],
			[size - 7, 0],
			[0, size - 7]
		]) {
			if (inBox(ox, oy)) {
				const dx = x - ox;
				const dy = y - oy;
				const ring = dx === 0 || dx === 6 || dy === 0 || dy === 6;
				const core = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
				return ring || core ? 1 : 0;
			}
			// margem branca em volta dos marcadores
			if (x >= ox - 1 && x <= ox + 7 && y >= oy - 1 && y <= oy + 7) return 0;
		}
		return -1;
	};
	let d = '';
	for (let y = 0; y < size; y++) {
		for (let x = 0; x < size; x++) {
			const f = finder(x, y);
			const on = f === -1 ? rnd() > 0.52 : f === 1;
			if (on) d += `M${x} ${y}h1v1h-1z`;
		}
	}
	return d;
}

export function pixCode(orderId: string, total: number) {
	const value = total.toFixed(2);
	const rnd = prng(orderId);
	const key = Array.from({ length: 32 }, () => '0123456789abcdef'[Math.floor(rnd() * 16)]).join('');
	return `00020126580014BR.GOV.BCB.PIX0136${key.slice(0, 8)}-${key.slice(8, 12)}-${key.slice(12, 16)}-${key.slice(16, 20)}-${key.slice(20)}52040000530398654${String(value.length).padStart(2, '0')}${value}5802BR5911CHICA MARIA6011PASSO FUNDO62100506${orderId}6304${key.slice(0, 4).toUpperCase()}`;
}

export function boletoLine(orderId: string, total: number) {
	const rnd = prng(orderId + 'b');
	const n = (len: number) => Array.from({ length: len }, () => Math.floor(rnd() * 10)).join('');
	const cents = String(Math.round(total * 100)).padStart(10, '0');
	return `34191.${n(5)} ${n(5)}.${n(6)} ${n(5)}.${n(6)} ${n(1)} ${n(4)}${cents}`;
}

/** Barras de largura variável, como um código de barras. */
export function barcodePath(seed: string, height = 60) {
	const rnd = prng(seed);
	let x = 0;
	let d = '';
	while (x < 300) {
		const w = 1 + Math.floor(rnd() * 3);
		d += `M${x} 0h${w}v${height}h-${w}z`;
		x += w + 1 + Math.floor(rnd() * 3);
	}
	return { d, width: x };
}
