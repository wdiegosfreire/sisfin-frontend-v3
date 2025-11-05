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

export function toBrasilianDate(date) {
	if (!date)
		return "";

	date = new Date(date);
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
	const year = date.getFullYear();

	return `${day}/${month}/${year}`;
}
