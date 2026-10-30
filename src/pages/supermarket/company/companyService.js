import { useAppStore } from '@/stores/app';

import transactionApi from "@/components/axios/transaction/transactionApi.js";
import message from "@/components/mixins/message.js";

import Constants from "@/plugins/Constants.js";

export default {
	name: "companyService",

	mixins: [ transactionApi, message ],

	data() {
		return {
			companyForm: { address: {} },
			companyListResult: [],
		};
	},

	methods: {
		async accessModule() {
			try {
				let company = {
					userIdentity: this.appStore.userIdentity
				}

				const response = await this.$_transaction_post("/company/accessModule", company);
				this.companyListResult = response.data.map.companyList;
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async accessRegistration() {
			this.appStore.showGlobalDialog(true);
		},

		async accessEdition(company) {
			try {
				company.userIdentity = this.appStore.userIdentity;
				const response = await this.$_transaction_post("/company/accessEdition", company);
				this.companyForm = response.data.map.company;

				if (!this.companyForm.address) {
					this.companyForm.address = {};
				}

				this.appStore.showGlobalDialog(true);
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async executeRegistration(company) {
			try {
				company.userIdentity = this.appStore.userIdentity;
				company.address.userIdentity = this.appStore.userIdentity;
				await this.$_transaction_post("/company/executeRegistration", company);

				this.closeForm(company);
				this.$_message_showSuccess();
				this.accessModule();
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async executeEdition(company) {
			try {
				company.userIdentity = this.appStore.userIdentity;
				company.address.userIdentity = this.appStore.userIdentity;
				await this.$_transaction_post("/company/executeEdition", company);

				this.closeForm(company);
				this.$_message_showSuccess();
				this.accessModule();
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async executeExclusion(company) {
			try {
				await this.$vueAlert.confirm(Constants.message.DELETE);

				company.userIdentity = this.appStore.userIdentity;
				const response = await this.$_transaction_post("/company/executeExclusion", company);
				this.companyListResult = response.data.map.companyList;
				this.$_message_showSuccess();
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		closeForm(company) {
			company.identity = "";
			company.name = "";
			company.fantasyName = "";
			company.taxNumber = "";
			company.isInactive = false;
			company.address = {};

			this.appStore.showGlobalDialog(false);
		}
	},

	computed: {
		appStore() {
			return useAppStore()
		},
	}
}
