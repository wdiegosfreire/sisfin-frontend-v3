import { useAppStore } from '@/stores/app';

import transactionApi from "../../components/axios/transaction/transactionApi.js";
import message from "../../components/mixins/message.js";

import Constants from "../../plugins/Constants";

export default {
	name: "paymentMethodService",

	mixins: [transactionApi, message ],

	data() {
		return {
			showSearchField: false
		};
	},

	methods: {
		accessModule() {
			let paymentMethod = {
				userIdentity: this.appStore.userIdentity
			}

			this.$_transaction_post("/paymentMethod/accessModule", paymentMethod).then(response => {
				this.appStore.setGlobalResult(response.data.map.paymentMethodList);
			}).catch(error => {
				this.$_message_handleError(error);
			});
		},

		accessRegistration() {
			this.appStore.showGlobalDialog(true);
		},

		accessEdition(paymentMethod) {
			paymentMethod.userIdentity = this.appStore.userIdentity;
			this.$_transaction_post("/paymentMethod/accessEdition", paymentMethod).then(response => {
				this.appStore.setGlobalEntity(response.data.map.paymentMethod);
				this.appStore.showGlobalDialog(true);
			}).catch(error => {
				this.$_message_handleError(error);
			});
		},

		executeSearch(filterValue) {
			let paymentMethod = {
				filter: filterValue,
				userIdentity: this.appStore.userIdentity
			}

			this.$_transaction_post("/paymentMethod/executeSearch", paymentMethod).then(response => {
				this.appStore.setGlobalResult(response.data.map.paymentMethodList);
			}).catch(error => {
				this.$_message_handleError(error);
			});
		},

		executeRegistration(paymentMethod) {
			if (this.isMissingRequiredFields(paymentMethod))
				return;

			paymentMethod.userIdentity = this.appStore.userIdentity;
			this.$_transaction_post("/paymentMethod/executeRegistration", paymentMethod).then(response => {
				this.appStore.setGlobalResult(response.data.map.paymentMethodList);
				this.closeForm(paymentMethod);
				this.$_message_showSuccess();
			}).catch(error => {
				this.$_message_handleError(error);
			});
		},

		executeEdition(paymentMethod) {
			if (this.isMissingIdentity(paymentMethod) || this.isMissingRequiredFields(paymentMethod))
				return;

			paymentMethod.userIdentity = this.appStore.userIdentity;
			this.$_transaction_post("/paymentMethod/executeEdition", paymentMethod).then(response => {
				this.appStore.setGlobalResult(response.data.map.paymentMethodList);
				this.closeForm(paymentMethod);
				this.$_message_showSuccess();
			}).catch(error => {
				this.$_message_handleError(error);
			});
		},

		executeExclusion(paymentMethod) {
			this.$vueAlert.confirm(Constants.message.DELETE).then(() => {
				paymentMethod.userIdentity = this.appStore.userIdentity;

				this.$_transaction_post("/paymentMethod/executeExclusion", paymentMethod).then(response => {
					this.appStore.setGlobalResult(response.data.map.paymentMethodList);
					this.$_message_showSuccess();
				}).catch(error => {
					this.$_message_handleError(error);
				});
			});
		},

		isMissingIdentity(paymentMethod) {
			if (!paymentMethod.identity) {
				this.$_message_showRequired("Missing payment method identity.");
				return true;
			}

			return false;
		},

		isMissingRequiredFields(paymentMethod) {
			if (!paymentMethod.name || !paymentMethod.name.trim()) {
				this.$_message_showRequired("Mising payment method name.");
				return true;
			}

			if (!paymentMethod.acronym || !paymentMethod.acronym.trim()) {
				this.$_message_showRequired("Missing payment method acronym.");
				return true;
			}

			return false;
		},

		cleanForm(paymentMethod) {
			if (!paymentMethod.identity) {
				paymentMethod.name = "";
			}

			paymentMethod.acronym = "";
		},

		closeForm(paymentMethod) {
			paymentMethod.identity = "";
			paymentMethod.name = "";
			paymentMethod.acronym = "";

			this.appStore.showGlobalDialog(false);
		}
	},

	computed: {
		appStore() {
			return useAppStore()
		},
	}
}
