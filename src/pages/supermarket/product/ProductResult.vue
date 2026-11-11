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

		<template v-slot:[`item.isFavorite`]="{ item }">
			<v-icon v-if="item.isFavorite" icon="mdi-star" color="amber" size="small" />
		</template>

		<template v-slot:[`item.actions`]="{ item }">
			<v-menu>
				<template v-slot:activator="{ props }">
					<v-btn v-bind="props" variant="text" icon="mdi-menu" />
				</template>
				<v-list width="150">
					<v-list-item @click="$emit('accessEdition', item)" title="Edit" append-icon="mdi-file-document-edit-outline" />
					<v-list-item @click="$emit('executeExclusion', item)" title="Delete" append-icon="mdi-trash-can-outline" />
				</v-list>
			</v-menu>
		</template>
	</v-data-table>
</template>

<script>
import DfOutputBarcode from "@/components/df-output/OutputBarcode.vue";

export default {
	name: "ProductResult",

	components: { DfOutputBarcode },

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
				{ title: "Category", key: "productCategory", align: "start", value: item => item.productCategory?.name ?? "" },
				{ title: "Brand", key: "brand", align: "start", value: item => item.brand?.name ?? "" },
				{ title: "Quantity per Item", key: "quantityPerItem", align: "end", value: item => `${item.quantityPerItem ?? ""} ${item.measurementUnit?.acronym ?? ""}`.trim() },
				{ title: "Items per Barcode", key: "itemPerBarcode", align: "end" },
				{ title: "Barcode", key: "barcode", align: "start" },
				{ title: "Favorite", key: "isFavorite", align: "center" },
				{ title: "", key: "actions", align: "end", sortable: false }
			],
			itemsPerPageOptions: [
				{ value: 10, title: "10" },
				{ value: 50, title: "50" },
				{ value: 100, title: "100" },
				{ value: -1, title: "All" }
			]
		};
	}
};
</script>
