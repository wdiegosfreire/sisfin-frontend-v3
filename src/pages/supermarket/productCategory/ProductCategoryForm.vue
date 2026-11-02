<template>
	<v-dialog v-model="appStore.globalDialog" width="800">
		<v-card class="mb-3">
			<v-toolbar>
				<v-toolbar-title>
					<span v-if="this.productCategory.identity">Edit Product Category</span>
					<span v-else>New Product Category</span>
				</v-toolbar-title>
			</v-toolbar>

			<v-card-text>
				<df-grid v-if="productCategory.identity">
					<v-text-field label="Identity" readonly v-model="productCategory.identity" />
				</df-grid>
				<df-grid>
					<v-text-field label="Name" v-model="productCategory.name" autofocus />
				</df-grid>
			</v-card-text>

			<v-card-actions>
				<v-btn v-if="this.productCategory.identity" width="150" @click="executeEdition" variant="tonal" color="primary">Confirm</v-btn>
				<v-btn v-else width="150" @click="executeRegistration" variant="tonal" color="primary">Confirm</v-btn>

				<v-btn width="150" @click="cleanForm" variant="tonal">Clear</v-btn>
				<v-btn width="150" @click="$emit('closeForm', productCategory)" variant="tonal">Close</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { useAppStore } from '@/stores/app';

import DfGrid from "../../../components/grid/Grid.vue";

import message from "../../../components/mixins/message.js";

export default {
	name: "ProductCategoryForm",

	components: { DfGrid },

	mixins: [ message],

	props: {
		formData: {
			type: Object,
			required: true
		}
	},

	data() {
		return {
			productCategory: this.formData
		}
	},

	methods: {
		executeRegistration() {
			if (this.isMissingRequiredFields()) {
				return;
			}

			this.$emit('executeRegistration', this.productCategory);
		},

		executeEdition() {
			if (this.isMissingIdentity() || this.isMissingRequiredFields()) {
				return;
			}

			this.$emit('executeEdition', this.productCategory);
		},

		isMissingIdentity() {
			if (!this.productCategory.identity) {
				this.$_message_showRequired("Missing product category identity.");
				return true;
			}

			return false;
		},

		isMissingRequiredFields() {
			if (!this.productCategory.name || !this.productCategory.name.trim()) {
				this.$_message_showRequired("Missing product category name.");
				return true;
			}

			return false;
		},

		cleanForm() {
			this.productCategory.name = null;
		}
	},

	computed: {
		appStore() {
			return useAppStore()
		},
	}
};
</script>
