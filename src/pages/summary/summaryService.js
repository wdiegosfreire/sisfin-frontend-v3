import { useAppStore } from '@/stores/app';

import transactionApi from "../../components/axios/transaction/transactionApi.js";

// Mixins
import format from "../../components/mixins/format.js";
import message from "../../components/mixins/message.js";

export default {
	name: "summaryService",

	mixins: [ transactionApi, message, format ],

	data() {
		return {
			periodRange: 6,
			showSearchField: false,
			balanceAccountSelected: {},
			outcomingAccountSelected: {},

			outcomingSummaryPieChart: {},
			outcomingSummaryLineChart: {},
			incomingOutcomingSummaryTableData: {},

			accountListBalanceCombo: [],
			accountListOutcomingCombo: [],

			periodRangeList: [1, 3, 4, 6, 12]
		};
	},

	methods: {
		async accessModule() {
			try {
				if (!this.appStore.globalMonth || !this.appStore.globalYear) {
					this.$_message_showError("Period not found");
					return;
				}

				let summary = {
					periodDate: new Date(this.appStore.globalYear + "-" + this.appStore.globalMonth + "-01 12:00:00"),
					periodRange: this.periodRange,
					userIdentity: this.appStore.userIdentity,
					balanceAccountIdentity: this.balanceAccountSelected.identity,
					outcomingAccountLevel: this.outcomingAccountSelected.level
				};

				const response = await this.$_transaction_post("/summary/accessModule", summary);

				this.outcomingSummaryPieChart = response.data.map.outcomingSummaryPieChart;
				this.outcomingSummaryLineChart = response.data.map.outcomingSummaryLineChart;
				this.incomingOutcomingSummaryTableData = response.data.map.incomingOutcomingSummaryTableData;
				this.accountListBalanceCombo = response.data.map.accountListBalanceCombo;
				this.accountListOutcomingCombo = response.data.map.accountListOutcomingCombo;

				if (!this.balanceAccountSelected || !this.balanceAccountSelected.identity) {
					this.balanceAccountSelected = this.accountListBalanceCombo[0];
				}

				if (!this.outcomingAccountSelected || !this.outcomingAccountSelected.level) {
					this.outcomingAccountSelected = this.accountListOutcomingCombo[0];
				}
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		}
	},

	computed: {
		appStore() {
			return useAppStore()
		},
	},
}
