import { useAppStore } from '@/stores/app';

import transactionApi from "@/components/axios/transaction/transactionApi.js";
import message from "@/components/mixins/message.js";

import Constants from "@/plugins/Constants.js";

export default {
	name: "productService",

	mixins: [ transactionApi, message ],

	data() {
		return {
			productForm: { isFavorite: false },
			productListResult: [],
			brandListCombo: [],
			productCategoryListCombo: [],
			measurementUnitListCombo: [],
			productPropertyListTable: [],
		};
	},

	methods: {
		async accessModule() {
			try {
				let product = {
					userIdentity: this.appStore.userIdentity
				}

				const response = await this.$_transaction_post("/product/accessModule", product);
				this.productListResult = response.data.map.productList;
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async accessRegistration() {
			try {
				let product = {
					userIdentity: this.appStore.userIdentity
				};

				const response = await this.$_transaction_post("/product/accessRegistration", product);
				this.brandListCombo = response.data.map.brandListCombo;
				this.productCategoryListCombo = response.data.map.productCategoryListCombo;
				this.measurementUnitListCombo = response.data.map.measurementUnitListCombo;
				this.productPropertyListTable = response.data.map.productPropertyListTable ?? [];

				this.appStore.showGlobalDialog(true);
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async accessEdition(product) {
			try {
				product.userIdentity = this.appStore.userIdentity;
				const response = await this.$_transaction_post("/product/accessEdition", product);
				this.productForm = response.data.map.product;
				this.brandListCombo = response.data.map.brandListCombo;
				this.productCategoryListCombo = response.data.map.productCategoryListCombo;
				this.measurementUnitListCombo = response.data.map.measurementUnitListCombo;
				this.productPropertyListTable = response.data.map.productPropertyListTable ?? [];

				this.appStore.showGlobalDialog(true);
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async executeRegistration(product) {
			try {
				product.userIdentity = this.appStore.userIdentity;
				await this.$_transaction_post("/product/executeRegistration", product);

				this.closeForm(product);
				this.$_message_showSuccess();
				this.accessModule();
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async executeEdition(product) {
			try {
				product.userIdentity = this.appStore.userIdentity;
				await this.$_transaction_post("/product/executeEdition", product);

				this.closeForm(product);
				this.$_message_showSuccess();
				this.accessModule();
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		async executeExclusion(product) {
			try {
				await this.$vueAlert.confirm(Constants.message.DELETE);

				product.userIdentity = this.appStore.userIdentity;
				await this.$_transaction_post("/product/executeExclusion", product);

				this.$_message_showSuccess();
				this.accessModule();
			}
			catch (error) {
				this.$_message_handleError(error);
			}
		},

		closeForm(product) {
			product.identity = "";
			product.barcode = "";
			product.itemPerBarcode = null;
			product.quantityPerItem = null;
			product.isFavorite = false;
			product.brand = undefined;
			product.productCategory = undefined;
			product.measurementUnit = undefined;
			product.productInfoList = [];

			this.appStore.showGlobalDialog(false);
		}
	},

	computed: {
		appStore() {
			return useAppStore()
		},
	}
}
