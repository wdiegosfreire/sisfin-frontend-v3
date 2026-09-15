import { useAppStore } from '@/stores/app';

import transactionApi from "@/components/axios/transaction/transactionApi.js";
import message from "@/components/mixins/message.js";

import Constants from "@/plugins/Constants.js";

export default {
	name: "brandService",

	mixins: [ transactionApi, message ],

	data() {
		return {
			brandForm: {},
			brandListResult: [],
			showSearchField: false
		};
	},

	methods: {
		async accessModule() {
			try {
				let brand = {
					userIdentity: this.appStore.userIdentity
				}

				const response = await this.$_transaction_post("/brand/accessModule", brand);
				this.brandListResult = response.data.map.brandList;
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async accessRegistration() {
			this.appStore.showGlobalDialog(true);
		},

		async accessEdition(brand) {
			try {
				brand.userIdentity = this.appStore.userIdentity;
				const response = await this.$_transaction_post("/brand/accessEdition", brand);
				this.brandForm = response.data.map.brand;

				this.appStore.showGlobalDialog(true);
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async executeSearch(filterValue) {
			try {
				let brand = {
					filter: filterValue,
					userIdentity: this.appStore.userIdentity
				}

				const response = await this.$_transaction_post("/brand/executeSearch", brand);
				this.brandListResult = response.data.map.brandList;
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async executeRegistration(brand) {
			try {
				brand.userIdentity = this.appStore.userIdentity;
				const response = await this.$_transaction_post("/brand/executeRegistration", brand);
				this.brandListResult = response.data.map.brandList;

				this.closeForm(brand);
				this.$_message_showSuccess();
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async executeEdition(brand) {
			try {
				brand.userIdentity = this.appStore.userIdentity;
				const response = await this.$_transaction_post("/brand/executeEdition", brand);
				this.brandListResult = response.data.map.brandList;

				this.closeForm(brand);
				this.$_message_showSuccess();
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async executeExclusion(brand) {
			try {
				await this.$vueAlert.confirm(Constants.message.DELETE);

				brand.userIdentity = this.appStore.userIdentity;
				const response = await this.$_transaction_post("/brand/executeExclusion", brand);
				this.brandListResult = response.data.map.brandList;
				this.$_message_showSuccess();
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		closeForm(brand) {
			brand.identity = "";
			brand.name = "";
			brand.email = "";
			brand.website = "";

			this.appStore.showGlobalDialog(false);
		}
	},

	computed: {
		appStore() {
			return useAppStore()
		},
	}
}
