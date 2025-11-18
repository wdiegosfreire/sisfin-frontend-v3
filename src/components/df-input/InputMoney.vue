<template>
  	<v-text-field v-model="displayValue"
   	:label="label"
		:clearable="clearable"
    	@input="onInput"
  	/>
</template>

<script>
import message from "../../components/mixins/message.js";

export default {
	name: "DfInputMoney",

	mixins: [ message ],

	props: {
		modelValue: {
			type: [Number, String],
			default: ""
		},
		label: {
			type: String,
			default: "Valor"
		},
		currency: {
			type: String,
			default: "BRL"
		},
		precision: {
			type: String,
			default: "2"
		},
		clearable: {
			type: Boolean,
			default: false
		}
	},

	data() {
		return {
			displayValue: ""
		}
	},

	watch: {
		modelValue: {
			immediate: true,
			handler(newVal) {
				this.displayValue = this.formatCurrency(newVal);
			}
		}
	},

	methods: {
		formatCurrency(value) {
			if (value === null || value === "" || isNaN(value))
				return "";

			return new Intl.NumberFormat('pt-BR', {
				style: 'currency',
				currency: this.currency,
				minimumFractionDigits: this.precision,
				maximumFractionDigits: this.precision
			}).format(value);
		},

		onInput(event) {
			const raw = event.target.value.replace(/[^\d]/g, '');
			const divisor = Math.pow(10, this.precision);
			const number = parseFloat(raw) / divisor;
			this.$emit('update:modelValue', number);
			this.displayValue = this.formatCurrency(number);
		}
	}
}
</script>
