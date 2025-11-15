<template>
	<div>
		<v-app-bar color="primary" dense dark>
			<v-toolbar-title>Objectives</v-toolbar-title>
			<v-spacer></v-spacer>

			<v-btn icon @click.stop="accessModule()" title="Click to reload page"><v-icon icon="mdi-rotate-3d-variant" /></v-btn>
			<v-btn icon @click.stop="toggleFilterField()" title="Click to search"><v-icon icon="mdi-magnify" /></v-btn>
			<v-btn icon @click.stop="accessRegistration()" title="Click to register a new location"><v-icon icon="mdi-plus" /></v-btn>
		</v-app-bar>

		<df-period :month="month" :year="year" @periodChange="periodChange"></df-period>
		<span v-if="showSearchField">
			<df-grid>
				<v-autocomplete v-model="filter.accountSource" label="Source Account" :item-title="traceAccount" item-value="identity" :items="accountListBalanceCombo" no-data-text="No data found" clearable return-object />
				<v-autocomplete v-model="filter.location" label="Location" item-title="name" item-value="identity" :items="locationListCombo" no-data-text="No data found" clearable return-object></v-autocomplete>
			</df-grid>
			<df-grid column="fixed-2">
				<v-text-field label="Value Start" v-model.number="filter.valueStart"></v-text-field>
				<v-text-field label="Value End" v-model.number="filter.valueEnd"></v-text-field>
			</df-grid>
			<div class="mb-5 text-left">
				<v-btn width="150" @click="accessModule" class="mr-2">Filter</v-btn>
				<v-btn width="150" @click="clearFilters">Clear</v-btn>
			</div>
		</span>

		<objective-result
			:collection="appStore.globalResult"

			@accessEdition="accessEdition"
			@executeExclusion="executeExclusion"
		/>

		<objective-form
			:objective="appStore.globalEntity"
			:location-list-combo="appStore.globalLocationListCombo"
			:payment-method-list-combo="appStore.globalPaymentMethodListCombo"
			:account-list-combo-source="appStore.globalAccountListComboSource"
			:account-list-combo-target="appStore.globalAccountListComboTarget"

			@executeRegistration="executeRegistration"
			@executeEdition="executeEdition"
			@cleanForm="cleanForm"
			@closeForm="closeForm"
		/>
	</div>
</template>

<script>
import objectiveService from "./objectiveService.js";
import ObjectiveResult from "./ObjectiveResult.vue";
import ObjectiveForm from "./ObjectiveForm";

import DfGrid from "@/components/grid/Grid.vue";
import DfIcon from "@/components/df-icon/Icon.vue";
import DfPeriod from "@/components/df-period/Period.vue";

import message from "@/components/mixins/message.js";

import { traceAccount } from '@/utils/filters.js';

export default {
	name: "Objective",

	components: { ObjectiveResult, ObjectiveForm, DfGrid, DfIcon, DfPeriod },

	mixins: [ objectiveService, message ],

	data() {
		return {
			month: "",
			year: "",
		};
	},

	methods: {
		traceAccount,

		toggleFilterField() {
			if (this.showSearchField)
				this.clearFilters();

			this.showSearchField = !this.showSearchField;
		},

		periodChange(month, year) {
			this.month = month;
			this.year = year;

			if (this.month && this.year && this.year.length == 4) {
				this.appStore.setGlobalMonth(this.month);
				this.appStore.setGlobalYear(this.year);

				this.accessModule();
			}
		},

		clearFilters() {
			this.filter.accountSource = null;
			this.filter.location = null;
			this.filter.valueStart = null;
			this.filter.valueEnd = null;

			this.accessModule();
		}
	},

	created() {
		this.appStore.setGlobalEntity({
			identity: null,
			description: null,
			location: null,
			objectiveMovementList: [],
			objectiveItemList: []
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
	}
};
</script>
