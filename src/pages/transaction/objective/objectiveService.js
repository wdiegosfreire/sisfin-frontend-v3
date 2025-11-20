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
					periodDate: new Date(this.appStore.globalYear + "-" + this.appStore.globalMonth + "-01 12:00:00"),
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
			objective.location = null;
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

			/**
			 * Explicação para o bloco FOR abaixo:
			 *
			 * No início do sistema todos os movimentos foram importados através dos arquivos de extratos, criando objetivos com apenas 1 movimento.
			 * Devido a isso, coincidentemente, os IDs dos objetivos e dos movimentos ficaram iguais. Ex.: Objetivo ID 10 possui Movimento ID 10.
			 * Essa característica causou um problema na edição dos objetivos, pois a biblioteca Jackson se perde quando encontra um objetivo
			 * com o mesmo ID do movimento.
			 *
			 * Assim, faz-se necessário verificar se os IDs são iguais e, se forem, inverter o sinal do ID do movimento para que o Jackson consiga
			 * diferenciar os dois objetos.
			 *
			 * No backend o ID do movimento é convertido novamente para um valor positivo, permitindo assim a edição correta do objetivo.
			 */
			for (let objectiveMovement of objective.objectiveMovementList) {
				if (objective.identity === objectiveMovement.identity)
					objectiveMovement.identity = objectiveMovement.identity * -1;
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
			this.$vueAlert.confirm(Constants.message.DELETE).then(() => {
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
