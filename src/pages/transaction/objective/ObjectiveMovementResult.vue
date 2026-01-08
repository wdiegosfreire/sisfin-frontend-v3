<template>
	<v-table :density="density">
		<thead>
			<tr>
				<th>#</th>
				<th>SOURCE</th>
				<th></th>
				<th>DUE DATE</th>
				<th>PAYMENT DATE</th>
				<th>PAYMENT METHOD</th>
				<th class="text-right">VALUE (R$)</th>
				<th v-if="enableEdit"></th>
				<th v-if="enableDelete"></th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="objectiveMovement in collection" :key="objectiveMovement.identity">
				<td class="sign-column">{{ objectiveMovement.installment }}</td>
				<td>{{ traceAccount(objectiveMovement.accountSource) }}</td>
				<td class="sign-column"><v-icon v-if="objectiveMovement.inPeriod" icon="mdi-check" size="28" color="green" title="Selected Installment" /></td>
				<td>{{ toBrasilianDate(objectiveMovement.dueDate) }}</td>
				<td>{{ toBrasilianDate(objectiveMovement.paymentDate) }}</td>
				<td>{{ objectiveMovement.paymentMethod.name }}</td>
				<td class="text-right">{{ currency(objectiveMovement.value) }}</td>
				<td v-if="enableEdit"><v-icon @click="$emit('editOneMovement', objectiveMovement)" icon="mdi-pen" title="Click to edit this movement." /></td>
				<td v-if="enableDelete"><v-icon @click="$emit('deleteOneMovement', objectiveMovement)" icon="mdi-trash-can-outline" title="Click to delete this movement." /></td>
			</tr>
			<tr>
				<td colspan="6"></td>
				<td class="text-right">{{ totalValueMovements }}</td>
			</tr>
		</tbody>
	</v-table>
</template>

<script lang="js">
import { currency, traceAccount, toBrasilianDate } from "@/utils/filters";

export default {
	name: "ObjectiveMovementResult",

	props: {
		collection: {
			type: Array,
			required: true
		},
		density: {
			type: String,
			default: "default"
		},
		enableEdit: {
			type: Boolean,
			default: false
		},
		enableDelete: {
			type: Boolean,
			default: false
		}
	},

	data() {
		return {
			movementTotalValue: 0
		}
	},

	methods: {
		currency,
		traceAccount,
		toBrasilianDate,
	},

	computed: {
		totalValueMovements() {
			return this.currency(this.collection.reduce((acc, item) => acc + item.value, 0));
		}
	},
};
</script>

<style lang="css">
th {
	white-space: nowrap;
}
</style>
