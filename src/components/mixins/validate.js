export default {
	name: "validate",

	methods: {
		$_validate_currencyToNumber(value, precision) {
			if (!precision) {
				precision = 2
			}

			if (value.indexOf("R$ ") != -1) {
				value = value.split(" ")[1];
			}

			value = value.replaceAll(".", "");
			value = value.replace(",", ".");

			return parseFloat(value).toFixed(precision);
		},
	}
}
