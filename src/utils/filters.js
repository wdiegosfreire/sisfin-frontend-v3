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

	const dateObject = new Date(date);
	const day = String(dateObject.getDate()).padStart(2, '0');
	const month = String(dateObject.getMonth() + 1).padStart(2, '0');
	const year = dateObject.getFullYear();

	return `${day}/${month}/${year}`;
}

export function toUtcDate(dateStr) {
	const [day, month, year] = dateStr.split('/').map(Number);

	if (!day || !month || !year) {
		throw new Error("Formato inválido. Use DD/MM/YYYY, ex: 30/12/2025");
	}

	return new Date(year, month - 1, day);
}

function traceProductInfo(info) {
	if (!info.showInfo)
		return "";

	const description = info.description ?? "";

	return info.showLabel && info.productProperty?.name
		? `${info.productProperty.name} ${description}`
		: description;
}

export function traceProductDetails(product) {
	const brandName = product?.brand?.name && product.brand.name !== "N/A" ? product.brand.name : "";
	const quantity = `${product?.quantityPerItem ?? ""}${product?.measurementUnit?.acronym ?? ""}`;

	const infoList = Array.isArray(product?.productInfoList)
		? [...product.productInfoList]
			.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
			.map(traceProductInfo)
		: [];

	const baseText = [product?.productCategory?.name ?? "", brandName]
		.map(part => part.trim())
		.filter(part => part)
		.join(" ");

	return [baseText, ...infoList, quantity]
		.map(part => part.trim())
		.filter(part => part)
		.join(", ");
}
