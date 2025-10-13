<template>
	<div class="d-flex justify-center">
		<v-card max-width="500">
			<v-img src="../../assets/images/personal-finance.jpg">
				<v-card-title class="headline">Authentication</v-card-title>
			</v-img>

			<v-card-text>
				<v-text-field label="E-mail" v-model="user.email" append-inner-icon="mdi-mail" />
				<v-text-field label="Password" v-model="password" :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'" :type="passwordVisible ? 'text' : 'password'" @click:append-inner="passwordVisible = !passwordVisible" />
			</v-card-text>

			<v-card-actions>
				<v-btn width="150" @click="executeAuthentication">Confirm</v-btn>
				<v-btn width="150" @click="resetForm">Clear</v-btn>
			</v-card-actions>

			<v-card-actions v-if="maintenance">
				<v-alert outlined prominent type="error" class="text-left">
					The service "MAINTENANCE" is not responding. We'll try again after each 30 seconds until the service is back again.
				</v-alert>
			</v-card-actions>
			<v-card-actions v-if="transaction">
				<v-alert outlined prominent type="error" class="text-left">
					The service "TRANSACTION" is not responding. We'll try again after each 30 seconds until the service is back again.
				</v-alert>
			</v-card-actions>

			<v-divider />

			<v-card-text class="text-right">
				<v-btn size="x-small" @click="accessResetPassword">Forgot your password?</v-btn>
				<v-btn size="x-small" @click="accessRegistration" class="mt-3">Don't have an account? Sign up and get started!</v-btn>
			</v-card-text>
		</v-card>
	</div>
</template>

<script>
import maintenanceApi from "../../components/axios/maintenance/maintenanceApi.js";
import transactionApi from "../../components/axios/transaction/transactionApi.js";
import userService from "./userService.js";

import message from "../../components/mixins/message.js";

export default {
	name: "User",

	mixins: [ maintenanceApi, transactionApi, userService, message ],

	data() {
		return {
			passwordVisible: false,
			maintenance: false,
			transaction: false,
			timeoutDelay: 30000
		}
	},

	methods: {
		checkMicroServiceMaintenance() {
			let _this = this;

			this.$_maintenance_get(`/imrunning`).then(() => {
				_this.maintenance = false;
			}).catch(() => {
				_this.maintenance = true;
				setTimeout(function() {_this.checkMicroServiceMaintenance();}, _this.timeoutDelay);
			});
		},

		checkMicroServiceTransaction() {
			let _this = this;

			this.$_transaction_get(`/imrunning`).then(() => {
				_this.transaction = false;
			}).catch(() => {
				_this.transaction = true;
				setTimeout(function() {_this.checkMicroServiceTransaction();}, _this.timeoutDelay);
			});
		}
	},

	created: function () {
		this.$_message_console(import.meta.env.VITE_SISFIN_FRONTEND_ENVIROMENT);

		this.checkMicroServiceMaintenance();
		this.checkMicroServiceTransaction();
	}
}
</script>
