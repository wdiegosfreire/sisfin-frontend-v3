<template>
	<v-dialog v-model="appStore.globalDialog" width="800">
		<v-card class="mb-3">
			<v-toolbar>
				<v-toolbar-title>
					<span v-if="this.measurementUnit.identity">Edit Measurement Unit</span>
					<span v-else>New Measurement Unit</span>
				</v-toolbar-title>
			</v-toolbar>

			<v-card-text>
				<df-grid v-if="measurementUnit.identity">
					<v-text-field label="Identity" readonly v-model="measurementUnit.identity" />
				</df-grid>
				<df-grid>
					<v-text-field label="Name" v-model="measurementUnit.name" autofocus />
				</df-grid>
				<df-grid>
					<v-text-field label="Acronym" v-model="measurementUnit.acronym" />
					<v-text-field label="Divider" v-model="measurementUnit.divider" type="number" min="1" step="1" />
				</df-grid>
			</v-card-text>

			<v-card-actions>
				<v-btn v-if="this.measurementUnit.identity" width="150" @click="executeEdition" variant="tonal" color="primary">Confirm</v-btn>
				<v-btn v-else width="150" @click="executeRegistration" variant="tonal" color="primary">Confirm</v-btn>

				<v-btn width="150" @click="cleanForm" variant="tonal">Clear</v-btn>
				<v-btn width="150" @click="$emit('closeForm', measurementUnit)" variant="tonal">Close</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { useAppStore } from '@/stores/app';

import DfGrid from "../../../components/grid/Grid.vue";

import message from "../../../components/mixins/message.js";

export default {
	name: "MeasurementUnitForm",

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
			measurementUnit: this.formData
		}
	},

	methods: {
		executeRegistration() {
			if (this.isMissingRequiredFields() || this.isInvalidDivider()) {
				return;
			}

			this.$emit('executeRegistration', this.measurementUnit);
		},

		executeEdition() {
			if (this.isMissingIdentity() || this.isMissingRequiredFields() || this.isInvalidDivider()) {
				return;
			}

			this.$emit('executeEdition', this.measurementUnit);
		},

		isMissingIdentity() {
			if (!this.measurementUnit.identity) {
				this.$_message_showRequired("Missing measurement unit identity.");
				return true;
			}

			return false;
		},

		isMissingRequiredFields() {
			if (!this.measurementUnit.name || !this.measurementUnit.name.trim()) {
				this.$_message_showRequired("Missing measurement unit name.");
				return true;
			}

			if (!this.measurementUnit.acronym || !this.measurementUnit.acronym.trim()) {
				this.$_message_showRequired("Missing measurement unit acronym.");
				return true;
			}

			if (this.measurementUnit.divider === null || this.measurementUnit.divider === undefined || String(this.measurementUnit.divider).trim() === "") {
				this.$_message_showRequired("Missing measurement unit divider.");
				return true;
			}

			return false;
		},

		isInvalidDivider() {
			const dividerPattern = /^[1-9]\d*$/;

			if (!dividerPattern.test(String(this.measurementUnit.divider).trim())) {
				this.$_message_showRequired("Invalid measurement unit divider. Use a positive integer number.");
				return true;
			}

			return false;
		},

		cleanForm() {
			this.measurementUnit.name = null;
			this.measurementUnit.acronym = null;
			this.measurementUnit.divider = null;
		}
	},

	computed: {
		appStore() {
			return useAppStore()
		},
	}
};
</script>
