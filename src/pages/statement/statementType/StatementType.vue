<template>
	<div>
		<v-app-bar color="primary" dense dark>
			<v-toolbar-title>Statement Types</v-toolbar-title>
			<v-spacer></v-spacer>

			<v-btn icon @click.stop="accessModule()" title="Click to reload page"><v-icon icon="mdi-rotate-3d-variant" /></v-btn>
			<v-btn icon @click.stop="toggleFilterField()" title="Click to search"><v-icon icon="mdi-magnify" /></v-btn>
			<v-btn icon @click.stop="accessRegistration()" title="Click to register a new location"><v-icon icon="mdi-plus" /></v-btn>
		</v-app-bar>

		<df-input-filter transition="slide-x-transition" v-if="showSearchField" @type="executeSearch" />

		<statement-type-result :collection="appStore.globalResult"
			@accessEdition="accessEdition"
			@executeExclusion="executeExclusion"
		/>

		<statement-type-form
			:statementType="appStore.globalEntity"
			:bank-list-combo="appStore.globalBankListCombo"
			:account-list-combo-source="appStore.globalAccountListComboSource"

			@executeRegistration="executeRegistration"
			@executeEdition="executeEdition"
			@cleanForm="cleanForm"
			@closeForm="closeForm"
		/>
	</div>
</template>

<script lang="js">
import statementTypeService from "@/pages/statement/statementType/statementTypeService.js";
import StatementTypeResult from "@/pages/statement/statementType/StatementTypeResult.vue";
import StatementTypeForm from "@/pages/statement/statementType/StatementTypeForm.vue";

import DfInputFilter from "@/components/df-input/InputFilter.vue";

export default {
	name: "StatementType",

	components: { StatementTypeResult, StatementTypeForm, DfInputFilter },

	mixins: [statementTypeService],

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
