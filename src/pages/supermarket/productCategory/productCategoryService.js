import { useAppStore } from '@/stores/app';

import transactionApi from "@/components/axios/transaction/transactionApi.js";
import message from "@/components/mixins/message.js";

import Constants from "@/plugins/Constants.js";

export default {
	name: "productCategoryService",

	mixins: [ transactionApi, message ],

	data() {
		return {
			productCategoryForm: {},
			productCategoryListResult: [],
		};
	},

	methods: {
		async accessModule() {
			try {
				let productCategory = {
					userIdentity: this.appStore.userIdentity
				}

				const response = await this.$_transaction_post("/productCategory/accessModule", productCategory);
				this.productCategoryListResult = response.data.map.productCategoryList;
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async accessRegistration() {
			this.appStore.showGlobalDialog(true);
		},

		async accessEdition(productCategory) {
			try {
				productCategory.userIdentity = this.appStore.userIdentity;
				const response = await this.$_transaction_post("/productCategory/accessEdition", productCategory);
				this.productCategoryForm = response.data.map.productCategory;

				this.appStore.showGlobalDialog(true);
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async executeRegistration(productCategory) {
			try {
				productCategory.userIdentity = this.appStore.userIdentity;
				const response = await this.$_transaction_post("/productCategory/executeRegistration", productCategory);
				this.productCategoryListResult = response.data.map.productCategoryList;

				this.closeForm(productCategory);
				this.$_message_showSuccess();
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async executeEdition(productCategory) {
			try {
				productCategory.userIdentity = this.appStore.userIdentity;
				const response = await this.$_transaction_post("/productCategory/executeEdition", productCategory);
				this.productCategoryListResult = response.data.map.productCategoryList;

				this.closeForm(productCategory);
				this.$_message_showSuccess();
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async executeExclusion(productCategory) {
			try {
				await this.$vueAlert.confirm(Constants.message.DELETE);

				productCategory.userIdentity = this.appStore.userIdentity;
				const response = await this.$_transaction_post("/productCategory/executeExclusion", productCategory);
				this.productCategoryListResult = response.data.map.productCategoryList;
				this.$_message_showSuccess();
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		closeForm(productCategory) {
			productCategory.identity = "";
			productCategory.name = "";

			this.appStore.showGlobalDialog(false);
		}
	},

	computed: {
		appStore() {
			return useAppStore()
		},
	}
}
