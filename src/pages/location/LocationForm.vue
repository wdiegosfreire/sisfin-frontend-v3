<template>
	<v-dialog persistent v-model="appStore.globalDialog" width="800">
		<v-card class="mb-3">
			<v-toolbar color="primary" height="35" dark flat>
				<v-toolbar-title>
					<span v-if="this.location.identity">Edit Location</span>
					<span v-else>New Location</span>
				</v-toolbar-title>
			</v-toolbar>

			<v-card-text>
				<df-grid v-if="location.identity">
					<v-text-field label="Identity" readonly v-model="location.identity" />
				</df-grid>
				<df-grid>
					<v-text-field label="Name" v-model="location.name" autofocus />
				</df-grid>
				<df-grid>
					<v-text-field label="Note" v-model="location.note" />
				</df-grid>
			</v-card-text>

			<v-card-actions>
				<v-btn v-if="this.location.identity" color="button" width="150" @click="executeEdition">Confirm</v-btn>
				<v-btn v-else width="150" @click="executeRegistration">Confirm</v-btn>

				<v-btn width="150" @click="cleanForm">Clear</v-btn>
				<v-btn width="150" @click="$emit('closeForm', location)">Close</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { useAppStore } from '@/stores/app';

import DfGrid from "../../components/grid/Grid.vue";

import message from "../../components/mixins/message.js";

export default {
	name: "LocationForm",

	components: { DfGrid },

	mixins: [ message],

	props: {
		location: {
			type: Object,
			required: true
		}
	},

	methods: {
		executeRegistration() {
			if (this.isMissingRequiredFields()) {
				return;
			}

			this.$emit('executeRegistration', this.location);
		},

		executeEdition() {
			if (this.isMissingIdentity() || this.isMissingRequiredFields()) {
				return;
			}

			this.$emit('executeEdition', this.location);
		},

		isMissingIdentity() {
			if (!this.location.identity) {
				this.$_message_showRequired("Missing location identity.");
				return true;
			}

			return false;
		},

		isMissingRequiredFields() {
			if (!this.location.name || !this.location.name.trim()) {
				this.$_message_showRequired("Mising location sname.");
				return true;
			}

			return false;
		},

		cleanForm() {
			if (!this.location.identity) {
				this.location.name = "";
			}

			this.location.note = "";
		}
	},

	computed: {
		appStore() {
			return useAppStore()
		},
	}
};
</script>
