<template>
	<v-autocomplete v-model="selectedAccount"
		itemValue="identity"
		:item-title="traceAccount"
		:items="items"
		:label="label"
		:dense="dense"
		:clearable="clearable"
		:filter="filterAccount"
		@update:modelValue="validateSelected"
		return-object
	/>
</template>

<script>
import message from "../mixins/message.js";

import { traceAccount } from '@/utils/filters.js'

export default {
	name: "DfAutocompleteAccount",

	mixins: [ message],

	props: {
		label: {
			type: String
		},
		items: {
			type: Array,
			default: () => []
		},
		value: {
			type: Object,
			default: () => ({})
		},
		dense: {
			type: Boolean,
			default: false
		},
		clearable: {
			type: Boolean,
			default: false
		},
		validateAs: {
			type: String,
			required: true,
			validator: function (value) {
				return ["source", "target"].includes(value);
			}
		}
	},

	data() {
		return {
			selectedAccount: {},
		};
	},

	methods: {
		traceAccount,

		filterAccount(item, queryText) {
			if (/^[0-9.]+$/.test(queryText)) {
				return item.level.startsWith(queryText);
			}

			const fullText = `${item.level} ${this.traceAccount(item)}`.toLowerCase();
			return fullText.includes(queryText.toLowerCase());
		},

		validateSelected() {
			if (!this.validateAs || (this.validateAs !== "source" && this.validateAs !== "target")) {
				this.$_message_showError("Please, specify the validation type (source or target).");
				this.selectedAccount = {};

				return;
			}

			let errorMessage = "";
			if (this.validateAs === "source") {
				errorMessage = this.validateAsSource();
			}
			else if (this.validateAs === "target") {
				errorMessage = this.validateAsTarget();
			}

			if (errorMessage) {
				this.$_message_showRequired(errorMessage);
				this.selectedAccount = {};

				return;
			}
		},

		validateAsSource() {
			if (!this.selectedAccount || this.selectedAccount.level.length != 9)
				return "Please, select a final source account.";
			else if (this.selectedAccount.level.startsWith("03."))
				return `Accounts with level "03." can't be used as source account.`;

		},

		validateAsTarget() {
			if (!this.selectedAccount || this.selectedAccount.level.length != 9)
				return "Please, select a final target account.";
			else if (this.selectedAccount.level.startsWith("02."))
				return `Accounts with level "02." can't be used as target account.`;
		}
	},

	watch: {
		value(val) {
			this.selectedAccount = val;
		},

		selectedAccount(newVal) {
			this.$emit("input", newVal);
		},
	}
}
</script>
