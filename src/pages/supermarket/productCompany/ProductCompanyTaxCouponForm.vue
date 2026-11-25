<template>
	<v-dialog v-model="appStore.globalDialog" width="800">
		<v-card class="mb-3">
			<v-toolbar>
				<v-toolbar-title>Import Tax Coupon</v-toolbar-title>
			</v-toolbar>

			<v-card-text>
				<df-grid>
					<v-file-input v-model="taxCoupon.taxCouponFile" label="Tax Coupon File (json)" accept=".json,application/json" append-icon="mdi-file" prepend-icon="" />
				</df-grid>
			</v-card-text>

			<v-card-actions>
				<v-btn width="150" @click="executeRegistration" variant="tonal" color="primary">Confirm</v-btn>
				<v-btn width="150" @click="cleanForm" variant="tonal">Clear</v-btn>
				<v-btn width="150" @click="$emit('closeForm', taxCoupon)" variant="tonal">Close</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { useAppStore } from '@/stores/app';

import DfGrid from "@/components/grid/Grid.vue";

import message from "@/components/mixins/message.js";

export default {
	name: "ProductCompanyTaxCouponForm",

	components: { DfGrid },

	mixins: [ message ],

	emits: [ "executeRegistration", "closeForm" ],

	data() {
		return {
			taxCoupon: {
				taxCouponFile: null
			}
		}
	},

	methods: {
		executeRegistration() {
			if (this.isMissingFile() || this.isInvalidFileType()) {
				return;
			}

			this.$emit('executeRegistration', this.selectedFile);
		},

		isMissingFile() {
			if (!this.selectedFile) {
				this.$_message_showRequired("Missing tax coupon file.");
				return true;
			}

			return false;
		},

		isInvalidFileType() {
			if (!this.selectedFile.name.toLowerCase().endsWith(".json")) {
				this.$_message_showRequired("Only json files are allowed.");
				return true;
			}

			return false;
		},

		cleanForm() {
			this.taxCoupon.taxCouponFile = null;
		}
	},

	computed: {
		appStore() {
			return useAppStore()
		},

		selectedFile() {
			const file = this.taxCoupon.taxCouponFile;
			return Array.isArray(file) ? file[0] : file;
		}
	}
};
</script>
