import { useAppStore } from '@/stores/app';

import transactionApi from "@/components/axios/transaction/transactionApi.js";
import message from "@/components/mixins/message.js";

import Constants from "@/plugins/Constants.js";

export default {
	name: "measurementUnitService",

	mixins: [ transactionApi, message ],

	data() {
		return {
			measurementUnitForm: {},
			measurementUnitListResult: [],
		};
	},

	methods: {
		async accessModule() {
			try {
				let measurementUnit = {
					userIdentity: this.appStore.userIdentity
				}

				const response = await this.$_transaction_post("/measurementUnit/accessModule", measurementUnit);
				this.measurementUnitListResult = response.data.map.measurementUnitList;
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async accessRegistration() {
			this.appStore.showGlobalDialog(true);
		},

		async accessEdition(measurementUnit) {
			try {
				measurementUnit.userIdentity = this.appStore.userIdentity;
				const response = await this.$_transaction_post("/measurementUnit/accessEdition", measurementUnit);
				this.measurementUnitForm = response.data.map.measurementUnit;

				this.appStore.showGlobalDialog(true);
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async executeRegistration(measurementUnit) {
			try {
				measurementUnit.userIdentity = this.appStore.userIdentity;
				const response = await this.$_transaction_post("/measurementUnit/executeRegistration", measurementUnit);
				this.measurementUnitListResult = response.data.map.measurementUnitList;

				this.closeForm(measurementUnit);
				this.$_message_showSuccess();
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async executeEdition(measurementUnit) {
			try {
				measurementUnit.userIdentity = this.appStore.userIdentity;
				const response = await this.$_transaction_post("/measurementUnit/executeEdition", measurementUnit);
				this.measurementUnitListResult = response.data.map.measurementUnitList;

				this.closeForm(measurementUnit);
				this.$_message_showSuccess();
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async executeExclusion(measurementUnit) {
			try {
				await this.$vueAlert.confirm(Constants.message.DELETE);

				measurementUnit.userIdentity = this.appStore.userIdentity;
				const response = await this.$_transaction_post("/measurementUnit/executeExclusion", measurementUnit);
				this.measurementUnitListResult = response.data.map.measurementUnitList;
				this.$_message_showSuccess();
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		closeForm(measurementUnit) {
			measurementUnit.identity = "";
			measurementUnit.name = "";
			measurementUnit.acronym = "";
			measurementUnit.divider = "";

			this.appStore.showGlobalDialog(false);
		}
	},

	computed: {
		appStore() {
			return useAppStore()
		},
	}
}
