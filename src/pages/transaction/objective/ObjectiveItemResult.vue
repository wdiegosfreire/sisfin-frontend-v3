<template>
	<v-table :dense="dense">
		<thead>
			<tr>
				<th>#</th>
				<th>TARGET</th>
				<th>DESCRIPTION</th>
				<th class="text-right">AMOUNT (R$)</th>
				<th></th>
				<th class="text-right">VALUE (R$)</th>
				<th></th>
				<th class="text-right">TOTAL (R$)</th>
				<th v-if="enableEdit"></th>
				<th v-if="enableDelete"></th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="objectiveItem in collection" :key="objectiveItem.identity">
				<td>{{ objectiveItem.sequential }}</td>
				<td>{{ traceAccount(objectiveItem.accountTarget) }}</td>
				<td>{{ objectiveItem.description }}</td>
				<td class="text-right">{{ currency(objectiveItem.amount, 3) }}</td>
				<td class="text-right">x</td>
				<td class="text-right">{{ currency(objectiveItem.unitaryValue) }}</td>
				<td class="text-right">=</td>
				<td class="text-right">{{ currency(objectiveItem.totalValue) }}</td>
				<td v-if="enableEdit"><df-icon @click="$emit('editOneMovement', objectiveItem)" icon="fa-pen" size="sm" title="Click to edit this movement." /></td>
				<td v-if="enableDelete"><df-icon @click="deleteOneItem(objectiveItem)" icon="fa-trash" size="sm" title="Click to delete this item." /></td>
			</tr>
			<tr>
				<td colspan="7"></td>
				<td class="text-right">{{ currency(itemTotalValue) }}</td>
			</tr>
		</tbody>
	</v-table>
</template>

<script lang="js">
import DfIcon from "@/components/df-icon/Icon.vue";

import { currency, traceAccount } from '@/utils/filters.js';

export default {
	name: "ObjectiveItemResult",

	components: { DfIcon },

	props: {
		collection: {
			type: Array,
			required: true
		},
		dense: {
			type: Boolean,
			default: false
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
			itemTotalValue: 0
		}
	},

	methods: {
		currency,
		traceAccount,

		calculateTotalValueForEachItem() {
			this.itemTotalValue = 0;
			for (let objectiveItem of this.collection) {
				objectiveItem.totalValue = Number((objectiveItem.unitaryValue * objectiveItem.amount).toFixed(2));
				this.itemTotalValue += objectiveItem.totalValue;
			}

			this.$emit("setItemTotalValue", this.itemTotalValue);
		},

		deleteOneItem(item) {
			let index = this.collection.indexOf(item);
			this.collection.splice(index, 1);

			let i = 0;
			for (const objectiveItem of this.collection) {
				objectiveItem.sequential = ++i;
			}
		}
	},

	beforeUpdate() {
		this.calculateTotalValueForEachItem();
	},

	beforeMount() {
		this.calculateTotalValueForEachItem();
	}
};
</script>

<style lang="css">
th {
	white-space: nowrap;
}
</style>
