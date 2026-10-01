<template>
	<v-table :density="density">
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
				<td :class="getDiscountClass(objectiveItem)">{{ objectiveItem.sequential }}</td>
				<td :class="getDiscountClass(objectiveItem)">{{ traceAccount(objectiveItem.accountTarget) }}</td>
				<td :class="getDiscountClass(objectiveItem)">{{ objectiveItem.description }}</td>
				<td :class="getDiscountClass(objectiveItem)" class="text-right">{{ currency(objectiveItem.amount, 3) }}</td>
				<td :class="getDiscountClass(objectiveItem)" class="text-right">x</td>
				<td :class="getDiscountClass(objectiveItem)" class="text-right">{{ currency(objectiveItem.unitaryValue) }}</td>
				<td :class="getDiscountClass(objectiveItem)" class="text-right">=</td>
				<td :class="getDiscountClass(objectiveItem)" class="text-right">{{ calculateItemTotalValue(objectiveItem) }}</td>
				<td v-if="enableEdit"><v-icon @click="$emit('editOneMovement', objectiveItem)" title="Click to edit this movement.">mdi-playlist-edit</v-icon></td>
				<td v-if="enableDelete"><v-icon @click="$emit('deleteOneItem', objectiveItem)" title="Click to delete this item.">mdi-delete</v-icon></td>
			</tr>
			<tr>
				<td colspan="7"></td>
				<td class="text-right">{{ totalValueItems }}</td>
			</tr>
		</tbody>
	</v-table>
</template>

<script lang="js">
import { currency, traceAccount } from '@/utils/filters.js';
import { calculateItemTotalValue, detectCalculationMode } from '@/utils/calculation.js';

export default {
	name: "ObjectiveItemResult",

	props: {
		collection: {
			type: Array,
			required: true
		},
		totalMovements: {
			type: Number,
			default: null
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
			itemTotalValue: 0
		}
	},

	methods: {
		currency,
		traceAccount,

		deleteOneItem(item) {
			let index = this.collection.indexOf(item);
			this.collection.splice(index, 1);

			let i = 0;
			for (const objectiveItem of this.collection) {
				objectiveItem.sequential = ++i;
			}
		},

		calculateItemTotalValue(objectiveItem) {
			return currency(this.getItemTotalValue(objectiveItem));
		},

		getItemTotalValue(objectiveItem) {
			if (!this.calculationMode)
				return Number(objectiveItem.totalValue);

			return calculateItemTotalValue(objectiveItem.unitaryValue, objectiveItem.amount, this.calculationMode);
		},

		getDiscountClass(objectiveItem) {
			return objectiveItem.unitaryValue < 0 ? 'discount' : '';
		}
	},

	computed: {
		calculationMode() {
			if (this.totalMovements === null)
				return null;

			return detectCalculationMode(this.collection, this.totalMovements);
		},

		totalValueItems() {
			return this.currency(this.collection.reduce((acc, item) => acc + this.getItemTotalValue(item), 0));
		}
	},
};
</script>

<style lang="css">
th {
	white-space: nowrap;
}

.discount {
	color: blue;
}

.addition {
	color: orangered;
}
</style>
