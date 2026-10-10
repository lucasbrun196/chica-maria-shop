import { coupons } from '$lib/data/store';
import { getProduct } from '$lib/data/products';
import { read, write } from '$lib/utils/storage';

export interface CartLine {
	key: string;
	id: string;
	size: string;
	color: string;
	qty: number;
}

const KEY = 'cm:cart';
const COUPON_KEY = 'cm:coupon';
const MAX_QTY = 10;

class CartStore {
	lines = $state<CartLine[]>([]);
	coupon = $state<string | null>(null);
	isOpen = $state(false);

	count = $derived(this.lines.reduce((n, l) => n + l.qty, 0));
	subtotal = $derived(
		this.lines.reduce((sum, l) => sum + (getProduct(l.id)?.price ?? 0) * l.qty, 0)
	);
	couponDiscount = $derived(
		this.coupon && coupons[this.coupon] ? this.subtotal * coupons[this.coupon].percent : 0
	);

	load() {
		this.lines = read<CartLine[]>(KEY, []).filter((l) => getProduct(l.id));
		const c = read<string | null>(COUPON_KEY, null);
		this.coupon = c && coupons[c] ? c : null;
	}

	#save() {
		write(KEY, $state.snapshot(this.lines));
	}

	add(id: string, size: string, color: string, qty = 1) {
		const key = `${id}|${size}|${color}`;
		const line = this.lines.find((l) => l.key === key);
		if (line) line.qty = Math.min(MAX_QTY, line.qty + qty);
		else this.lines.unshift({ key, id, size, color, qty: Math.min(MAX_QTY, qty) });
		this.#save();
	}

	setQty(key: string, qty: number) {
		const line = this.lines.find((l) => l.key === key);
		if (!line) return;
		if (qty <= 0) return this.remove(key);
		line.qty = Math.min(MAX_QTY, qty);
		this.#save();
	}

	remove(key: string) {
		this.lines = this.lines.filter((l) => l.key !== key);
		this.#save();
	}

	clear() {
		this.lines = [];
		this.coupon = null;
		this.#save();
		write(COUPON_KEY, null);
	}

	applyCoupon(code: string): string | null {
		const c = code.trim().toUpperCase();
		if (!coupons[c]) return 'Cupom inválido ou expirado.';
		this.coupon = c;
		write(COUPON_KEY, c);
		return null;
	}

	removeCoupon() {
		this.coupon = null;
		write(COUPON_KEY, null);
	}

	open() {
		this.isOpen = true;
	}

	close() {
		this.isOpen = false;
	}
}

export const cart = new CartStore();
