<template>
	<v-dialog v-model="appStore.globalDialog" width="800">
		<v-card class="mb-3">
			<v-toolbar>
				<v-toolbar-title>
					<span v-if="this.company.identity">Edit Company</span>
					<span v-else>New Company</span>
				</v-toolbar-title>
			</v-toolbar>

			<v-card-text>
				<df-grid v-if="company.identity">
					<v-text-field label="Identity" readonly v-model="company.identity" />
				</df-grid>
				<df-grid>
					<v-text-field label="Tax Number" v-model="company.taxNumber" autofocus />
				</df-grid>
				<df-grid>
					<v-text-field label="Name" v-model="company.name" />
				</df-grid>
				<df-grid>
					<v-text-field label="Fantasy Name" v-model="company.fantasyName" />
				</df-grid>
				<df-grid>
					<v-checkbox label="Inactive" v-model="company.isInactive" />
				</df-grid>

				<df-grid>
					<v-text-field label="Street" v-model="company.address.street" :readonly="!!company.identity" />
					<v-text-field label="Number" v-model="company.address.number" :readonly="!!company.identity" />
				</df-grid>
				<df-grid>
					<v-text-field label="Neighborhood" v-model="company.address.neighborhood" :readonly="!!company.identity" />
					<v-text-field label="Zip Code" v-model="company.address.zipCode" :readonly="!!company.identity" />
					<v-text-field label="City" v-model="company.address.city" :readonly="!!company.identity" />
				</df-grid>
			</v-card-text>

			<v-card-actions>
				<v-btn v-if="this.company.identity" width="150" @click="executeEdition" variant="tonal" color="primary">Confirm</v-btn>
				<v-btn v-else width="150" @click="executeRegistration" variant="tonal" color="primary">Confirm</v-btn>

				<v-btn width="150" @click="cleanForm" variant="tonal">Clear</v-btn>
				<v-btn width="150" @click="$emit('closeForm', company)" variant="tonal">Close</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { useAppStore } from '@/stores/app';

import DfGrid from "@/components/grid/Grid.vue";

import message from "@/components/mixins/message.js";

export default {
	name: "CompanyForm",

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
			company: this.formData
		}
	},

	methods: {
		executeRegistration() {
			if (this.isMissingRequiredFields() || this.isMissingAddressFields()) {
				return;
			}

			this.$emit('executeRegistration', this.company);
		},

		executeEdition() {
			if (this.isMissingIdentity() || this.isMissingRequiredFields()) {
				return;
			}

			this.$emit('executeEdition', this.company);
		},

		isMissingIdentity() {
			if (!this.company.identity) {
				this.$_message_showRequired("Missing company identity.");
				return true;
			}

			return false;
		},

		isMissingRequiredFields() {
			if (!this.company.taxNumber || !this.company.taxNumber.trim()) {
				this.$_message_showRequired("Missing company tax number.");
				return true;
			}

			if (!this.company.name || !this.company.name.trim()) {
				this.$_message_showRequired("Missing company name.");
				return true;
			}

			return false;
		},

		isMissingAddressFields() {
			const address = this.company.address;

			if (!address.street || !address.number || !address.neighborhood || !address.zipCode || !address.city) {
				this.$_message_showRequired("Missing address fields.");
				return true;
			}

			return false;
		},

		cleanForm() {
			if (!this.company.identity) {
				this.company.taxNumber = "";
				this.company.name = "";
				this.company.address = {};
			}

			this.company.fantasyName = "";
			this.company.isInactive = false;
		}
	},

	computed: {
		appStore() {
			return useAppStore()
		},
	}
};
</script>
