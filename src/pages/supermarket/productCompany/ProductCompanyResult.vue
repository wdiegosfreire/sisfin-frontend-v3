<template>
	<v-data-table
		:headers="headers"
		:items="collection"
		:search="search"
		:items-per-page="10"
		:items-per-page-options="itemsPerPageOptions"
		item-value="identity"
		density="comfortable"
		no-data-text="No results found."
		hover
	>
		<template v-slot:top>
			<v-text-field v-model="search" label="Filter" prepend-inner-icon="mdi-magnify" variant="outlined" density="compact" hide-details clearable class="mb-4" />
		</template>

		<template v-slot:[`item.identity`]="{ item }">
			<span :title="item.identity">{{ item.identity?.split("-")[0] }}</span>
		</template>

		<template v-slot:[`item.barcode`]="{ value }">
			<df-output-barcode v-if="value" :value="value" />
		</template>

		<template v-slot:[`item.actions`]="{ item }">
			<v-menu>
				<template v-slot:activator="{ props }">
					<v-btn v-bind="props" variant="text" icon="mdi-menu" />
				</template>
				<v-list width="150">
					<v-list-item v-if="hasProductInfo(item)" @click="openProductInfoDialog(item)" title="Details" append-icon="mdi-information-outline" />
					<v-list-item @click="$emit('accessEdition', item)" title="Edit" append-icon="mdi-file-document-edit-outline" />
					<v-list-item @click="$emit('executeExclusion', item)" title="Delete" append-icon="mdi-trash-can-outline" />
				</v-list>
			</v-menu>
		</template>
	</v-data-table>

	<v-dialog v-model="productInfoDialog" width="800">
		<v-card>
			<v-toolbar>
				<v-toolbar-title>Product Information</v-toolbar-title>
			</v-toolbar>

			<v-card-text>
				<div v-if="selectedItem" class="text-subtitle-1 mb-3">{{ selectedItem.description }}</div>
				<v-data-table :items="selectedProductInfoList" :headers="productInfoHeaders" :items-per-page="-1" density="compact" no-data-text="No information added." hide-default-footer />
			</v-card-text>

			<v-card-actions>
				<v-btn width="150" @click="closeProductInfoDialog" variant="tonal">Close</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import DfOutputBarcode from "@/components/df-output/OutputBarcode.vue";

export default {
	name: "ProductCompanyResult",

	components: { DfOutputBarcode },

	emits: ["accessEdition", "executeExclusion"],

	props: {
		collection: {
			type: Array,
			required: true
		}
	},

	data() {
		return {
			search: "",
			headers: [
				{ title: "Identity", key: "identity", cellProps: { class: "df-identity" } },
				{ title: "Company", key: "company", align: "start", value: item => item.company?.fantasyName || item.company?.name || "" },
				{ title: "Code", key: "code", align: "start" },
				{ title: "Description", key: "description", align: "start" },
				{ title: "Product Details", key: "productCategoryName", align: "start", value: item => `${item.product?.productCategory?.name ?? ""} ${item.product?.brand?.name && item.product?.brand?.name !== "N/A" ? item.product?.brand?.name : ""} ${item.product?.quantityPerItem ?? ""}${item.product?.measurementUnit?.acronym ?? ""}` },
				{ title: "Barcode", key: "barcode", align: "start", value: item => item.product?.barcode ?? "" },
				{ title: "", key: "actions", align: "end", sortable: false }
			],
			productInfoHeaders: [
				{ title: "Order", key: "order", align: "end", width: 100, sortable: false },
				{ title: "Property", key: "productProperty", align: "start", sortable: false, value: info => info.productProperty?.name ?? "" },
				{ title: "Description", key: "description", align: "start", sortable: false }
			],
			itemsPerPageOptions: [
				{ value: 10, title: "10" },
				{ value: 50, title: "50" },
				{ value: 100, title: "100" },
				{ value: -1, title: "All" }
			],
			productInfoDialog: false,
			selectedItem: null
		};
	},

	computed: {
		selectedProductInfoList() {
			const list = this.selectedItem?.product?.productInfoList;
			return Array.isArray(list) ? [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) : [];
		}
	},

	methods: {
		hasProductInfo(item) {
			return Array.isArray(item.product?.productInfoList) && item.product.productInfoList.length > 0;
		},

		openProductInfoDialog(item) {
			this.selectedItem = item;
			this.productInfoDialog = true;
		},

		closeProductInfoDialog() {
			this.productInfoDialog = false;
		}
	}
};
</script>
