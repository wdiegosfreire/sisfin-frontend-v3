<template>
	<v-text-field v-model="amount" :id="id" :ref="ref" :prefix="prefix" v-money="config" :label="label" @input="returnToParent()" @blur="$emit('blur')" />
</template>

<script>
import { VMoney } from "v-money";
import format from "../mixins/format.js";

export default {
	name: "DfInputMoneyCopy",

	mixins: [ format ],

	directives: {money: VMoney},

	props: {
		label: {
			type: String,
		},
		id: {
			type: String,
		},
		ref: {
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
			amount: 0,
			config: {
				decimal: ',',
				thousands: '.',
				precision: this.precision,
				masked: false,
				allowBlank: true
			}
		}
	},

	methods: {
		returnToParent() {
			this.$emit("type", this.$_format_currencyToNumber(this.amount, this.precision));
		}
	}
}
</script>
