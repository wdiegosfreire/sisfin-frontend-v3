<template>
	<div>
		<v-app-bar color="primary" dense dark>
			<v-toolbar-title>Banks</v-toolbar-title>
			<v-spacer></v-spacer>

			<v-btn icon @click.stop="accessModule()" title="Click to reload page"><v-icon icon="mdi-rotate-3d-variant" /></v-btn>
			<v-btn icon @click.stop="toggleFilterField()" title="Click to search"><v-icon icon="mdi-magnify" /></v-btn>
			<v-btn icon @click.stop="accessRegistration()" title="Click to register a new location"><v-icon icon="mdi-plus" /></v-btn>
		</v-app-bar>

		<df-input-filter transition="slide-x-transition" v-if="showSearchField" @type="executeSearch" />

		<bank-result :collection="appStore.globalResult"
			@accessEdition="accessEdition"
			@executeExclusion="executeExclusion"
		/>

		<bank-form :bank="appStore.globalEntity"
			@executeRegistration="executeRegistration"
			@executeEdition="executeEdition"
			@cleanForm="cleanForm"
			@closeForm="closeForm"
		/>
	</div>
</template>

<script lang="js">
import bankService from "@/pages/statement/bank/bankService.js";
import BankResult from "@/pages/statement/bank/BankResult.vue";
import BankForm from "@/pages/statement/bank/BankForm.vue";

import DfIcon from "@/components/df-icon/Icon.vue";
import DfInputFilter from "@/components/df-input/InputFilter.vue";

export default {
	name: "Bank",

	components: { BankResult, BankForm, DfInputFilter, DfIcon },

	mixins: [bankService],

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
