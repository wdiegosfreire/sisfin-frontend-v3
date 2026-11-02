import { useAppStore } from '@/stores/app';

import transactionApi from "@/components/axios/transaction/transactionApi.js";
import message from "@/components/mixins/message.js";

import Constants from "@/plugins/Constants.js";

export default {
	name: "productPropertyService",

	mixins: [ transactionApi, message ],

	data() {
		return {
			productPropertyForm: {},
			productPropertyListResult: [],
		};
	},

	methods: {
		async accessModule() {
			try {
				let productProperty = {
					userIdentity: this.appStore.userIdentity
				}

				const response = await this.$_transaction_post("/productProperty/accessModule", productProperty);
				this.productPropertyListResult = response.data.map.productPropertyList;
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async accessRegistration() {
			this.appStore.showGlobalDialog(true);
		},

		async accessEdition(productProperty) {
			try {
				productProperty.userIdentity = this.appStore.userIdentity;
				const response = await this.$_transaction_post("/productProperty/accessEdition", productProperty);
				this.productPropertyForm = response.data.map.productProperty;

				this.appStore.showGlobalDialog(true);
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async executeRegistration(productProperty) {
			try {
				productProperty.userIdentity = this.appStore.userIdentity;
				const response = await this.$_transaction_post("/productProperty/executeRegistration", productProperty);
				this.productPropertyListResult = response.data.map.productPropertyList;

				this.closeForm(productProperty);
				this.$_message_showSuccess();
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async executeEdition(productProperty) {
			try {
				productProperty.userIdentity = this.appStore.userIdentity;
				const response = await this.$_transaction_post("/productProperty/executeEdition", productProperty);
				this.productPropertyListResult = response.data.map.productPropertyList;

				this.closeForm(productProperty);
				this.$_message_showSuccess();
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async executeExclusion(productProperty) {
			try {
				await this.$vueAlert.confirm(Constants.message.DELETE);

				productProperty.userIdentity = this.appStore.userIdentity;
				const response = await this.$_transaction_post("/productProperty/executeExclusion", productProperty);
				this.productPropertyListResult = response.data.map.productPropertyList;
				this.$_message_showSuccess();
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		closeForm(productProperty) {
			productProperty.identity = "";
			productProperty.name = "";

			this.appStore.showGlobalDialog(false);
		}
	},

	computed: {
		appStore() {
			return useAppStore()
		},
	}
}
