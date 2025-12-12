import { useAppStore } from '@/stores/app';

import transactionApi from "../../../components/axios/transaction/transactionApi.js";
import message from "../../../components/mixins/message.js";

import Constants from "../../../plugins/Constants";

export default {
	name: "statementService",

	mixins: [ transactionApi, message ],

	data() {
		return {
			month: "",
			year: "",
			showSearchField: false
		};
	},

	methods: {
		accessModule() {
			let statement = {
				userIdentity: this.appStore.userIdentity,
				filterMap: {
					periodDate: new Date(this.appStore.globalYear + "-" + this.appStore.globalMonth + "-01 12:00:00")
				}
			}

			this.$_transaction_post("/statement/accessModule", statement).then(response => {
				this.appStore.setGlobalResult(response.data.map.statementList);
			}).catch(error => {
				this.$_message_handleError(error);
			});
		},

		accessRegistration(bankComboSelected) {
			let statement = {
				userIdentity: this.appStore.userIdentity
			};

			if (bankComboSelected) {
				bankComboSelected.userIdentity = this.appStore.userIdentity;

				let statementType = {
					userIdentity: this.appStore.userIdentity,
					bank: bankComboSelected
				};

				statement.statementType = statementType;
			}

			this.$_transaction_post("/statement/accessRegistration", statement).then(response => {
				this.appStore.setGlobalBankListCombo(response.data.map.bankListCombo);
				this.appStore.setGlobalStatementTypeListCombo(response.data.map.statementTypeListCombo);
				this.appStore.setGlobalEntity({identity: null, statementFile: null});

				this.appStore.showGlobalDialog(true);
			}).catch(error => {
				this.$_message_handleError(error);
			});
		},

		accessEdition(statement) {
			statement.userIdentity = this.appStore.userIdentity;

			this.$_transaction_post("/statement/accessEdition", statement).then(response => {
				this.appStore.setGlobalEntity(response.data.map.statement);
				this.appStore.setGlobalLocationListCombo(response.data.map.locationListCombo);
				this.appStore.setGlobalAccountListComboSource(response.data.map.accountListComboSource);
				this.appStore.setGlobalAccountListComboTarget(response.data.map.accountListComboTarget);
				this.appStore.setGlobalPaymentMethodListCombo(response.data.map.paymentMethodListCombo);

				this.appStore.showGlobalDialog(true);
			}).catch(error => {
				this.$_message_handleError(error);
			});
		},

		async executeRegistration(statement) {
			if (this.isMissingRequiredFields(statement)) {
				return;
			}

			statement.userIdentity = this.appStore.userIdentity;

			const toBase64 = file => new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = () => resolve(reader.result);
				reader.onerror = reject;
			});

			statement.statementFile = await toBase64(statement.statementFile);

			this.$_transaction_post("/statement/executeRegistration", statement).then(() => {
				this.closeForm(statement);
				this.$_message_showSuccess();
				this.accessModule();
			}).catch(error => {
				this.$_message_handleError(error);
			});
		},

		executeEdition(statement) {
			if (this.isMissingIdentity(statement) || this.isMissingRequiredFields(statement)) {
				return;
			}

			for (let statementItem of statement.statementItemList) {
				statementItem.statement = null;
			}

			statement.userIdentity = this.appStore.userIdentity;
			this.$_transaction_post("/statement/executeEdition", statement).then(() => {
				this.$_message_showSuccess();
				this.accessEdition(statement);
			}).catch(error => {
				this.$_message_handleError(error);
			});
		},

		executeExclusion(statement) {
			this.$vueAlert.confirm(Constants.message.DELETE).then(() => {
				let statementDelete = {
					identity: statement.identity,
					userIdentity: this.appStore.userIdentity
				}

				this.$_transaction_post("/statement/executeExclusion", statementDelete).then(() => {
					this.$_message_showSuccess();
					this.accessModule();
				}).catch(error => {
					this.$_message_handleError(error);
				});
			});
		},

		isMissingIdentity(statement) {
			if (!statement.identity) {
				this.$_message_showRequired("Missing statement identity.");
				return true;
			}

			return false;
		},

		isMissingRequiredFields(statement) {
			if (!statement.statementType?.name) {
				this.$_message_showRequired("Mising statement type. Please, choose a bank to load the statement type list.");
				return true;
			}

			if (!statement.identity && !statement.statementFile) {
				this.$_message_showRequired("Mising statement file.");
				return true;
			}

			return false;
		},

		cleanForm(statement) {
			statement.statementType = {};
			statement.statementFile = null;
		},

		closeForm(statement) {
			statement.statementFile = null;
			this.appStore.showGlobalDialog(false);
		}
	},

	computed: {
		appStore() {
			return useAppStore()
		},
	}
}
