import { digits } from './masks';

export interface CepResult {
	street: string;
	district: string;
	city: string;
	state: string;
}

const cache = new Map<string, CepResult | null>();

/** Busca de endereço pelo CEP (ViaCEP). Falha silenciosamente: o usuário preenche à mão. */
export async function lookupCep(cep: string): Promise<CepResult | null> {
	const d = digits(cep);
	if (d.length !== 8) return null;
	if (cache.has(d)) return cache.get(d)!;
	const ctrl = new AbortController();
	const timer = setTimeout(() => ctrl.abort(), 4000);
	try {
		const res = await fetch(`https://viacep.com.br/ws/${d}/json/`, { signal: ctrl.signal });
		const data = await res.json();
		const out: CepResult | null = data.erro
			? null
			: { street: data.logradouro, district: data.bairro, city: data.localidade, state: data.uf };
		cache.set(d, out);
		return out;
	} catch {
		return null;
	} finally {
		clearTimeout(timer);
	}
}

export const UFS = [
	'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
	'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'SC', 'SP', 'SE', 'TO'
];
