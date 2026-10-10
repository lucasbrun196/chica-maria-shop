import type { Address } from './auth.svelte';
import { read, write } from '$lib/utils/storage';

export interface OrderLine {
	id: string;
	name: string;
	slug: string;
	price: number;
	size: string;
	color: string;
	tone: string;
	qty: number;
}

export type PaymentMethod = 'pix' | 'card' | 'boleto';
export type OrderStatus = 'aguardando' | 'aprovado' | 'separacao' | 'enviado' | 'entregue';

export interface Order {
	id: string;
	email: string;
	createdAt: number;
	lines: OrderLine[];
	subtotal: number;
	couponDiscount: number;
	pixDiscount: number;
	shipping: number;
	total: number;
	coupon: string | null;
	delivery: { id: string; label: string; detail: string; days: number };
	address: Address;
	recipient: string;
	payment: { method: PaymentMethod; installments?: number; brand?: string; last4?: string };
	status: OrderStatus;
}

const KEY = 'cm:orders';

class OrdersStore {
	all = $state<Order[]>([]);

	load() {
		this.all = read<Order[]>(KEY, []);
	}

	#save() {
		write(KEY, $state.snapshot(this.all));
	}

	forUser(email: string) {
		return this.all.filter((o) => o.email === email);
	}

	create(order: Omit<Order, 'id' | 'createdAt'>) {
		const id = `CM${Math.floor(100000 + Math.random() * 900000)}`;
		const full: Order = { ...order, id, createdAt: Date.now() };
		this.all = [full, ...this.all];
		this.#save();
		return full;
	}

	setStatus(id: string, status: OrderStatus) {
		const o = this.all.find((x) => x.id === id);
		if (!o) return;
		o.status = status;
		this.#save();
	}
}

export const orders = new OrdersStore();
