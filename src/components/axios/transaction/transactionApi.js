import transactionApiInstance from "./transactionApiInstance";
import { useAppStore } from '@/stores/app';

export default {
	name: "transactionApi",

	data() {
		return {
			tokenParam: "?token=" + useAppStore().sessionToken,
		}
	},

	methods: {
		$_transaction_get(url) {
			return transactionApiInstance.get(url + this.tokenParam);
		},
		$_transaction_post(url, data) {
			return transactionApiInstance.post(url + this.tokenParam, data);
		},
		$_transaction_put(url, data) {
			return transactionApiInstance.put(url + this.tokenParam, data);
		},
		$_transaction_delete(url) {
			return transactionApiInstance.delete(url + this.tokenParam);
		},

		async $_transaction_post_sync(url, data) {
			try {
				return await transactionApiInstance.post(url + this.tokenParam, data);
			} catch (error) {
				return error;
			}
		},
	},
}
