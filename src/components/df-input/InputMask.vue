<template>
	<v-text-field :model-value="displayValue"
		:maxlength="mask.length"
		@update:model-value="onUpdate"
	/>
</template>

<script>
export default {
	name: "DfInputMask",

	props: {
		modelValue: {
			type: String,
			default: ""
		},
		// Use "#" as a digit placeholder. Example: "#####-###"
		mask: {
			type: String,
			required: true
		}
	},

	emits: [ "update:modelValue" ],

	data() {
		return {
			displayValue: ""
		}
	},

	watch: {
		modelValue: {
			immediate: true,
			handler(newVal) {
				this.displayValue = this.applyMask(newVal);
			}
		}
	},

	methods: {
		applyMask(value) {
			const digits = (value || "").replace(/\D/g, "");
			let result = "";
			let index = 0;

			for (const char of this.mask) {
				if (index >= digits.length)
					break;

				if (char === "#") {
					result += digits[index++];
				}
				else {
					result += char;
				}
			}

			return result;
		},

		onUpdate(value) {
			// Assign the raw value first so the field re-renders even when the masked value does not change
			this.displayValue = value;

			const masked = this.applyMask(value);

			this.$nextTick(() => {
				this.displayValue = masked;
				this.$emit("update:modelValue", masked);
			});
		}
	}
}
</script>
