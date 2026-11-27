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
				<v-row dense>
					<v-col v-if="company.identity" cols="12">
						<v-text-field v-model="company.identity" label="Identity" tabindex="-1" readonly />
					</v-col>
					<v-col cols="12" md="9">
						<v-text-field label="Fantasy Name" v-model="company.fantasyName" autofocus />
					</v-col>
					<v-col cols="12" md="3">
						<v-switch v-model="company.isInactive" label="Inactive" color="primary" true-icon="mdi-check" false-icon="mdi-close" inset />
					</v-col>
					<v-col cols="12" md="9">
						<v-text-field v-model="company.name" label="Name" :tabindex="!!company.identity ? -1 : ''" :readonly="!!company.identity" />
					</v-col>
					<v-col cols="12" md="3">
						<df-input-mask v-model="company.taxNumber" label="Tax Number" :tabindex="!!company.identity ? -1 : ''" mask="##.###.###/####-##" :readonly="!!company.identity" />
					</v-col>
					<v-col cols="9">
						<v-text-field v-model="company.address.street" label="Street" />
					</v-col>
					<v-col cols="3">
						<v-text-field v-model="company.address.number" label="Number" />
					</v-col>

					<v-col cols="12" md="6">
						<v-text-field v-model="company.address.neighborhood" label="Neighborhood" />
					</v-col>
					<v-col cols="6" md="3">
						<df-input-mask v-model="company.address.zipCode" label="Zip Code" mask="#####-###" />
					</v-col>
					<v-col cols="6" md="3">
						<v-text-field v-model="company.address.city" label="City" />
					</v-col>
				</v-row>
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

import DfInputMask from "@/components/df-input/InputMask.vue";

import message from "@/components/mixins/message.js";

export default {
	name: "CompanyForm",

	components: { DfInputMask },

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
			if (this.isMissingIdentity() || this.isMissingRequiredFields() || this.isMissingAddressFields()) {
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
			}

			this.company.address = { identity: this.company.address?.identity };

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
