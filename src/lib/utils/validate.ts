import type { Address } from '$lib/stores/auth.svelte';
import { digits, isValidCPF, isValidDate, isValidEmail } from './masks';

export type Errors<T> = Partial<Record<keyof T, string>>;

export const emptyAddress = (): Address => ({
	cep: '',
	street: '',
	number: '',
	complement: '',
	district: '',
	city: '',
	state: ''
});

export function validateAddress(a: Address): Errors<Address> {
	const e: Errors<Address> = {};
	if (digits(a.cep).length !== 8) e.cep = 'Informe um CEP válido.';
	if (a.street.trim().length < 3) e.street = 'Informe a rua.';
	if (!a.number.trim()) e.number = 'Informe o número (ou S/N).';
	if (a.district.trim().length < 2) e.district = 'Informe o bairro.';
	if (a.city.trim().length < 2) e.city = 'Informe a cidade.';
	if (!a.state) e.state = 'Selecione o estado.';
	return e;
}

export interface Personal {
	name: string;
	email: string;
	cpf: string;
	birth: string;
	phone: string;
}

export function validatePersonal(p: Personal, withEmailAndCpf = true): Errors<Personal> {
	const e: Errors<Personal> = {};
	if (p.name.trim().split(/\s+/).length < 2) e.name = 'Digite seu nome e sobrenome.';
	if (withEmailAndCpf) {
		if (!isValidEmail(p.email)) e.email = 'Digite um e-mail válido.';
		if (!isValidCPF(p.cpf)) e.cpf = 'CPF inválido. Confira os números.';
	}
	if (!isValidDate(p.birth)) e.birth = 'Use o formato DD/MM/AAAA.';
	if (digits(p.phone).length < 10) e.phone = 'Informe um telefone com DDD.';
	return e;
}

export function validatePassword(pass: string, confirm: string) {
	const e: { password?: string; confirm?: string } = {};
	if (pass.length < 8) e.password = 'A senha precisa ter pelo menos 8 caracteres.';
	else if (!/\d/.test(pass) || !/[A-Za-z]/.test(pass)) e.password = 'Use letras e números.';
	if (confirm !== pass) e.confirm = 'As senhas não conferem.';
	return e;
}

/** Leva o foco ao primeiro campo com erro. */
export function focusFirstError(root: ParentNode = document) {
	requestAnimationFrame(() => {
		const el = root.querySelector<HTMLElement>('[aria-invalid="true"]');
		el?.focus({ preventScroll: true });
		el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
	});
}

export function safeRedirect(target: string | null, fallback: string) {
	return target && target.startsWith('/') && !target.startsWith('//') ? target : fallback;
}
