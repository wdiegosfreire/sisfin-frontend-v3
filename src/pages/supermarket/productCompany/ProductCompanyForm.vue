<template>
	<v-dialog v-model="appStore.globalDialog" width="1100">
		<v-card class="mb-3">
			<v-toolbar>
				<v-toolbar-title>Edit Product Company</v-toolbar-title>
			</v-toolbar>

			<v-card-text>
				<df-grid>
					<v-text-field label="Identity" readonly :model-value="productCompany.identity" />
				</df-grid>
				<df-grid>
					<v-text-field label="Company" readonly :model-value="traceCompany(productCompany.company)" />
					<v-text-field label="Code" readonly :model-value="productCompany.code" />
					<v-text-field label="Description" readonly :model-value="productCompany.description" />
				</df-grid>

				<v-data-table
					v-model="selectedProductIdentities"
					:headers="productHeaders"
					:items="productListTable"
					:search="productSearch"
					:items-per-page="10"
					:items-per-page-options="itemsPerPageOptions"
					item-value="identity"
					select-strategy="single"
					density="compact"
					no-data-text="No products found."
					show-select
					hover
					@click:row="selectProductRow"
				>
					<template v-slot:top>
						<v-text-field v-model="productSearch" label="Filter products" prepend-inner-icon="mdi-magnify" variant="outlined" density="compact" hide-details clearable class="mb-4" />
					</template>

					<template v-slot:[`item.identity`]="{ item }">
						<span :title="item.identity">{{ item.identity?.split("-")[0] }}</span>
					</template>
				</v-data-table>
			</v-card-text>

			<v-card-actions>
				<v-btn width="150" @click="executeEdition" variant="tonal" color="primary">Confirm</v-btn>
				<v-btn width="150" @click="cleanForm" variant="tonal">Clear</v-btn>
				<v-btn width="150" @click="$emit('closeForm', productCompany)" variant="tonal">Close</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { useAppStore } from '@/stores/app';

import DfGrid from "@/components/grid/Grid.vue";

import message from "@/components/mixins/message.js";

export default {
	name: "ProductCompanyForm",

	components: { DfGrid },

	mixins: [ message ],

	props: {
		formData: {
			type: Object,
			required: true
		},

		productListTable: {
			type: Array,
			required: true
		}
	},

	data() {
		return {
			productCompany: this.formData,
			selectedProductIdentities: this.formData.product?.identity ? [this.formData.product.identity] : [],
			productSearch: "",
			productHeaders: [
				{ title: "Identity", key: "identity", cellProps: { class: "df-identity" } },
				{ title: "Category", key: "productCategory", align: "start", value: item => item.productCategory?.name ?? "" },
				{ title: "Brand", key: "brand", align: "start", value: item => item.brand?.name ?? "" },
				{ title: "Quantity per Item", key: "quantityPerItem", align: "end", value: item => `${item.quantityPerItem ?? ""} ${item.measurementUnit?.acronym ?? ""}`.trim() },
				{ title: "Barcode", key: "barcode", align: "start" }
			],
			itemsPerPageOptions: [
				{ value: 10, title: "10" },
				{ value: 50, title: "50" },
				{ value: 100, title: "100" },
				{ value: -1, title: "All" }
			]
		}
	},

	methods: {
		executeEdition() {
			if (this.isMissingIdentity() || this.isMissingSelectedProduct()) {
				return;
			}

			this.productCompany.product = this.selectedProduct;
			this.$emit('executeEdition', this.productCompany);
		},

		isMissingIdentity() {
			if (!this.productCompany.identity) {
				this.$_message_showRequired("Missing product company identity.");
				return true;
			}

			return false;
		},

		isMissingSelectedProduct() {
			if (!this.selectedProduct) {
				this.$_message_showRequired("Select a product to associate with the product company.");
				return true;
			}

			return false;
		},

		selectProductRow(event, { item }) {
			this.selectedProductIdentities = [item.identity];
		},

		cleanForm() {
			this.selectedProductIdentities = [];
		},

		traceCompany(item) {
			if (!item)
				return "";

			return item.fantasyName || item.name || "";
		}
	},

	computed: {
		appStore() {
			return useAppStore()
		},

		selectedProduct() {
			const identity = this.selectedProductIdentities[0];

			if (!identity)
				return undefined;

			return this.productListTable.find(product => product.identity === identity);
		}
	}
};
</script>
