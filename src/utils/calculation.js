export function calculateItemTotalValue(unitaryValue, amount, mode) {
	if (mode === "truncate") {
		// toFixed(6) removes floating point noise (e.g. 0.29 * 100 = 28.999999999999996) before truncating
		const cents = Number((unitaryValue * amount * 100).toFixed(6));
		return Math.trunc(cents) / 100;
	}

	return Number((unitaryValue * amount).toFixed(2));
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
