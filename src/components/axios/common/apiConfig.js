import { useAppStore } from '@/stores/app';

import apiInstance from "../../api/apiInstance.js"
import maintenanceApiInstance from "../maintenance/maintenanceApiInstance";
import transactionApiInstance from "../transaction/transactionApiInstance";

export default {
	name: "apiConfig",

	methods: {
		createInterceptors() {
			apiInstance.interceptors.request.use((config) => {
				this.showGlobalLoading();
				return config;
			});

			apiInstance.interceptors.response.use((response) => {
				this.hideGlobalLoading();
				return response;
			});

			maintenanceApiInstance.interceptors.request.use((config) => {
				this.showGlobalLoading();
				return config;
			});

			maintenanceApiInstance.interceptors.response.use((response) => {
				this.hideGlobalLoading();
				return response;
			});

			transactionApiInstance.interceptors.request.use((config) => {
				this.showGlobalLoading();
				return config;
			});

			transactionApiInstance.interceptors.response.use((response) => {
				this.hideGlobalLoading();
				return response;
			});
		},

		showGlobalLoading() {
			useAppStore().setGlobalLoading(true);
		},

		hideGlobalLoading() {
			useAppStore().setGlobalLoading(false);
		}
	}
};
