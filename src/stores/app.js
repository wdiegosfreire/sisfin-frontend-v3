import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
	state: () => ({
		userName: "Diego Freire",
		userIdentity: "1",
		sessionToken: "my-session-token",

		message: {
			severity: "",
			summary: "",
			detailList: [],
			date: new Date()
		},
	}),

	actions: {
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
	}
})
