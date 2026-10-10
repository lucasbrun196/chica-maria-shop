import { getProduct } from '$lib/data/products';
import { read, write } from '$lib/utils/storage';

const KEY = 'cm:wishlist';

class WishlistStore {
	ids = $state<string[]>([]);
	count = $derived(this.ids.length);

	load() {
		this.ids = read<string[]>(KEY, []).filter((id) => getProduct(id));
	}

	has(id: string) {
		return this.ids.includes(id);
	}

	/** Retorna true se o item passou a ser favorito. */
	toggle(id: string) {
		const added = !this.ids.includes(id);
		this.ids = added ? [id, ...this.ids] : this.ids.filter((x) => x !== id);
		write(KEY, this.ids);
		return added;
	}
}

export const wishlist = new WishlistStore();
