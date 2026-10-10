<script lang="ts" module>
	const paths = {
		search: '<circle cx="10.8" cy="10.8" r="6.3"/><path d="M15.5 15.5 20 20"/>',
		user: '<circle cx="12" cy="8.4" r="3.7"/><path d="M4.6 20.2c1.2-3.5 4-5.4 7.4-5.4s6.2 1.9 7.4 5.4"/>',
		heart:
			'<path d="M12 19.6s-7.3-4.4-7.3-9.7A4.1 4.1 0 0 1 12 7.4a4.1 4.1 0 0 1 7.3 2.5c0 5.3-7.3 9.7-7.3 9.7Z"/>',
		bag: '<path d="M5.4 8.4h13.2l-.9 11.8H6.3L5.4 8.4Z"/><path d="M9 8.4V7.1a3 3 0 0 1 6 0v1.3"/>',
		close: '<path d="M6 6l12 12M18 6 6 18"/>',
		menu: '<path d="M3.5 8.5h17M3.5 15.5h17"/>',
		'arrow-right': '<path d="M3.5 12h16M14.5 7l5 5-5 5"/>',
		'arrow-left': '<path d="M20.5 12h-16M9.5 7l-5 5 5 5"/>',
		'arrow-up': '<path d="M12 20.5v-16M7 9.5l5-5 5 5"/>',
		'chevron-down': '<path d="m6 9.5 6 6 6-6"/>',
		'chevron-right': '<path d="m9.5 6 6 6-6 6"/>',
		'chevron-left': '<path d="m14.5 6-6 6 6 6"/>',
		plus: '<path d="M12 5v14M5 12h14"/>',
		minus: '<path d="M5 12h14"/>',
		check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
		truck:
			'<path d="M2.8 6.5h11v9.8h-11zM13.8 10h4l2.6 3v3.3h-6.6"/><circle cx="6.8" cy="17.3" r="1.7"/><circle cx="16.8" cy="17.3" r="1.7"/>',
		store: '<path d="M4 10v10h16V10M3 10l1.7-5h14.6L21 10H3ZM9.5 20v-5.5h5V20"/>',
		lock: '<rect x="5" y="10.5" width="14" height="10" rx="1"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
		return: '<path d="M4.5 9.5h11a4.5 4.5 0 0 1 0 9H8"/><path d="m8 5.5-3.5 4 3.5 4"/>',
		card: '<rect x="3" y="5.5" width="18" height="13" rx="1"/><path d="M3 9.8h18M6.5 15h4"/>',
		filter: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
		trash: '<path d="M4.5 7h15M9.5 7V4.8h5V7M6.5 7l.8 12.5h9.4L17.5 7"/>',
		ruler: '<path d="M3 15.5 15.5 3 21 8.5 8.5 21 3 15.5Z"/><path d="m7.5 11 2 2M10.5 8l2 2M13.5 5l2 2"/>',
		pin: '<path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/>',
		clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
		phone:
			'<path d="M6.5 3.5h3l1.5 4-2 1.3a10.5 10.5 0 0 0 6.2 6.2l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z"/>',
		mail: '<rect x="3" y="5.5" width="18" height="13" rx="1"/><path d="m3.5 6.5 8.5 7 8.5-7"/>',
		instagram:
			'<rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><circle cx="12" cy="12" r="3.9"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/>',
		eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>',
		'eye-off':
			'<path d="M4 4l16 16M10 6a9.6 9.6 0 0 1 2-.2c6 0 9.5 6.2 9.5 6.2a16 16 0 0 1-2.6 3.3M6.6 7.4A15.6 15.6 0 0 0 2.5 12s3.5 6.5 9.5 6.5a9 9 0 0 0 4.4-1.1"/><path d="M9.9 10a3 3 0 0 0 4.1 4.1"/>',
		grid2: '<rect x="4" y="4" width="7" height="16"/><rect x="13" y="4" width="7" height="16"/>',
		grid3:
			'<rect x="3" y="4" width="4.6" height="16"/><rect x="9.7" y="4" width="4.6" height="16"/><rect x="16.4" y="4" width="4.6" height="16"/>',
		gift: '<rect x="4" y="9" width="16" height="11"/><path d="M3 9h18M12 9v11M12 9c-1.5-3.5-5-4-5-1.5S10 9 12 9Zm0 0c1.5-3.5 5-4 5-1.5S14 9 12 9Z"/>',
		logout: '<path d="M14 4.5H5v15h9M10 12h10M16.5 8.5 20 12l-3.5 3.5"/>',
		box: '<path d="m12 3 8.5 4.5v9L12 21l-8.5-4.5v-9L12 3Z"/><path d="m3.5 7.5 8.5 4.5 8.5-4.5M12 12v9"/>',
		edit: '<path d="M4 20h4L19 9l-4-4L4 16v4Z"/>',
		shield: '<path d="M12 3.5 19 6v5.5c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6l7-2.5Z"/><path d="m9 12 2 2 4-4"/>'
	} as const;

	export type IconName = keyof typeof paths;
</script>

<script lang="ts">
	interface Props {
		name: IconName;
		size?: number;
		stroke?: number;
		filled?: boolean;
		class?: string;
	}

	let { name, size = 20, stroke = 1.25, filled = false, class: cls = '' }: Props = $props();
</script>

<svg
	class={cls}
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill={filled ? 'currentColor' : 'none'}
	stroke="currentColor"
	stroke-width={stroke}
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
	focusable="false">{@html paths[name]}</svg
>
