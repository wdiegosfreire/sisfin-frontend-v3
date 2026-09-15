<template>
	<v-dialog v-model="appStore.globalDialog" width="800">
		<v-card class="mb-3">
			<v-toolbar>
				<v-toolbar-title>
					<span v-if="this.brand.identity">Edit Brand</span>
					<span v-else>New Brand</span>
				</v-toolbar-title>
			</v-toolbar>

			<v-card-text>
				<df-grid v-if="brand.identity">
					<v-text-field label="Identity" readonly v-model="brand.identity" />
				</df-grid>
				<df-grid>
					<v-text-field label="Name" v-model="brand.name" autofocus />
				</df-grid>
				<df-grid>
					<v-text-field label="Email" v-model="brand.email" />
				</df-grid>
				<df-grid>
					<v-text-field label="Website" v-model="brand.website" />
				</df-grid>
			</v-card-text>

			<v-card-actions>
				<v-btn v-if="this.brand.identity" width="150" @click="executeEdition" variant="tonal" color="primary">Confirm</v-btn>
				<v-btn v-else width="150" @click="executeRegistration" variant="tonal" color="primary">Confirm</v-btn>

				<v-btn width="150" @click="cleanForm" variant="tonal">Clear</v-btn>
				<v-btn width="150" @click="$emit('closeForm', brand)" variant="tonal">Close</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { useAppStore } from '@/stores/app';

import DfGrid from "../../../components/grid/Grid.vue";

import message from "../../../components/mixins/message.js";

export default {
	name: "BrandForm",

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
			brand: this.formData
		}
	},

	methods: {
		executeRegistration() {
			if (this.isMissingRequiredFields() || this.isInvalidEmail()) {
				return;
			}

			this.$emit('executeRegistration', this.brand);
		},

		executeEdition() {
			if (this.isMissingIdentity() || this.isMissingRequiredFields() || this.isInvalidEmail()) {
				return;
			}

			this.$emit('executeEdition', this.brand);
		},

		isMissingIdentity() {
			if (!this.brand.identity) {
				this.$_message_showRequired("Missing brand identity.");
				return true;
			}

			return false;
		},

		isMissingRequiredFields() {
			if (!this.brand.name || !this.brand.name.trim()) {
				this.$_message_showRequired("Mising brand name.");
				return true;
			}

			return false;
		},

		isInvalidEmail() {
			const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

			if (this.brand.email && !emailPattern.test(this.brand.email.trim())) {
				this.$_message_showRequired("Invalid brand email format.");
				return true;
			}

			return false;
		},

		cleanForm() {
			if (!this.brand.identity) {
				this.brand.name = "";
			}

			this.brand.email = "";
			this.brand.website = "";
		}
	},

	computed: {
		appStore() {
			return useAppStore()
		},
	}
};
</script>
