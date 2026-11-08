<template>
	<v-dialog v-model="appStore.globalDialog" width="800">
		<v-card class="mb-3">
			<v-toolbar>
				<v-toolbar-title>
					<span v-if="this.productCompany.identity">Edit Product Company</span>
					<span v-else>New Product Company</span>
				</v-toolbar-title>
			</v-toolbar>

			<v-card-text>
				<df-grid v-if="productCompany.identity">
					<v-text-field label="Identity" readonly v-model="productCompany.identity" />
				</df-grid>
				<df-grid>
					<v-autocomplete label="Company" v-model="productCompany.company" :item-title="traceCompany" item-value="identity" :items="companyListCombo" return-object autofocus />
				</df-grid>
				<df-grid>
					<v-autocomplete label="Product" v-model="productCompany.product" :item-title="traceProduct" item-value="identity" :items="productListCombo" return-object />
				</df-grid>
				<df-grid>
					<v-text-field label="Code" v-model="productCompany.code" />
				</df-grid>
				<df-grid>
					<v-text-field label="Description" v-model="productCompany.description" />
				</df-grid>
			</v-card-text>

			<v-card-actions>
				<v-btn v-if="this.productCompany.identity" width="150" @click="executeEdition" variant="tonal" color="primary">Confirm</v-btn>
				<v-btn v-else width="150" @click="executeRegistration" variant="tonal" color="primary">Confirm</v-btn>

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

		companyListCombo: {
			type: Array,
			required: true
		},

		productListCombo: {
			type: Array,
			required: true
		}
	},

	data() {
		return {
			productCompany: this.formData
		}
	},

	methods: {
		executeRegistration() {
			if (this.isMissingRequiredFields()) {
				return;
			}

			this.$emit('executeRegistration', this.productCompany);
		},

		executeEdition() {
			if (this.isMissingIdentity() || this.isMissingRequiredFields()) {
				return;
			}

			this.$emit('executeEdition', this.productCompany);
		},

		isMissingIdentity() {
			if (!this.productCompany.identity) {
				this.$_message_showRequired("Missing product company identity.");
				return true;
			}

			return false;
		},

		isMissingRequiredFields() {
			if (!this.productCompany.company || !this.productCompany.company.identity) {
				this.$_message_showRequired("Missing product company's company.");
				return true;
			}

			if (!this.productCompany.product || !this.productCompany.product.identity) {
				this.$_message_showRequired("Missing product company's product.");
				return true;
			}

			if (!this.productCompany.code || !this.productCompany.code.trim()) {
				this.$_message_showRequired("Missing product company code.");
				return true;
			}

			if (!this.productCompany.description || !this.productCompany.description.trim()) {
				this.$_message_showRequired("Missing product company description.");
				return true;
			}

			return false;
		},

		cleanForm() {
			this.productCompany.code = "";
			this.productCompany.description = "";
			this.productCompany.company = undefined;
			this.productCompany.product = undefined;
		},

		traceCompany(item) {
			if (!item)
				return "";

			return item.fantasyName || item.name || "";
		},

		traceProduct(item) {
			if (!item)
				return "";

			const category = item.productCategory?.name ?? "";
			const brand = item.brand?.name ?? "";
			const quantity = `${item.quantityPerItem ?? ""} ${item.measurementUnit?.acronym ?? ""}`.trim();
			const title = [category, brand, quantity].filter(Boolean).join(" - ");

			return item.barcode ? `${title} (${item.barcode})` : title;
		}
	},

	computed: {
		appStore() {
			return useAppStore()
		},
	}
};
</script>
