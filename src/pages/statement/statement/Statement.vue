<template>
	<div>
		<v-app-bar color="primary" dense dark>
			<v-toolbar-title>Statements</v-toolbar-title>
			<v-spacer></v-spacer>

			<v-btn icon @click.stop="accessModule()" title="Click to reload page"><df-icon icon="fa-arrows-rotate" size="lg" /></v-btn>
			<v-btn icon @click.stop="accessRegistration()" title="Click to register a new statement"><df-icon icon="fa-plus" /></v-btn>
		</v-app-bar>

		<df-period :month="month" :year="year" @periodChange="periodChange"></df-period>

		<statement-result :collection="appStore.globalResult"
			@accessEdition="accessEdition"
			@executeExclusion="executeExclusion"
		/>

		<statement-form
			:statement="appStore.globalEntity"
			:bank-list-combo="appStore.globalBankListCombo"
			:location-list-combo="appStore.globalLocationListCombo"
			:account-list-combo-source="appStore.globalAccountListComboSource"
			:account-list-combo-target="appStore.globalAccountListComboTarget"
			:payment-method-list-combo="appStore.globalPaymentMethodListCombo"
			:statement-type-list-combo="appStore.globalStatementTypeListCombo"

			@executeRegistration="executeRegistration"
			@accessRegistration="accessRegistration"
			@executeEdition="executeEdition"
			@cleanForm="cleanForm"
			@closeForm="closeForm"
		/>
	</div>
</template>

<script lang="js">
import statementService from "@/pages/statement/statement/statementService.js";
import StatementResult from "@/pages/statement/statement/StatementResult.vue";
import StatementForm from "@/pages/statement/statement/StatementForm.vue";

import DfIcon from "@/components/df-icon/Icon.vue";
import DfPeriod from "@/components/df-period/Period.vue";
import DfInputFilter from "@/components/df-input/InputFilter.vue";

export default {
	name: "Statement",

	components: { StatementResult, StatementForm, DfInputFilter, DfIcon, DfPeriod },

	mixins: [statementService],

	methods: {
		periodChange(month, year) {
			this.month = month;
			this.year = year;

			if (this.month && this.year && this.year.length == 4) {
				this.appStore.setGlobalMonth(this.month);
				this.appStore.setGlobalYear(this.year);

				this.accessModule();
			}
		},
	},

	created() {
		this.appStore.setGlobalEntity({
			year: null,
			month: null,
			openingBalance: null,
			closingBalance: null,
			isClosed: false,
			statementType: {},
			statementItemList: [
				{
					identity: null,
					accountSource: {},
					accountTarget: {},
					location: {}
				}
			],
			userIdentity: null,
			statementFile: null
		});

		this.month = this.appStore.globalMonth;
		this.year = this.appStore.globalYear;

		let newDate = new Date();
		if (!this.month)
			this.month = newDate.getMonth();
		if (!this.year)
			this.year = newDate.getFullYear();

		if (this.month == 0) {
			this.month = 12;
			this.year--;
		}

		this.year = this.year + "";
		this.month = this.month.toString().padStart(2,"0");

		this.appStore.setGlobalMonth(this.month);
		this.appStore.setGlobalYear(this.year);

		this.accessModule();
	},
};
</script>
