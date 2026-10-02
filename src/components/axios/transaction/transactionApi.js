import transactionApiInstance from "./transactionApiInstance";
import { useAppStore } from '@/stores/app';

export default {
	name: "transactionApi",

	methods: {
		$_transaction_config() {
			return {
				headers: {
					Authorization: "Bearer " + useAppStore().sessionToken
				}
			};
		},

		$_transaction_get(url) {
			return transactionApiInstance.get(url, this.$_transaction_config());
		},
		$_transaction_post(url, data) {
			return transactionApiInstance.post(url, data, this.$_transaction_config());
		},
		$_transaction_put(url, data) {
			return transactionApiInstance.put(url, data, this.$_transaction_config());
		},
		$_transaction_delete(url) {
			return transactionApiInstance.delete(url, this.$_transaction_config());
		},

		async $_transaction_post_sync(url, data) {
			try {
				return await transactionApiInstance.post(url, data, this.$_transaction_config());
			}
			catch (error) {
				return error;
			}
		},
	},
}
