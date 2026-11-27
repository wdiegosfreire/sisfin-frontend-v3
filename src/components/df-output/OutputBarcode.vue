<template>
	<div class="df-barcode" :title="error || value">
		<svg v-show="valid" ref="barcode"></svg>
		<span v-if="error" class="df-barcode-error text-error">
			<v-icon icon="mdi-alert-circle-outline" size="small" />
			{{ value }}
			<small>{{ error }}</small>
		</span>
		<span v-else-if="!valid">{{ value }}</span>
	</div>
</template>

<script>
import JsBarcode from "jsbarcode";

export default {
	name: "DfOutputBarcode",

	props: {
		value: { type: String, default: "" },
		height: { type: Number, default: 18},
		width: { type: Number, default: 1.5 },
		fontSize: { type: Number, default: 10 },
		displayValue: { type: Boolean, default: true }
	},

	data() {
		return {
			valid: false,
			error: ""
		};
	},

	watch: {
		value() {
			this.render();
		}
	},

	mounted() {
		this.render();
	},

	methods: {
		detectFormat(code) {
			if (/^\d{13}$/.test(code)) return "EAN13";
			if (/^\d{8}$/.test(code)) return "EAN8";
			if (/^\d{12}$/.test(code)) return "UPC";
			return "CODE128";
		},

		// GS1 check digit (EAN-8, UPC-A, EAN-13): weights 3 and 1 alternating from the right, excluding the check digit.
		hasValidCheckDigit(code) {
			const digits = code.split("").map(Number);
			const checkDigit = digits.pop();
			const sum = digits.reverse().reduce((total, digit, index) => total + digit * (index % 2 === 0 ? 3 : 1), 0);
			return (10 - (sum % 10)) % 10 === checkDigit;
		},

		formatName(format) {
			return { EAN13: "EAN-13", EAN8: "EAN-8", UPC: "UPC-A" }[format];
		},

		draw(code, format) {
			JsBarcode(this.$refs.barcode, code, {
				format,
				height: this.height,
				width: this.width,
				fontSize: this.fontSize,
				displayValue: this.displayValue,
				// EAN/UPC: draws as a plain rectangle with the number below, unsplit. Encoding is unchanged.
				flat: true,
				// Quiet zone (blank space on both sides) needed by readers: at least 10 bar widths.
				marginLeft: this.width * 11,
				marginRight: this.width * 11,
				marginTop: 2,
				marginBottom: 2,
				// Dark bars on a light background: inverted codes (light on dark) fail on many readers.
				background: "#ffffff",
				lineColor: "#000000"
			});
		},

		render() {
			const code = (this.value ?? "").toString().trim();
			this.valid = false;
			this.error = "";

			if (!code) return;

			const format = this.detectFormat(code);

			// A product code with a wrong check digit is a data error: shows a warning instead of drawing a barcode.
			if (format !== "CODE128" && !this.hasValidCheckDigit(code)) {
				this.error = `Invalid ${this.formatName(format)} check digit`;
				return;
			}

			try {
				this.draw(code, format);
				this.valid = true;
			}
			catch {
				this.valid = false;
			}
		}
	}
};
</script>

<style lang="css">
.df-barcode {
	display: inline-block;
	padding: 4px 0;
}

.df-barcode-error {
	display: inline-flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 4px;
}

.df-barcode svg {
	display: block;
}
</style>
