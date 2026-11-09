<template>
	<v-app-bar>
		<v-toolbar-title>Product Companies</v-toolbar-title>
		<template v-slot:append>
			<v-btn @click.stop="accessModule()" title="Click to reload page" icon="mdi-rotate-3d-variant" />
		</template>
	</v-app-bar>

	<product-company-result :collection="productCompanyListResult"
		@accessEdition="accessEdition"
		@executeExclusion="executeExclusion"
	/>

	<product-company-form v-if="appStore.globalDialog"
		:form-data="productCompanyForm"
		:product-list-table="productListTable"

		@executeEdition="executeEdition"
		@closeForm="closeForm"
	/>
</template>

<script lang="js">
import productCompanyService from "@/pages/supermarket/productCompany/productCompanyService.js";
import ProductCompanyResult from "@/pages/supermarket/productCompany/ProductCompanyResult.vue";
import ProductCompanyForm from "@/pages/supermarket/productCompany/ProductCompanyForm.vue";

export default {
	name: "ProductCompany",

	components: { ProductCompanyResult, ProductCompanyForm },

	mixins: [productCompanyService],

	created() {
		this.accessModule();
	},
};
</script>
