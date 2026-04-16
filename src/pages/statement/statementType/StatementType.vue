<template>
	<div>
		<v-app-bar>
			<v-toolbar-title>Statement Types</v-toolbar-title>
			<v-spacer></v-spacer>

			<v-btn @click.stop="accessModule()" title="Click to reload page" icon="mdi-rotate-3d-variant" />
			<v-btn @click.stop="toggleFilterField()" title="Click to search" icon="mdi-magnify" />
			<v-btn @click.stop="accessRegistration()" title="Click to register a new item" icon="mdi-plus" />
		</v-app-bar>

		<df-input-filter transition="slide-x-transition" v-if="showSearchField" @type="executeSearch" />

		<statement-type-result :collection="appStore.globalResult"
			@accessEdition="accessEdition"
			@executeExclusion="executeExclusion"
		/>

		<statement-type-form v-if="appStore.globalDialog"
			:form-data="appStore.globalEntity"
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
