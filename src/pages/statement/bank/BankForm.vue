<template>
	<v-dialog persistent v-model="appStore.globalDialog" width="800">
		<v-card class="mb-3">
			<v-toolbar color="primary" height="35" dark flat>
				<v-toolbar-title>
					<span v-if="this.bank.identity">Edit Bank</span>
					<span v-else>New Bank</span>
				</v-toolbar-title>
			</v-toolbar>

			<v-card-text>
				<df-grid v-if="bank.identity" >
					<v-text-field label="Identity" readonly v-model="bank.identity" />
				</df-grid>
				<df-grid>
					<v-text-field label="Name" v-model="bank.name" autofocus />
				</df-grid>
			</v-card-text>

			<v-card-actions>
				<v-btn v-if="this.bank.identity" color="button" width="150" @click="$emit('executeEdition', bank)">Confirm</v-btn>
				<v-btn v-else width="150" @click="$emit('executeRegistration', bank)">Confirm</v-btn>

				<v-btn width="150" @click="$emit('cleanForm', bank)">Clear</v-btn>
				<v-btn width="150" @click="$emit('closeForm', bank)">Close</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { useAppStore } from '@/stores/app';

import DfGrid from "@/components/grid/Grid.vue";

export default {
	name: "BankForm",

	components: { DfGrid },

	props: {
		bank: {
			type: Object,
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
