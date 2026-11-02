<template>
	<v-app-bar>
		<v-toolbar-title>Product Categories</v-toolbar-title>
		<template v-slot:append>
			<v-btn @click.stop="accessModule()" title="Click to reload page" icon="mdi-rotate-3d-variant" />
			<v-btn @click.stop="accessRegistration()" title="Click to register a new item" icon="mdi-plus" />
		</template>
	</v-app-bar>

	<product-category-result :collection="productCategoryListResult"
		@accessEdition="accessEdition"
		@executeExclusion="executeExclusion"
	/>

	<product-category-form v-if="appStore.globalDialog"
		:form-data="productCategoryForm"
		@executeRegistration="executeRegistration"
		@executeEdition="executeEdition"
		@closeForm="closeForm"
	/>
</template>

<script lang="js">
import productCategoryService from "@/pages/supermarket/productCategory/productCategoryService.js";
import ProductCategoryResult from "@/pages/supermarket/productCategory/ProductCategoryResult.vue";
import ProductCategoryForm from "@/pages/supermarket/productCategory/ProductCategoryForm.vue";

export default {
	name: "ProductCategory",

	components: { ProductCategoryResult, ProductCategoryForm },

	mixins: [productCategoryService],

	created() {
		this.accessModule();
	},
};
</script>
