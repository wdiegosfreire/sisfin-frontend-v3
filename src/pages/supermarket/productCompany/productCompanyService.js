import { useAppStore } from '@/stores/app';

import transactionApi from "@/components/axios/transaction/transactionApi.js";
import message from "@/components/mixins/message.js";

import Constants from "@/plugins/Constants.js";

export default {
	name: "productCompanyService",

	mixins: [ transactionApi, message ],

	data() {
		return {
			productCompanyForm: {},
			productCompanyListResult: [],
			companyListCombo: [],
			productListCombo: [],
		};
	},

	methods: {
		async accessModule() {
			try {
				let productCompany = {
					userIdentity: this.appStore.userIdentity
				}

				const response = await this.$_transaction_post("/productCompany/accessModule", productCompany);
				this.productCompanyListResult = response.data.map.productCompanyList;
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async accessRegistration() {
			try {
				let productCompany = {
					userIdentity: this.appStore.userIdentity
				};

				const response = await this.$_transaction_post("/productCompany/accessRegistration", productCompany);
				this.companyListCombo = response.data.map.companyListCombo;
				this.productListCombo = response.data.map.productListCombo;

				this.appStore.showGlobalDialog(true);
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async accessEdition(productCompany) {
			try {
				productCompany.userIdentity = this.appStore.userIdentity;
				const response = await this.$_transaction_post("/productCompany/accessEdition", productCompany);
				this.productCompanyForm = response.data.map.productCompany;
				this.companyListCombo = response.data.map.companyListCombo;
				this.productListCombo = response.data.map.productListCombo;

				this.appStore.showGlobalDialog(true);
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async executeRegistration(productCompany) {
			try {
				productCompany.userIdentity = this.appStore.userIdentity;
				await this.$_transaction_post("/productCompany/executeRegistration", productCompany);

				this.closeForm(productCompany);
				this.$_message_showSuccess();
				this.accessModule();
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async executeEdition(productCompany) {
			try {
				productCompany.userIdentity = this.appStore.userIdentity;
				await this.$_transaction_post("/productCompany/executeEdition", productCompany);

				this.closeForm(productCompany);
				this.$_message_showSuccess();
				this.accessModule();
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async executeExclusion(productCompany) {
			try {
				await this.$vueAlert.confirm(Constants.message.DELETE);

				productCompany.userIdentity = this.appStore.userIdentity;
				await this.$_transaction_post("/productCompany/executeExclusion", productCompany);

				this.$_message_showSuccess();
				this.accessModule();
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		closeForm(productCompany) {
			productCompany.identity = "";
			productCompany.code = "";
			productCompany.description = "";
			productCompany.company = undefined;
			productCompany.product = undefined;

			this.appStore.showGlobalDialog(false);
		}
	},

	computed: {
		appStore() {
			return useAppStore()
		},
	}
}
