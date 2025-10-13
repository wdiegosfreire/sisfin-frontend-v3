export default {
	name: "format",
	methods: {
		$_format_currencyToNumber(value, precision) {
			if (!precision)
				precision = 2

			if (!isNaN(value)) {
				return Number(parseFloat(value).toFixed(precision));
			}

			if (value.indexOf("R$ ") != -1) {
				value = value.split(" ")[1];
			}

			value = value.replaceAll(".", "");
			value = value.replace(",", ".");

			return Number(parseFloat(value).toFixed(precision));
		},

		$_format_numberToCurrency(value, precision) {
			if (!precision || (precision != 2 && precision != 3))
				precision = 2

			const formatter = new Intl.NumberFormat("pt-BR", {
				style: 'decimal',
				minimumFractionDigits: precision,
				maximumFractionDigits: precision
			});

			return formatter.format(value);
		},

		$_format_toAmericanDate(value) {
			// 10/10/2020

			let dateSplited = value.split("/");
		
			return `${dateSplited[2]}-${dateSplited[1]}-${dateSplited[0]}`;
		}
	}
}