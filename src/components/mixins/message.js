import { useAppStore } from '@/stores/app';

export default {
	name: "message",

	methods: {
		$_message_showInfo(message) {
			useAppStore().showMessage({ severity: "info", summary: "Information", detail: [message] });
		},

		$_message_showError(message) {
			useAppStore().showMessage({ severity: "error", summary: "Error", detail: [message] });
		},

		$_message_showWarning(message) {
			useAppStore().showMessage({ severity: "warning", summary: "Warning", detail: [message] });
		},

		$_message_showRequired(message) {
			useAppStore().showMessage({ severity: "warning", summary: "Required Field", detail: [message] });
		},

		$_message_showSuccess() {
			useAppStore().showMessage({ severity: "success", summary: "Success", detail: ["Operation performed successfully."] });
		},

		$_message_showMessage(severity, summary, messageList) {
			useAppStore().showMessage({ severity: severity, summary: summary, detail: messageList });
		},

		$_message_handleError(error) {
			if (!error) {
				return;
			}

			let exception = null;
			if (!error.response && error.message == "Network Error") {
				exception = {
					severity: "error",
					summary: error.message,
					messageList: ["Unable to connect with server."]
				};
			}
			else if (!error.response.data.severity && !error.response.data.summary && !error.response.data.messageList) {
				exception = {
					severity: "error",
					summary: "Unknow Error",
					messageList: ["Unknow Error. See the console for more detais."]
				}

				this.$_message_console(error.response.data);
			}
			else {
				exception = error.response.data;
			}

			this.$_message_showMessage(exception.severity, exception.summary, exception.messageList);
		},

		$_message_console(message) {
			/* eslint no-console: "off" */
			console.log(JSON.stringify(message));
		},

		$_message_alert(message) {
			/* eslint no-alert: "off" */
			alert(`App Alert: ${JSON.stringify(message)}`);
		}
	}
}
