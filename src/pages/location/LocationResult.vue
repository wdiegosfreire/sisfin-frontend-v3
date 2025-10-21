<template>
	<df-result-layout :collection-length="collection.length">
		<v-card outlined class="elevation-1 mb-4" v-for="location in collection" :key="location.identity">
			<v-card-title class="d-flex align-center">
				<span>{{ location.name }}</span>

				<v-spacer></v-spacer>
				<v-menu>
					<template v-slot:activator="{ props }">
						<v-btn v-bind="props" variant="text" icon="mdi-menu" />
					</template>
					<v-list width="150">
						<v-list-item @click="$emit('accessEdition', location)" append-icon="mdi-file-document-edit-outline">
							<v-list-item-title><v-list-item-title>Edit</v-list-item-title></v-list-item-title>
						</v-list-item>
						<v-list-item @click="$emit('executeExclusion', location)" append-icon="mdi-trash-can-outline">
							<v-list-item-title><v-list-item-title>Delete</v-list-item-title></v-list-item-title>
						</v-list-item>
					</v-list>
				</v-menu>
			</v-card-title>

			<v-divider></v-divider>

			<v-card-text>
				<df-grid>
					<df-output-text class="text-left" label="Identity">{{ location.identity }}</df-output-text>
					<df-output-text class="text-left" label="Notes">{{ location.note ? location.note : "No notes" }}</df-output-text>
				</df-grid>
			</v-card-text>
		</v-card>
	</df-result-layout>
</template>

<script>
import DfResultLayout from "@/components/df-layout/ResultLayout.vue";

import DfGrid from "@/components/grid/Grid.vue";
import DfOutputText from "@/components/df-output/OutputText.vue";

export default {
	name: "LocationResult",

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
	}
};
</script>
