<template>
	<v-app-bar>
		<v-toolbar-title>Brands</v-toolbar-title>
		<template v-slot:append>
			<v-btn @click.stop="accessModule()" title="Click to reload page" icon="mdi-rotate-3d-variant" />
			<v-btn @click.stop="accessRegistration()" title="Click to register a new item" icon="mdi-plus" />
		</template>
	</v-app-bar>

	<brand-result :collection="brandListResult"
		@accessEdition="accessEdition"
		@executeExclusion="executeExclusion"
	/>

	<brand-form v-if="appStore.globalDialog"
		:form-data="brandForm"
		@executeRegistration="executeRegistration"
		@executeEdition="executeEdition"
		@closeForm="closeForm"
	/>
</template>

<script lang="js">
import brandService from "@/pages/supermarket/brand/brandService.js";
import BrandResult from "@/pages/supermarket/brand/BrandResult.vue";
import BrandForm from "@/pages/supermarket/brand/BrandForm.vue";

export default {
	name: "Brand",

	components: { BrandResult, BrandForm },

	mixins: [brandService],

	created() {
		this.accessModule();
	},
};
</script>
