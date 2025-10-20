<template>
	<div>
		<v-app-bar color="primary" dense dark>
			<v-toolbar-title>Summary</v-toolbar-title>
			<v-spacer></v-spacer>

			<v-btn icon @click.stop="accessModule()" title="Click to reload page"><df-icon icon="fa-arrows-rotate" size="lg" /></v-btn>
		</v-app-bar>

		<df-period :month="month" :year="year" @periodChange="periodChange"></df-period>
		<df-grid>
			<v-autocomplete @update:modelValue="periodRangeUpdate" v-model="periodRange" label="Period Range" :items="periodRangeList" />
		</df-grid>

		<v-card class="mb-3">
			<v-card-title>Incoming & Outcoming</v-card-title>
			<v-card-text class="text-left">
				<df-grid>
					<v-autocomplete
						return-object
						v-model="balanceAccountSelected"
						label="Balance Account"
						item-value="identity"
						no-data-text="No data found"
						:item-title="traceAccount"
						:items="accountListBalanceCombo"
						@change="accessModule"
					/>
				</df-grid>

				<df-grid class="mb-3">
					<v-card v-for="(label, index) in incomingOutcomingSummaryTableData.labels" :key="index" elevation="8">
						<v-card-title class="text-h5">{{ label }}</v-card-title>
						<v-table dense>
							<tbody>
								<tr v-for="data in incomingOutcomingSummaryTableData.datasets" :key="data.label">
									<td class="pr-0" style="width: 1px;">{{ data.identifier }}.</td>
									<td>{{ data.label }}</td>
									<td class="text-right">{{ currency(data.data[index]) }}</td>
									<td class="pl-0" style="width: 1px;"><df-icon :icon="data.icon" size="1x" /></td>
								</tr>
							</tbody>
						</v-table>
					</v-card>
				</df-grid>
			</v-card-text>
		</v-card>

		<v-card>
			<v-card-title>Outcomming by Account</v-card-title>
			<v-card-text class="text-left">
				<df-grid>
					<v-autocomplete @change="accessModule" v-model="outcomingAccountSelected" return-object label="Outcoming Account" item-title="name" item-value="level" :items="accountListOutcomingCombo" no-data-text="No data found">
						<template v-slot:selection="{ item }">{{ traceAccount(item) }}</template>
						<template v-slot:item="{ item }">{{ traceAccount(item) }}</template>
					</v-autocomplete>
				</df-grid>

				<df-grid class="mb-6">
					<v-card v-for="(mapData, mapKey) in outcomingSummaryPieChart" :key="mapKey" elevation="8">
						<v-card-title class="text-h5">{{ mapKey }}</v-card-title>
						<!-- <pie-chart :chartData="mapData" /> -->
					</v-card>
				</df-grid>

				<df-grid>
					<!-- <line-chart :chartData="outcomingSummaryLineChart" /> -->
				</df-grid>
			</v-card-text>
		</v-card>
	</div>
</template>

<script>
import { useAppStore } from '@/stores/app';

import summaryService from "./summaryService.js";

import DfGrid from "../../components/grid/Grid.vue";
import DfIcon from "../../components/df-icon/Icon.vue";
import DfPeriod from "../../components/df-period/Period.vue";

import message from "../../components/mixins/message.js";

import PieChart from '../../components/df-chart/Pie.vue';
// import LineChart from '../../components/df-chart/Line.vue';

import { currency, traceAccount } from '@/utils/filters.js'

export default {
	name: "Summary",

	components: { DfGrid, DfIcon, PieChart, DfPeriod},
	// components: { DfGrid, DfIcon, PieChart, LineChart , DfPeriod, DfInputFilter },

	mixins: [ summaryService, message ],

	data() {
		return {
			month: "",
			year: ""
		};
	},

	methods: {
		currency,
		traceAccount,

		periodChange(month, year) {
			this.month = month;
			this.year = year;

			if (this.month && this.year && this.year.length == 4) {
				this.appStore.setGlobalMonth(this.month);
				this.appStore.setGlobalYear(this.year);

				this.accessModule();
			}
		},

		periodRangeUpdate(newValue) {
			this.periodRange = newValue;
			this.accessModule();
		},

		chartInstance(chart) {
			this.chart = chart;
		}
	},

	computed: {
		appStore() {
			return useAppStore()
		},
	},

	created() {
		this.appStore.setGlobalEntity({
			identity: null,
			description: null,
			location: {},
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
}
</script>
