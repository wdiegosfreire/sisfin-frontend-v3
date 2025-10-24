import { useAppStore } from '@/stores/app';

import transactionApi from "@/components/axios/transaction/transactionApi.js";
import message from "@/components/mixins/message.js";

import Constants from "@/plugins/Constants.js";

export default {
	name: "statementPatternService",

	mixins: [ transactionApi, message ],

	data() {
		return {
			statementPatternForm: {},
			statementPatternListResult: [],
			locationListCombo: [],
			accountListComboTarget: [],
			paymentMethodListCombo: [],
			statementTypeListCombo: [],

			showSearchField: false
		};
	},

	methods: {
		async accessModule() {
			try {
				let statementPattern = {
					userIdentity: this.appStore.userIdentity
				}

				const response = await this.$_transaction_post("/statementPattern/accessModule", statementPattern);
				this.statementPatternListResult = response.data.map.statementPatternList;
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async accessRegistration() {
			try {
				let statementPattern = {
					userIdentity: this.appStore.userIdentity
				};

				const response = await this.$_transaction_post("/statementPattern/accessRegistration", statementPattern);
				this.locationListCombo = response.data.map.locationListCombo;
				this.accountListComboTarget = response.data.map.accountListComboTarget;
				this.paymentMethodListCombo = response.data.map.paymentMethodListCombo;
				this.statementTypeListCombo = response.data.map.statementTypeListCombo;

				this.appStore.showGlobalDialog(true);
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async accessEdition(statementPattern) {
			try {
				statementPattern.userIdentity = this.appStore.userIdentity;
				const response = await this.$_transaction_post("/statementPattern/accessEdition", statementPattern);
				this.statementPatternForm = response.data.map.statementPattern;
				this.locationListCombo = response.data.map.locationListCombo;
				this.accountListComboTarget = response.data.map.accountListComboTarget;
				this.paymentMethodListCombo = response.data.map.paymentMethodListCombo;
				this.statementTypeListCombo = response.data.map.statementTypeListCombo;

				this.appStore.showGlobalDialog(true);
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async executeSearch(filterValue) {
			try {
				let statementPattern = {
					filter: filterValue,
					userIdentity: this.appStore.userIdentity
				}

				const response = await this.$_transaction_post("/statementPattern/executeSearch", statementPattern);
				this.statementPatternListResult = response.data.map.statementPatternList;
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async executeRegistration(statementPattern) {
			try {
				statementPattern.userIdentity = this.appStore.userIdentity;
				await this.$_transaction_post("/statementPattern/executeRegistration", statementPattern);

				this.closeForm(statementPattern);
				this.$_message_showSuccess();
				this.accessModule();
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async executeEdition(statementPattern) {
			try {
				statementPattern.userIdentity = this.appStore.userIdentity;
				await this.$_transaction_post("/statementPattern/executeEdition", statementPattern);

				this.closeForm(statementPattern);
				this.$_message_showSuccess();
				this.accessModule();
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async executeExclusion(statementPattern) {
			try {
				await this.$vueAlert.confirm(Constants.message.DELETE);

				statementPattern.userIdentity = this.appStore.userIdentity;
				await this.$_transaction_post("/statementPattern/executeExclusion", statementPattern);

				this.$_message_showSuccess();
				this.accessModule();
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		closeForm(statementPattern) {
			statementPattern.identity = "";
			statementPattern.comparator = "";
			statementPattern.description = "";
			statementPattern.location = undefined;
			statementPattern.accountSource = undefined;
			statementPattern.accountTarget = undefined;
			statementPattern.paymentMethod = undefined;
			statementPattern.statementType = undefined;

			this.appStore.showGlobalDialog(false);
		}
	},

	computed: {
		appStore() {
			return useAppStore()
		},
	}
}
