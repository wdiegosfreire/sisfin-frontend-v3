<template>
	<div>
		<v-app-bar>
			<v-toolbar-title>Payment Methods</v-toolbar-title>
			<v-spacer></v-spacer>

			<v-btn @click.stop="accessModule()" title="Click to reload page" icon="mdi-rotate-3d-variant" />
			<v-btn @click.stop="toggleFilterField()" title="Click to search" icon="mdi-magnify" />
			<v-btn @click.stop="accessRegistration()" title="Click to register a new item" icon="mdi-plus" />
		</v-app-bar>

		<df-input-filter transition="slide-x-transition" v-if="showSearchField" @type="executeSearch" />

		<payment-method-result :collection="appStore.globalResult"
			@accessEdition="accessEdition"
			@executeExclusion="executeExclusion"
		/>

		<payment-method-form v-if="appStore.globalDialog"
			:payment-method="appStore.globalEntity"
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
