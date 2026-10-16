<template>
	<v-app-bar>
		<v-toolbar-title>Banks</v-toolbar-title>
		<template v-slot:append>
			<v-btn @click.stop="accessModule()" title="Click to reload page" icon="mdi-rotate-3d-variant" />
			<v-btn @click.stop="accessRegistration()" title="Click to register a new item" icon="mdi-plus" />
		</template>
	</v-app-bar>

	<bank-result :collection="appStore.globalResult"
		@accessEdition="accessEdition"
		@executeExclusion="executeExclusion"
	/>

	<bank-form v-if="appStore.globalDialog"
		:form-data="appStore.globalEntity"
		@executeRegistration="executeRegistration"
		@executeEdition="executeEdition"
		@cleanForm="cleanForm"
		@closeForm="closeForm"
	/>
</template>

<script lang="js">
import bankService from "@/pages/statement/bank/bankService.js";
import BankResult from "@/pages/statement/bank/BankResult.vue";
import BankForm from "@/pages/statement/bank/BankForm.vue";

export default {
	name: "Bank",

	components: { BankResult, BankForm },

	mixins: [bankService],

	created() {
		this.accessModule();
	},
};
</script>
