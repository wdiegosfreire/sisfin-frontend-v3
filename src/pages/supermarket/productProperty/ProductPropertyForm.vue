<template>
	<v-dialog v-model="appStore.globalDialog" width="800">
		<v-card class="mb-3">
			<v-toolbar>
				<v-toolbar-title>
					<span v-if="this.productProperty.identity">Edit Product Property</span>
					<span v-else>New Product Property</span>
				</v-toolbar-title>
			</v-toolbar>

			<v-card-text>
				<df-grid v-if="productProperty.identity">
					<v-text-field label="Identity" readonly v-model="productProperty.identity" />
				</df-grid>
				<df-grid>
					<v-text-field label="Name" v-model="productProperty.name" autofocus />
				</df-grid>
			</v-card-text>

			<v-card-actions>
				<v-btn v-if="this.productProperty.identity" width="150" @click="executeEdition" variant="tonal" color="primary">Confirm</v-btn>
				<v-btn v-else width="150" @click="executeRegistration" variant="tonal" color="primary">Confirm</v-btn>

				<v-btn width="150" @click="cleanForm" variant="tonal">Clear</v-btn>
				<v-btn width="150" @click="$emit('closeForm', productProperty)" variant="tonal">Close</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { useAppStore } from '@/stores/app';

import DfGrid from "../../../components/grid/Grid.vue";

import message from "../../../components/mixins/message.js";

export default {
	name: "ProductPropertyForm",

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
			productProperty: this.formData
		}
	},

	methods: {
		executeRegistration() {
			if (this.isMissingRequiredFields()) {
				return;
			}

			this.$emit('executeRegistration', this.productProperty);
		},

		executeEdition() {
			if (this.isMissingIdentity() || this.isMissingRequiredFields()) {
				return;
			}

			this.$emit('executeEdition', this.productProperty);
		},

		isMissingIdentity() {
			if (!this.productProperty.identity) {
				this.$_message_showRequired("Missing product property identity.");
				return true;
			}

			return false;
		},

		isMissingRequiredFields() {
			if (!this.productProperty.name || !this.productProperty.name.trim()) {
				this.$_message_showRequired("Missing product property name.");
				return true;
			}

			return false;
		},

		cleanForm() {
			this.productProperty.name = null;
		}
	},

	computed: {
		appStore() {
			return useAppStore()
		},
	}
};
</script>
