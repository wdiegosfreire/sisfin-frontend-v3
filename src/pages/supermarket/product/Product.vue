<template>
	<v-app-bar>
		<v-toolbar-title>Products</v-toolbar-title>
		<template v-slot:append>
			<v-btn @click.stop="accessModule()" title="Click to reload page" icon="mdi-rotate-3d-variant" />
			<v-btn @click.stop="accessRegistration()" title="Click to register a new item" icon="mdi-plus" />
		</template>
	</v-app-bar>

	<product-result :collection="productListResult"
		@accessEdition="accessEdition"
		@executeExclusion="executeExclusion"
	/>

	<product-form v-if="appStore.globalDialog"
		:form-data="productForm"
		:brand-list-combo="brandListCombo"
		:product-category-list-combo="productCategoryListCombo"
		:measurement-unit-list-combo="measurementUnitListCombo"

		@executeRegistration="executeRegistration"
		@executeEdition="executeEdition"
		@closeForm="closeForm"
	/>
</template>

<script lang="js">
import productService from "@/pages/supermarket/product/productService.js";
import ProductResult from "@/pages/supermarket/product/ProductResult.vue";
import ProductForm from "@/pages/supermarket/product/ProductForm.vue";

export default {
	name: "Product",

	components: { ProductResult, ProductForm },

	mixins: [productService],

	created() {
		this.accessModule();
	},
};
</script>
