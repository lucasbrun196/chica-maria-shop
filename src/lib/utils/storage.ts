import { browser } from '$app/environment';

export function read<T>(key: string, fallback: T): T {
	if (!browser) return fallback;
	try {
		const raw = localStorage.getItem(key);
		return raw ? (JSON.parse(raw) as T) : fallback;
	} catch {
		return fallback;
	}
}

export function write(key: string, value: unknown) {
	if (!browser) return;
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {
		/* armazenamento cheio ou bloqueado: segue sem persistir */
	}
}

export function remove(key: string) {
	if (!browser) return;
	try {
		localStorage.removeItem(key);
	} catch {
		/* noop */
	}
}
