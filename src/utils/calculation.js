export function calculateItemTotalValue(unitaryValue, amount, mode) {
	// toFixed(6) removes floating point noise (e.g. 0.29 * 100 = 28.999999999999996, 0.25 * 59.9 = 14.974999999999999) before rounding/truncating
	const cents = Number((unitaryValue * amount * 100).toFixed(6));

	if (mode === "truncate")
		return Math.trunc(cents) / 100;

	// Half away from zero (Math.round alone rounds -0.5 toward +Infinity)
	return Math.sign(cents) * Math.round(Math.abs(cents)) / 100;
}

export function calculateItemsTotal(itemList, mode) {
	const total = itemList.reduce((acc, item) => acc + calculateItemTotalValue(item.unitaryValue, item.amount, mode), 0);

	return Number(total.toFixed(2));
}

export function calculateMovementsTotal(movementList) {
	const total = movementList.reduce((acc, item) => acc + item.value, 0);

	return Number(total.toFixed(2));
}

// Returns "round" or "truncate" when the items total matches the movements total by that mode; otherwise null
export function detectCalculationMode(itemList, totalMovements) {
	if (calculateItemsTotal(itemList, "round") === totalMovements)
		return "round";

	if (calculateItemsTotal(itemList, "truncate") === totalMovements)
		return "truncate";

	return null;
}
