<template>
	<v-app-bar>
		<v-toolbar-title>Product Properties</v-toolbar-title>
		<template v-slot:append>
			<v-btn @click.stop="accessModule()" title="Click to reload page" icon="mdi-rotate-3d-variant" />
			<v-btn @click.stop="accessRegistration()" title="Click to register a new item" icon="mdi-plus" />
		</template>
	</v-app-bar>

	<product-property-result :collection="productPropertyListResult"
		@accessEdition="accessEdition"
		@executeExclusion="executeExclusion"
	/>

	<product-property-form v-if="appStore.globalDialog"
		:form-data="productPropertyForm"
		@executeRegistration="executeRegistration"
		@executeEdition="executeEdition"
		@closeForm="closeForm"
	/>
</template>

<script lang="js">
import productPropertyService from "@/pages/supermarket/productProperty/productPropertyService.js";
import ProductPropertyResult from "@/pages/supermarket/productProperty/ProductPropertyResult.vue";
import ProductPropertyForm from "@/pages/supermarket/productProperty/ProductPropertyForm.vue";

export default {
	name: "ProductProperty",

	components: { ProductPropertyResult, ProductPropertyForm },

	mixins: [productPropertyService],

	created() {
		this.accessModule();
	},
};
</script>
