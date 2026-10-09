<template>
	<v-app-bar>
		<v-toolbar-title>Payment Methods</v-toolbar-title>
		<template v-slot:append>
			<v-btn @click.stop="accessModule()" title="Click to reload page" icon="mdi-rotate-3d-variant" />
			<v-btn @click.stop="accessRegistration()" title="Click to register a new item" icon="mdi-plus" />
		</template>
	</v-app-bar>

	<payment-method-result :collection="appStore.globalResult"
		@accessEdition="accessEdition"
		@executeExclusion="executeExclusion"
	/>

	<payment-method-form v-if="appStore.globalDialog"
		:form-data="appStore.globalEntity"
		@executeRegistration="executeRegistration"
		@executeEdition="executeEdition"
		@cleanForm="cleanForm"
		@closeForm="closeForm"
	/>
</template>

<script lang="js">
import paymentMethodService from "@/pages/transaction/paymentMethod/paymentMethodService.js";
import PaymentMethodResult from "@/pages/transaction/paymentMethod/PaymentMethodResult.vue";
import PaymentMethodForm from "@/pages/transaction/paymentMethod/PaymentMethodForm.vue";

export default {
	name: "PaymentMethod",

	components: { PaymentMethodResult, PaymentMethodForm },

	mixins: [paymentMethodService],

	created() {
		this.accessModule();
	},
};
</script>
