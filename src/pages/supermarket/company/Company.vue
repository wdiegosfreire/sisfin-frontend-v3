<template>
	<v-app-bar>
		<v-toolbar-title>Companies</v-toolbar-title>
		<template v-slot:append>
			<v-btn @click.stop="accessModule()" title="Click to reload page" icon="mdi-rotate-3d-variant" />
			<v-btn @click.stop="accessRegistration()" title="Click to register a new item" icon="mdi-plus" />
		</template>
	</v-app-bar>

	<company-result :collection="companyListResult"
		@accessEdition="accessEdition"
		@executeExclusion="executeExclusion"
	/>

	<company-form v-if="appStore.globalDialog"
		:form-data="companyForm"
		@executeRegistration="executeRegistration"
		@executeEdition="executeEdition"
		@closeForm="closeForm"
	/>
</template>

<script lang="js">
import companyService from "@/pages/supermarket/company/companyService.js";
import CompanyResult from "@/pages/supermarket/company/CompanyResult.vue";
import CompanyForm from "@/pages/supermarket/company/CompanyForm.vue";

export default {
	name: "Company",

	components: { CompanyResult, CompanyForm },

	mixins: [companyService],

	created() {
		this.accessModule();
	},
};
</script>
