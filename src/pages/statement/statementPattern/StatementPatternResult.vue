<template>
	<df-result-layout :collection-length="collection.length">
		<v-card outlined class="elevation-1 mb-4" v-for="statementPattern in collection" :key="statementPattern.identity">
			<v-card-title class="d-flex align-center">
				<span>{{ statementPattern.comparator }}</span>

				<v-spacer></v-spacer>
				<v-menu>
					<template v-slot:activator="{ props }">
						<v-btn v-bind="props" variant="text" icon="mdi-menu" />
					</template>
					<v-list width="150">
						<v-list-item @click="$emit('accessEdition', statementPattern)" append-icon="mdi-file-document-edit-outline">
							<v-list-item-title>Edit</v-list-item-title>
						</v-list-item>
						<v-list-item @click="$emit('executeExclusion', statementPattern)" append-icon="mdi-trash-can-outline">
							<v-list-item-title>Delete</v-list-item-title>
						</v-list-item>
					</v-list>
				</v-menu>
			</v-card-title>

			<v-divider></v-divider>

			<v-card-text>
				<df-grid spaced>
					<df-output-text class="text-left" label="Identity">{{ statementPattern.identity }}</df-output-text>
					<df-output-text class="text-left" label="Description">{{ statementPattern.description }}</df-output-text>
					<df-output-text class="text-left" label="Source Account">{{ traceAccount(statementPattern.accountSource) }}</df-output-text>
					<df-output-text class="text-left" label="Target Account">{{ traceAccount(statementPattern.accountTarget) }}</df-output-text>
					<df-output-text class="text-left" label="Payment Method">{{ statementPattern.paymentMethod.name }} ({{ statementPattern.paymentMethod.acronym }})</df-output-text>
					<df-output-text class="text-left" label="Statement Type">{{ statementPattern.statementType.bank.name }} :: {{ statementPattern.statementType.name }}</df-output-text>
					<df-output-text class="text-left" label="Location">{{ statementPattern.location ? statementPattern.location.name : "" }}</df-output-text>
				</df-grid>
			</v-card-text>
		</v-card>
	</df-result-layout>
</template>

<script>
import DfResultLayout from "@/components/df-layout/ResultLayout.vue";

import DfGrid from "@/components/grid/Grid.vue";
import DfOutputText from "@/components/df-output/OutputText.vue";

import { traceAccount } from '@/utils/filters.js';

export default {
	name: "StatementPatternResult",

	components: { DfResultLayout, DfGrid, DfOutputText },

	props: {
		collection: {
			type: Array,
			required: true
		}
	},

	data() {
		return {
			search: ""
		};
	},

	methods: {
		traceAccount
	}
};
</script>
