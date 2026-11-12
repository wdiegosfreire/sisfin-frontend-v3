<template>
	<v-dialog v-model="appStore.globalDialog" width="1000">
		<v-card class="mb-3">
			<v-toolbar>
				<v-toolbar-title>
					<span v-if="this.product.identity">Edit Product</span>
					<span v-else>New Product</span>
				</v-toolbar-title>
			</v-toolbar>

			<v-card-text>
				<df-grid v-if="product.identity">
					<v-text-field label="Identity" readonly v-model="product.identity" />
				</df-grid>
				<df-grid>
					<v-autocomplete label="Product Category" v-model="product.productCategory" item-title="name" item-value="identity" :items="productCategoryListCombo" return-object autofocus />
				</df-grid>
				<df-grid>
					<v-autocomplete label="Brand" v-model="product.brand" item-title="name" item-value="identity" :items="brandListCombo" return-object />
				</df-grid>
				<df-grid>
					<df-grid column="fixed-2">
						<v-text-field label="Items per Barcode" type="number" min="1" v-model.number="product.itemPerBarcode" />
						<v-text-field label="Quantity per Item" type="number" min="1" v-model.number="product.quantityPerItem" />
					</df-grid>
					<df-grid column="fixed-2">
						<v-autocomplete label="Measurement Unit" v-model="product.measurementUnit" :item-title="traceMeasurementUnit" item-value="identity" :items="measurementUnitListCombo" return-object />
						<v-text-field label="Barcode" v-model="product.barcode" />
					</df-grid>
				</df-grid>
				<df-grid>
					<v-checkbox label="Favorite" v-model="product.isFavorite" />
				</df-grid>

				<v-divider class="my-4" />

				<div class="text-subtitle-1 mb-3">Product Information</div>

				<df-grid>
					<df-grid column="fixed-2">
						<v-text-field label="Order" :model-value="nextProductInfoOrder()" readonly />
						<v-autocomplete label="Property" v-model="productInfo.productProperty" item-title="name" item-value="identity" :items="productPropertyListTable" return-object />
					</df-grid>
					<df-grid column="fixed-2">
						<v-text-field label="Description" v-model="productInfo.description" @keyup.enter="addProductInfo" />
						<v-btn class="mt-2" height="40" @click="addProductInfo" variant="tonal" color="primary" prepend-icon="mdi-plus">Add</v-btn>
					</df-grid>
				</df-grid>

				<v-data-table
					:headers="productInfoHeaders"
					:items="product.productInfoList"
					density="compact"
					no-data-text="No information added."
					hide-default-footer
					:items-per-page="-1"
				>
					<template v-slot:[`item.actions`]="{ item }">
						<v-btn @click="removeProductInfo(item)" title="Remove" icon="mdi-trash-can-outline" variant="text" size="small" />
					</template>
				</v-data-table>
			</v-card-text>

			<v-card-actions>
				<v-btn v-if="this.product.identity" width="150" @click="executeEdition" variant="tonal" color="primary">Confirm</v-btn>
				<v-btn v-else width="150" @click="executeRegistration" variant="tonal" color="primary">Confirm</v-btn>

				<v-btn width="150" @click="cleanForm" variant="tonal">Clear</v-btn>
				<v-btn width="150" @click="$emit('closeForm', product)" variant="tonal">Close</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { useAppStore } from '@/stores/app';

import DfGrid from "@/components/grid/Grid.vue";

import message from "@/components/mixins/message.js";

