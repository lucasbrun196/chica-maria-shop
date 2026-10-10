import { hashPassword } from '$lib/utils/hash';
import { read, remove, write } from '$lib/utils/storage';

export interface Address {
	cep: string;
	street: string;
	number: string;
	complement: string;
	district: string;
	city: string;
	state: string;
}

export interface User {
	name: string;
	email: string;
	cpf: string;
	phone: string;
	birth: string;
	address: Address;
	newsletter: boolean;
	createdAt: number;
}

interface StoredUser extends User {
	pass: string;
}

type Result = { ok: true } | { ok: false; error: string };

const USERS = 'cm:users';
const SESSION = 'cm:session';

const users = () => read<Record<string, StoredUser>>(USERS, {});

function strip(u: StoredUser): User {
	const { pass: _pass, ...user } = u;
	return user;
}

class AuthStore {
	user = $state<User | null>(null);
	ready = $state(false);
	firstName = $derived(this.user?.name.trim().split(/\s+/)[0] ?? '');

	load() {
		const email = read<string | null>(SESSION, null);
		const stored = email ? users()[email] : undefined;
		this.user = stored ? strip(stored) : null;
		this.ready = true;
	}

	async register(data: Omit<User, 'createdAt'>, password: string): Promise<Result> {
		const all = users();
		const email = data.email.trim().toLowerCase();
		if (all[email]) return { ok: false, error: 'Já existe uma conta com este e-mail.' };
		const user: User = { ...data, email, createdAt: Date.now() };
		all[email] = { ...user, pass: await hashPassword(password, email) };
		write(USERS, all);
		write(SESSION, email);
		this.user = user;
		return { ok: true };
	}

	async login(emailRaw: string, password: string): Promise<Result> {
		const email = emailRaw.trim().toLowerCase();
		const stored = users()[email];
		if (!stored || stored.pass !== (await hashPassword(password, email))) {
			return { ok: false, error: 'E-mail ou senha incorretos.' };
		}
		write(SESSION, email);
		this.user = strip(stored);
		return { ok: true };
	}

	logout() {
		remove(SESSION);
		this.user = null;
	}

	update(patch: Partial<Omit<User, 'email' | 'cpf' | 'createdAt'>>) {
		if (!this.user) return;
		const all = users();
		const stored = all[this.user.email];
		if (!stored) return;
		all[this.user.email] = { ...stored, ...patch };
		write(USERS, all);
		this.user = strip(all[this.user.email]);
	}

	async changePassword(current: string, next: string): Promise<Result> {
		if (!this.user) return { ok: false, error: 'Sessão expirada.' };
		const all = users();
		const stored = all[this.user.email];
		if (!stored || stored.pass !== (await hashPassword(current, this.user.email))) {
			return { ok: false, error: 'A senha atual não confere.' };
		}
		stored.pass = await hashPassword(next, this.user.email);
		write(USERS, all);
		return { ok: true };
	}
}

export const auth = new AuthStore();
