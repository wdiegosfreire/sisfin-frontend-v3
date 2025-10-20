export function traceAccount(account) {
	if (!account) return "";

	let result = account.name;

	if (account.accountParent) {
		result = `${account.accountParent.name} :: ${result}`;

		if (account.accountParent.accountParent) {
			result = `${account.accountParent.accountParent.name} :: ${result}`;
		}
	}

	return result;
}

export function currency(value, precision = 2) {
	if (precision !== 2 && precision !== 3) {
		precision = 2;
	}

	const formatter = new Intl.NumberFormat("pt-BR", {
		style: 'decimal',
		minimumFractionDigits: precision,
		maximumFractionDigits: precision
	});

	return formatter.format(value);
}
