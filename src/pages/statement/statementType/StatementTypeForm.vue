<template>
	<v-dialog persistent v-model="appStore.globalDialog" width="800">
		<v-card class="mb-3">
			<v-toolbar color="primary" height="35" dark flat>
				<v-toolbar-title>
					<span v-if="this.statementType.identity">Edit Statement Type</span>
					<span v-else>New Statement Type</span>
				</v-toolbar-title>
			</v-toolbar>

			<v-card-text>
				<df-grid v-if="statementType.identity" >
					<v-text-field label="Identity" readonly v-model="statementType.identity" />
				</df-grid>
				<df-grid>
					<v-text-field label="Name" v-model="statementType.name" autofocus />
				</df-grid>
				<v-autocomplete label="Bank" v-model="statementType.bank" item-title="name" item-value="identity" :items="bankListCombo" return-object />
				<df-autocomplete-account label="Source Account" v-model="statementType.accountSource" :items="accountListComboSource" validate-as="source" />
			</v-card-text>

			<v-card-actions>
				<v-btn v-if="this.statementType.identity" color="button" width="150" @click="$emit('executeEdition', statementType)">Confirm</v-btn>
				<v-btn v-else width="150" @click="$emit('executeRegistration', statementType)">Confirm</v-btn>

				<v-btn width="150" @click="$emit('cleanForm', statementType)">Clear</v-btn>
				<v-btn width="150" @click="$emit('closeForm', statementType)">Close</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { useAppStore } from '@/stores/app';

import DfGrid from "@/components/grid/Grid.vue";
import DfAutocompleteAccount from "@/components/df-autocomplete/AutocompleteAccount.vue";

// Mixins
import message from "@/components/mixins/message.js";

export default {
	name: "StatementTypeForm",

	components: { DfGrid, DfAutocompleteAccount },

	mixins: [ message ],

	props: {
		statementType: {
			type: Object,
			required: true
		},

		bankListCombo: {
			type: Array,
			required: true
		},

		accountListComboSource: {
			type: Array,
			required: true
		}
	},

	computed: {
		appStore() {
			return useAppStore()
		},
	}
};
</script>
