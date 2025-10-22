<template>
	<div>
		<v-app-bar color="primary" dense dark>
			<v-toolbar-title>Payment Methods</v-toolbar-title>
			<v-spacer></v-spacer>

			<v-btn icon @click.stop="accessModule()" title="Click to reload page"><v-icon icon="mdi-rotate-3d-variant" /></v-btn>
			<v-btn icon @click.stop="toggleFilterField()" title="Click to search"><v-icon icon="mdi-magnify" /></v-btn>
			<v-btn icon @click.stop="accessRegistration()" title="Click to register a new location"><v-icon icon="mdi-plus" /></v-btn>
		</v-app-bar>

		<df-input-filter transition="slide-x-transition" v-if="showSearchField" @type="executeSearch" />

		<payment-method-result :collection="appStore.globalResult"
			@accessEdition="accessEdition"
			@executeExclusion="executeExclusion"
		/>

		<payment-method-form :payment-method="appStore.globalEntity"
			@executeRegistration="executeRegistration"
			@executeEdition="executeEdition"
			@cleanForm="cleanForm"
			@closeForm="closeForm"
		/>
	</div>
</template>

<script lang="js">
import paymentMethodService from "@/pages/paymentMethod/paymentMethodService.js";
import PaymentMethodResult from "@/pages/paymentMethod/PaymentMethodResult.vue";
import PaymentMethodForm from "@/pages/paymentMethod/PaymentMethodForm.vue";

import DfInputFilter from "@/components/df-input/InputFilter.vue";

export default {
	name: "PaymentMethod",

	components: { PaymentMethodResult, PaymentMethodForm, DfInputFilter },

	mixins: [paymentMethodService],

	methods: {
		toggleFilterField() {
			if (this.showSearchField)
				this.executeSearch();

			this.showSearchField = !this.showSearchField;
		}
	},

	created() {
		this.accessModule();
	},
};
</script>