export default {
	name: "ProductForm",

	components: { DfGrid },

	mixins: [ message ],

	props: {
		formData: {
			type: Object,
			required: true
		},

		brandListCombo: {
			type: Array,
			required: true
		},

		productCategoryListCombo: {
			type: Array,
			required: true
		},

		measurementUnitListCombo: {
			type: Array,
			required: true
		},

		productPropertyListTable: {
			type: Array,
			required: true
		}
	},

	data() {
		return {
			product: this.formData,
			productInfo: this.newProductInfo(),
			productInfoHeaders: [
				{ title: "Order", key: "order", align: "end", width: 100, sortable: false },
				{ title: "Property", key: "productProperty", align: "start", sortable: false, value: item => item.productProperty?.name ?? "" },
				{ title: "Description", key: "description", align: "start", sortable: false },
				{ title: "", key: "actions", align: "end", sortable: false, width: 60 }
			]
		}
	},

	created() {
		if (this.product.isFavorite === undefined || this.product.isFavorite === null) {
			this.product.isFavorite = false;
		}

		if (!Array.isArray(this.product.productInfoList)) {
			this.product.productInfoList = [];
		}

		this.product.productInfoList.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
	},

	methods: {
		executeRegistration() {
			if (this.isMissingRequiredFields()) {
				return;
			}

			this.$emit('executeRegistration', this.product);
		},

		executeEdition() {
			if (this.isMissingIdentity() || this.isMissingRequiredFields()) {
				return;
			}

			this.$emit('executeEdition', this.product);
		},

		isMissingIdentity() {
			if (!this.product.identity) {
				this.$_message_showRequired("Missing product identity.");
				return true;
			}

			return false;
		},

		isMissingRequiredFields() {
			if (!this.product.barcode || !this.product.barcode.trim()) {
				this.$_message_showRequired("Missing product barcode.");
				return true;
			}

			if (!this.product.brand || !this.product.brand.identity) {
				this.$_message_showRequired("Missing product's brand.");
				return true;
			}

			if (!this.product.productCategory || !this.product.productCategory.identity) {
				this.$_message_showRequired("Missing product's category.");
				return true;
			}

			if (!Number.isInteger(this.product.itemPerBarcode)) {
				this.$_message_showRequired("Missing product items per barcode.");
				return true;
			}

			if (!Number.isInteger(this.product.quantityPerItem)) {
				this.$_message_showRequired("Missing product quantity per item.");
				return true;
			}

			if (!this.product.measurementUnit || !this.product.measurementUnit.identity) {
				this.$_message_showRequired("Missing product's measurement unit.");
				return true;
			}

			return false;
		},

		cleanForm() {
			this.product.barcode = "";
			this.product.itemPerBarcode = null;
			this.product.quantityPerItem = null;
			this.product.isFavorite = false;
			this.product.brand = undefined;
			this.product.productCategory = undefined;
			this.product.measurementUnit = undefined;
			this.product.productInfoList = [];
			this.productInfo = this.newProductInfo();
		},

		newProductInfo() {
			return { description: "", productProperty: undefined };
		},

		nextProductInfoOrder() {
			return this.product.productInfoList.reduce((max, item) => Math.max(max, item.order ?? 0), 0) + 1;
		},

		reorderProductInfoList() {
			this.product.productInfoList.forEach((item, index) => {
				item.order = index + 1;
			});
		},

		addProductInfo() {
			if (!this.productInfo.productProperty || !this.productInfo.productProperty.identity) {
				this.$_message_showRequired("Missing information property.");
				return;
			}

			if (!this.productInfo.description || !this.productInfo.description.trim()) {
				this.$_message_showRequired("Missing information description.");
				return;
			}

			this.product.productInfoList.push({
				order: this.nextProductInfoOrder(),
				description: this.productInfo.description.trim(),
				productProperty: this.productInfo.productProperty
			});

			this.productInfo = this.newProductInfo();
		},

		removeProductInfo(item) {
			const index = this.product.productInfoList.indexOf(item);

			if (index >= 0) {
				this.product.productInfoList.splice(index, 1);
				this.reorderProductInfoList();
			}
		},

		traceMeasurementUnit(item) {
			if (!item || !item.name)
				return "";

			return item.acronym ? `${item.name} (${item.acronym})` : item.name;
		}
	},

	computed: {
		appStore() {
			return useAppStore()
		},
	}
};
</script>
