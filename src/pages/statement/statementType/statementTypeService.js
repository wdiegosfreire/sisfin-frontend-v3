import { useAppStore } from '@/stores/app';

import transactionApi from "../../../components/axios/transaction/transactionApi.js";
import message from "../../../components/mixins/message.js";

import Constants from "../../../plugins/Constants";

export default {
	name: "statementTypeService",

	mixins: [ transactionApi, message ],

	data() {
		return {
			showSearchField: false
		};
	},

	methods: {
		accessModule() {
			let statementType = {
				userIdentity: this.appStore.userIdentity
			}

			this.$_transaction_post("/statementType/accessModule", statementType).then(response => {
				this.appStore.setGlobalResult(response.data.map.statementTypeList);
			}).catch(error => {
				this.$_message_handleError(error);
			});
		},

		accessRegistration() {
			let statementType = {
				userIdentity: this.appStore.userIdentity
			};

			this.$_transaction_post("/statementType/accessRegistration", statementType).then(response => {
				this.appStore.setGlobalBankListCombo(response.data.map.bankListCombo);
				this.appStore.setGlobalAccountListComboSource(response.data.map.accountListComboSource);

				this.appStore.showGlobalDialog(true);
			}).catch(error => {
				this.$_message_handleError(error);
			});
		},

		accessEdition(statementType) {
			statementType.userIdentity = this.appStore.userIdentity;
			this.$_transaction_post("/statementType/accessEdition", statementType).then(response => {
				this.appStore.setGlobalEntity(response.data.map.statementType);
				this.appStore.setGlobalBankListCombo(response.data.map.bankListCombo);
				this.appStore.setGlobalAccountListComboSource(response.data.map.accountListComboSource);

				this.appStore.showGlobalDialog(true);
			}).catch(error => {
				this.$_message_handleError(error);
			});
		},

		executeSearch(filterValue) {
			let statementType = {
				filter: filterValue,
				userIdentity: this.appStore.userIdentity
			}

			this.$_transaction_post("/statementType/executeSearch", statementType).then(response => {
				this.appStore.setGlobalResult(response.data.map.statementTypeList);
			}).catch(error => {
				this.$_message_handleError(error);
			});
		},

		executeRegistration(statementType) {
			if (this.isMissingRequiredFields(statementType))
				return;

			statementType.userIdentity = this.appStore.userIdentity;
			this.$_transaction_post("/statementType/executeRegistration", statementType).then(() => {
				this.closeForm(statementType);
				this.$_message_showSuccess();
				this.accessModule();
			}).catch(error => {
				this.$_message_handleError(error);
			});
		},

		executeEdition(statementType) {
			if (this.isMissingIdentity(statementType) || this.isMissingRequiredFields(statementType))
				return;

			statementType.userIdentity = this.appStore.userIdentity;
			this.$_transaction_post("/statementType/executeEdition", statementType).then(() => {
				this.closeForm(statementType);
				this.$_message_showSuccess();
				this.accessModule();
			}).catch(error => {
				this.$_message_handleError(error);
			});
		},

		executeExclusion(statementType) {
			this.$vueAlert.confirm(Constants.message.DELETE).then(() => {
				statementType.userIdentity = this.appStore.userIdentity;

				this.$_transaction_post("/statementType/executeExclusion", statementType).then(() => {
					this.$_message_showSuccess();
					this.accessModule();
				}).catch(error => {
					this.$_message_handleError(error);
				});
			});
		},

		isMissingIdentity(statementType) {
			if (!statementType.identity) {
				this.$_message_showRequired("Missing statement type identity.");
				return true;
			}

			return false;
		},

		isMissingRequiredFields(statementType) {
			if (!statementType.name || !statementType.name.trim()) {
				this.$_message_showRequired("Mising statement type sname.");
				return true;
			}

			return false;
		},

		cleanForm(statementType) {
			if (!statementType.identity) {
				statementType.name = "";
			}

			statementType.bank = null;
			statementType.accountSource = null;
		},

		closeForm(statementType) {
			statementType.identity = null;
			statementType.name = null;
			statementType.bank = null;
			statementType.accountSource = null;

			this.appStore.setGlobalBankListCombo([]);
			this.appStore.showGlobalDialog(false);
		}
	},

	computed: {
		appStore() {
			return useAppStore()
		},
	}
}
