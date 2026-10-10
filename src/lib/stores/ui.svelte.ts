interface Toast {
	id: number;
	text: string;
}

class UIStore {
	searchOpen = $state(false);
	menuOpen = $state(false);
	modalOpen = $state(false);
	toasts = $state<Toast[]>([]);
	scrollY = $state(0);
	scrollingDown = $state(false);
	#id = 0;

	toast(text: string, ms = 3200) {
		const id = ++this.#id;
		this.toasts = [...this.toasts.slice(-2), { id, text }];
		setTimeout(() => {
			this.toasts = this.toasts.filter((t) => t.id !== id);
		}, ms);
	}

	closeAll() {
		this.searchOpen = false;
		this.menuOpen = false;
	}
}

export const ui = new UIStore();
