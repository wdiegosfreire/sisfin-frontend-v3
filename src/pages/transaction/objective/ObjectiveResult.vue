<template>
	<df-result-layout :collection-length="collection ? collection.length : 0">
		<span v-for="objective in collection" :key="objective.identity">
			<span v-for="objectiveMovement in objective.objectiveMovementList" :key="objectiveMovement.identity">
				<v-card v-if="objectiveMovement.props.isNewHeader" :title="toBrasilianDate(objectiveMovement.paymentDate)" class="mb-4" color="primary" prepend-icon="mdi-clock" />

				<v-card v-if="objectiveMovement.inPeriod" class="mb-4">
					<v-card-title class="d-flex align-center">
						<span>
							<df-icon icon="fa-circle" size="xs" color="purple" /> {{ traceAccount(objectiveMovement.accountSource) }}
							<df-icon icon="fa-arrow-right-long" size="sm" /> {{ objective.description }}: R$ {{ currency(objectiveMovement.value) }}
						</span>

						<v-spacer></v-spacer>
						<v-menu>
							<template v-slot:activator="{ props }">
								<v-btn v-bind="props" variant="text" icon="mdi-menu" />
							</template>
							<v-list width="150">
								<v-list-item @click="$emit('accessEdition', objective)" append-icon="mdi-file-document-edit-outline">
									<v-list-item-title>Edit</v-list-item-title>
								</v-list-item>
								<v-list-item @click="$emit('executeExclusion', objective)" append-icon="mdi-trash-can-outline">
									<v-list-item-title>Delete</v-list-item-title>
								</v-list-item>
							</v-list>
						</v-menu>
					</v-card-title>

					<v-divider></v-divider>

					<v-card-text>
						<df-grid spaced>
							<df-output-text class="text-left" label="Source">{{ traceAccount(objectiveMovement.accountSource) }}</df-output-text>
						</df-grid>
						<df-grid spaced column="auto-sm">
							<df-output-text class="text-left" label="Identity">{{ objectiveMovement.identity }}</df-output-text>
							<df-output-text class="text-left" label="Registration Date">{{ toBrasilianDate(objectiveMovement.registrationDate) }}</df-output-text>
							<df-output-text class="text-left" label="Due Date">{{ toBrasilianDate(objectiveMovement.dueDate) }}</df-output-text>
							<df-output-text class="text-left" label="Payment Date">{{ toBrasilianDate(objectiveMovement.paymentDate) }}</df-output-text>
							<df-output-text class="text-left" label="Installment">{{ objectiveMovement.installment }}</df-output-text>
							<df-output-text class="text-left" label="Payment Method">{{ objectiveMovement.paymentMethod ? objectiveMovement.paymentMethod.name : "" }}</df-output-text>
							<df-output-text class="text-left" label="Location">{{ objective.location ? objective.location.name : "" }}</df-output-text>
						</df-grid>

						<v-expansion-panels variant="accordion" multiple>
							<v-expansion-panel title="Movements">
								<v-expansion-panel-text>
									<objective-movement-result :collection="objective.objectiveMovementList" />
								</v-expansion-panel-text>
							</v-expansion-panel>
							<v-expansion-panel title="Items">
								<v-expansion-panel-text>
									<objective-item-result :collection="objective.objectiveItemList" />
								</v-expansion-panel-text>
							</v-expansion-panel>
						</v-expansion-panels>
					</v-card-text>
				</v-card>
			</span>
		</span>
	</df-result-layout>
</template>

<script lang="js">
import DfResultLayout from "@/components/df-layout/ResultLayout.vue";

import DfGrid from "@/components/grid/Grid.vue";
import DfIcon from "@/components/df-icon/Icon.vue";
import DfOutputText from "@/components/df-output/OutputText.vue";

import ObjectiveItemResult from "@/pages/transaction/objective/ObjectiveItemResult.vue";
import ObjectiveMovementResult from "@/pages/transaction/objective/ObjectiveMovementResult.vue";

import { currency, traceAccount, toBrasilianDate } from '@/utils/filters.js';

export default {
	name: "ObjectiveResult",

	components: { DfResultLayout, DfGrid, DfOutputText, DfIcon, ObjectiveItemResult, ObjectiveMovementResult },

	props: {
		collection: {
			type: Array,
			required: true,
			default: () => []
		}
	},

	data() {
		return {
			search: "",
			grupo: ""
		};
	},

	methods: {
		currency,
		traceAccount,
		toBrasilianDate,

		getNewHeader(data) {
			if (this.grupo != data) {
				this.grupo = data;
				return true;
			}

			return false;
		}
	}
};
</script>
