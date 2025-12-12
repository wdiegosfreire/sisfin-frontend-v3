<template>
	<df-result-layout :collection-length="collection.length">
		<span v-for="statement in collection" :key="statement.identity">
			<v-card v-if="statement.props.isNewHeader" :title="statement.month + '/' + statement.year" class="mb-4" color="primary" prepend-icon="mdi-clock" />

			<v-card outlined class="mb-4">
				<v-card-title class="d-flex align-center">
					<span>{{ statement.month }}/{{ statement.year }} :: {{ statement.statementType ? statement.statementType.bank.name : "" }} :: {{ statement.statementType ? statement.statementType.name : "" }}</span>

					<v-spacer></v-spacer>
					<v-menu>
						<template v-slot:activator="{ props }">
							<v-btn v-bind="props" variant="text" icon="mdi-menu" />
						</template>
						<v-list dense width="150">
							<v-list-item @click="$emit('accessEdition', statement)">
								<v-list-item-title>Edit</v-list-item-title>
							</v-list-item>
							<v-list-item @click="$emit('executeExclusion', statement)">
								<v-list-item-title>Delete</v-list-item-title>
							</v-list-item>
						</v-list>
					</v-menu>
				</v-card-title>

				<v-divider></v-divider>

				<v-card-text>
					<df-grid column="auto-sm">
						<df-output-text class="text-left" label="Identity">{{ statement.identity }}</df-output-text>
						<df-output-text class="text-left" label="Opening Balance">{{ currency(statement.openingBalance) }}</df-output-text>
						<df-output-text class="text-left" label="Closing Balance">{{ currency(statement.closingBalance) }}</df-output-text>
						<df-output-text class="text-left bold" label="Status" :color="statement.isClosed ? 'green' : 'red'">{{ statement.isClosed ? "Closed" : "Opened" }}</df-output-text>
					</df-grid>
				</v-card-text>
			</v-card>
		</span>
	</df-result-layout>
</template>

<script>
import DfResultLayout from "@/components/df-layout/ResultLayout.vue";

import DfGrid from "@/components/grid/Grid.vue";
import DfIcon from "@/components/df-icon/Icon.vue";
import DfOutputText from "@/components/df-output/OutputText.vue";

import { currency } from '@/utils/filters.js';

export default {
	name: "StatementResult",

	components: { DfResultLayout, DfGrid, DfOutputText, DfIcon },

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
		currency
	}
};
</script>
