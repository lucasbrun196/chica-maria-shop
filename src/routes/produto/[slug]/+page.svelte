<script lang="ts">
	import ProductView from '$lib/components/ProductView.svelte';

	let { data } = $props();
</script>

<!-- recria a página ao navegar entre produtos, zerando cor, tamanho e quantidade -->
{#key data.product.id}
	<ProductView product={data.product} />
{/key}
