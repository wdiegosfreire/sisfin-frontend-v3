import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
	state: () => ({
		globalObjectiveMovement: {
			objective: {}
		},

		globalMonth: "",
		globalYear: "",

		globalResult: [],
		globalEntity: {},
		globalDialog: false,
		globalLoading: false,

		userName: "",
		userIdentity: "",
		sessionToken: "",

		message: {
			severity: "",
			summary: "",
			detailList: [],
			date: new Date()
		},

		globalBankListCombo: [],
		globalLocationListCombo: [],
		globalAccountListComboSource: [],
		globalPaymentMethodListCombo: [],
		globalStatementTypeListCombo: [],
		globalAccountListComboTarget: [],
		globalAccountListComboLevelOne: [],
		globalAccountListComboLevelTwo: [],
	}),

	actions: {
		setGlobalYear(payload) { this.globalYear = payload; },
		setGlobalMonth(payload) { this.globalMonth = payload; },
		setGlobalResult(payload) { this.globalResult = payload; },
		setGlobalEntity(payload) { this.globalEntity = payload; },
		setGlobalLoading(payload) { this.globalLoading = payload; },

		showGlobalDialog(payload) { this.globalDialog = payload; },

		setUserName(payload) {
			window.localStorage.userName = payload;
			this.userName = payload;
		},

		setUserIdentity(payload) {
			window.localStorage.userIdentity = payload;
			this.userIdentity = payload
		},

		setSessionToken(payload) {
			window.localStorage.sessionToken = payload;
			this.sessionToken = payload;
		},

		showMessage(payload) {
			this.message = {
				severity: payload.severity,
				summary: payload.summary,
				detailList: payload.detail,
				date: new Date()
			}
		},

		setGlobalBankListCombo(payload) { this.globalBankListCombo = payload; },
		setGlobalLocationListCombo(payload) { this.globalLocationListCombo = payload; },
		setGlobalAccountListComboSource(payload) { this.globalAccountListComboSource = payload; },
		setGlobalAccountListComboTarget(payload) { this.globalAccountListComboTarget = payload; },
		setGlobalPaymentMethodListCombo(payload) { this.globalPaymentMethodListCombo = payload; },
		setGlobalStatementTypeListCombo(payload) { this.globalStatementTypeListCombo = payload; },
		setGlobalAccountListComboLevelOne(payload) { this.globalAccountListComboLevelOne = payload; },
		setGlobalAccountListComboLevelTwo(payload) { this.globalAccountListComboLevelTwo = payload; },
	}
})
