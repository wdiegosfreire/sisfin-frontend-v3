import { useAppStore } from '@/stores/app';

import transactionApi from "@/components/axios/transaction/transactionApi.js";

// Mixins
import format from "@/components/mixins/format.js";
import message from "@/components/mixins/message.js";

import Constants from "@/plugins/Constants";

export default {
	name: "objectiveMovementService",

	mixins: [transactionApi, message, format ],

	data() {
		return {
			showSearchField: false,
			filter: {
				location: null,
				accountSource: null,
				valueEnd: null,
				valueStart: null,
			},
			accountListBalanceCombo: [],
			locationListCombo: []
		};
	},

	methods: {
		accessModule() {
			if (!this.appStore.globalMonth || !this.appStore.globalYear) {
				this.$_message_showError("Period not found");
				return;
			}

			let objective = {
				userIdentity: this.appStore.userIdentity,
				filterMap: {
					// periodDate: new Date(this.appStore.globalYear + "-" + this.appStore.globalMonth + "-01 12:00:00"),
					periodDate: new Date(2024 + "-" + 12 + "-01 12:00:00"),
					locationIdentity: this.filter.location ? this.filter.location.identity : null,
					accountSourceIdentity: this.filter.accountSource ? this.filter.accountSource.identity : null,
					valueEnd: this.filter.valueEnd ? this.filter.valueEnd : null,
					valueStart: this.filter.valueStart ? this.filter.valueStart : null
				}
			};

			this.$_transaction_post("/objective/accessModule", objective).then(response => {
				this.appStore.setGlobalResult(response.data.map.objectiveList);
				this.accountListBalanceCombo = response.data.map.accountListBalanceCombo;
				this.locationListCombo = response.data.map.locationListCombo;
			}).catch(error => {
				this.$_message_handleError(error);
			});
		},

		accessRegistration() {
			let objective = {
				userIdentity: this.appStore.userIdentity
			};

			this.$_transaction_post("/objective/accessRegistration", objective).then(response => {
				this.appStore.setGlobalLocationListCombo(response.data.map.locationListCombo);
				this.appStore.setGlobalPaymentMethodListCombo(response.data.map.paymentMethodListCombo);
				this.appStore.setGlobalAccountListComboSource(response.data.map.accountListComboSource);
				this.appStore.setGlobalAccountListComboTarget(response.data.map.accountListComboTarget);

				this.appStore.showGlobalDialog(true);
			}).catch(error => {
				this.$_message_handleError(error);
			});
		},

		executeRegistration(objective) {
			objective.userIdentity = this.appStore.userIdentity;

			for (let objectiveMovement of objective.objectiveMovementList) {
				objectiveMovement.dueDate = new Date(this.$_format_toAmericanDate(objectiveMovement.dueDate) + " 12:00:00");
				objectiveMovement.paymentDate = new Date(this.$_format_toAmericanDate(objectiveMovement.paymentDate) + " 12:00:00");
			}

			this.$_transaction_post("/objective/executeRegistration", objective).then(response => {
				this.appStore.setGlobalResult(response.data.map.objectiveList);
				this.$_message_showSuccess();
				this.accessModule();
			}).catch(error => {
				this.$_message_handleError(error);
			});
		},

		cleanForm(objective) {
			objective.description = "";
			objective.location = {};
			objective.objectiveItemList = [];
			objective.objectiveMovementList = [];
		},

		closeForm(objective) {
			this.cleanForm(objective);
			this.appStore.showGlobalDialog(false);
		},

		accessEdition(objective) {
			let objectiveForEdition = {
				identity: objective.identity,
				userIdentity: this.appStore.userIdentity
			}

			this.$_transaction_post("/objective/accessEdition", objectiveForEdition).then(response => {
				this.appStore.setGlobalEntity(response.data.map.objective);
				this.appStore.setGlobalLocationListCombo(response.data.map.locationListCombo);
				this.appStore.setGlobalPaymentMethodListCombo(response.data.map.paymentMethodListCombo);
				this.appStore.setGlobalAccountListComboSource(response.data.map.accountListComboSource);
				this.appStore.setGlobalAccountListComboTarget(response.data.map.accountListComboTarget);

				this.appStore.showGlobalDialog(true);
			}).catch(error => {
				this.$_message_handleError(error);
			});
		},

		executeEdition(objective) {
			objective.userIdentity = this.appStore.userIdentity;

			for (let objectiveMovement of objective.objectiveMovementList) {
				objectiveMovement.dueDate = new Date(this.$_format_toAmericanDate(objectiveMovement.dueDate) + " 12:00:00");
				objectiveMovement.paymentDate = new Date(this.$_format_toAmericanDate(objectiveMovement.paymentDate) + " 12:00:00");
			}

			this.$_transaction_post("/objective/executeEdition", objective).then(response => {
				this.appStore.setGlobalResult(response.data.map.objectiveList);
				this.$_message_showSuccess();
				this.accessModule();
			}).catch(error => {
				this.$_message_handleError(error);
			});
		},

		executeExclusion(objective) {
			this.$confirm(Constants.message.DELETE).then(() => {
				let objectiveDelete = {
					identity: objective.identity,
					userIdentity: this.appStore.userIdentity
				}

				this.$_transaction_post("/objective/executeExclusion", objectiveDelete).then(() => {
					this.$_message_showSuccess();
					this.accessModule();
				}).catch(error => {
					this.$_message_handleError(error);
				});
			});
		}
	},

	computed: {
		appStore() {
			return useAppStore()
		},
	}
}
