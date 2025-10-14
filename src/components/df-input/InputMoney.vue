<template>
	<v-text-field v-model="amount" :id="id" :prefix="prefix" :label="label"
		@blur="$emit('blur')"
		@keyup="validateInput($event)"
	/>
</template>

<script>
import format from "../mixins/format.js";
import message from "../../components/mixins/message.js";

export default {
	name: "DfInputMoney",

	mixins: [ format, message ],

	props: {
		label: {
			type: String,
		},
		id: {
			type: String,
		},
		prefix: {
			type: String,
			default: "R$"
		},
		precision: {
			type: Number,
			default: 2
		},
	},

	data () {
		return {
			amount: ""
		}
	},

	methods: {
		returnToParent() {
			this.$_message_console("amount: " + this.amount);
			this.$emit("type", this.$_format_currencyToNumber(this.amount, this.precision));
		},

		validateInput(event) {
			const pattern = "0123456789,";

			this.$_message_console(event.key);
			if (pattern.indexOf(event.key) == -1 && event.key != "Home" && event.key != "End" && event.key != "Shift" && event.key != "CapsLock" && event.key != "Tab" && event.key != "Control" && event.key != "Backspace" && event.key != "Alt" && event.key != "AltGraph")
				this.amount = "";

			let amountSplited = this.amount.split(",");
			if (amountSplited.length > 2)
				this.amount = "";
			else if (amountSplited.length == 2 && amountSplited[1].length > this.precision) {
				this.amount = "";
			}

			this.$emit("type", this.$_format_currencyToNumber(this.amount, this.precision));
		}
	}
}
</script>
