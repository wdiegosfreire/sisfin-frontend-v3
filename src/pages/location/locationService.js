import { useAppStore } from '@/stores/app';

import transactionApi from "@/components/axios/transaction/transactionApi.js";
import message from "@/components/mixins/message.js";

import Constants from "@/plugins/Constants.js";

export default {
	name: "locationService",

	mixins: [ transactionApi, message ],

	data() {
		return {
			locationForm: {},
			locationListResult: [],
			showSearchField: false
		};
	},

	methods: {
		async accessModule() {
			try {
				let location = {
					userIdentity: this.appStore.userIdentity
				}

				const response = await this.$_transaction_post("/location/accessModule", location);
				this.locationListResult = response.data.map.locationList;
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async accessRegistration() {
			this.appStore.showGlobalDialog(true);
		},

		async accessEdition(location) {
			try {
				location.userIdentity = this.appStore.userIdentity;
				const response = await this.$_transaction_post("/location/accessEdition", location);
				this.locationForm = response.data.map.location;

				this.appStore.showGlobalDialog(true);
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async executeSearch(filterValue) {
			try {
				let location = {
					filter: filterValue,
					userIdentity: this.appStore.userIdentity
				}

				const response = await this.$_transaction_post("/location/executeSearch", location);
				this.locationListResult = response.data.map.locationList;
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async executeRegistration(location) {
			try {
				location.userIdentity = this.appStore.userIdentity;
				const response = await this.$_transaction_post("/location/executeRegistration", location);
				this.locationListResult = response.data.map.locationList;

				this.closeForm(location);
				this.$_message_showSuccess();
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async executeEdition(location) {
			try {
				location.userIdentity = this.appStore.userIdentity;
				const response = await this.$_transaction_post("/location/executeEdition", location);
				this.locationListResult = response.data.map.locationList;

				this.closeForm(location);
				this.$_message_showSuccess();
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async executeExclusion(location) {
			try {
				await this.$vueAlert.confirm(Constants.message.DELETE);

				location.userIdentity = this.appStore.userIdentity;
				const response = await this.$_transaction_post("/location/executeExclusion", location);
				this.locationListResult = response.data.map.locationList;
				this.$_message_showSuccess();
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		closeForm(location) {
			location.identity = "";
			location.name = "";
			location.note = "";

			this.appStore.showGlobalDialog(false);
		}
	},

	computed: {
		appStore() {
			return useAppStore()
		},
	}
}
