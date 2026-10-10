/**
 * Hash da senha para o protótipo (as contas ficam só no navegador).
 * Usa SHA-256 quando disponível; em contexto não seguro (http fora do localhost)
 * cai para FNV-1a, suficiente para a simulação.
 */
export async function hashPassword(password: string, salt: string) {
	const input = `${salt}:${password}`;
	if (globalThis.crypto?.subtle) {
		const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
		return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');
	}
	let h = 0x811c9dc5;
	for (let i = 0; i < input.length; i++) {
		h ^= input.charCodeAt(i);
		h = Math.imul(h, 0x01000193);
	}
	return `fnv-${(h >>> 0).toString(16)}`;
}
