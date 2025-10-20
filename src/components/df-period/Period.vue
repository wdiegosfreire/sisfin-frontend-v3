<template>
	<df-grid>
		<v-autocomplete label="Month" v-model="selectedMonth" :items="monthList" item-title="monthName" item-value="monthNumber" :disabled="ignoreMonth" autofocus @update:modelValue="periodChange();">
			<!-- <template v-slot:append>
				<fa-icon icon="fa-solid fa-toggle-off" v-if="ignoreMonth" @click="ignoreMonth = !ignoreMonth" />
				<fa-icon icon="fa-solid fa-toggle-on" v-else @click="ignoreMonth = !ignoreMonth" />
			</template> -->
		</v-autocomplete>
		<v-text-field label="Year" v-model="selectedYear" :disabled="ignoreYear" @input="periodChange();">
			<!-- <template v-slot:append>
				<df-icon v-if="ignoreYear" icon="fa-toggle-off" @click="ignoreYear = !ignoreYear" />
				<df-icon v-else icon="fa-toggle-on" @click="ignoreYear = !ignoreYear" />
			</template> -->
		</v-text-field>
	</df-grid>
</template>

<script>
import DfGrid from "../../components/grid/Grid.vue";

export default {
	name: "DfPeriod",

	components: { DfGrid },

	props: {
		month: {
			type: String,
			default: "",
			required: true
		},
		year: {
			type: String,
			default: "",
			required: true
		}
	},

	data() {
		return {
			selectedMonth: this.month,
			selectedYear: this.year,
			ignoreMonth: false,
			ignoreYear: false,

			monthList: [
				{monthName: "January", monthNumber: "01"},
				{monthName: "February", monthNumber: "02"},
				{monthName: "March", monthNumber: "03"},
				{monthName: "April", monthNumber: "04"},
				{monthName: "May", monthNumber: "05"},
				{monthName: "June", monthNumber: "06"},
				{monthName: "July", monthNumber: "07"},
				{monthName: "August", monthNumber: "08"},
				{monthName: "September", monthNumber: "09"},
				{monthName: "October", monthNumber: "10"},
				{monthName: "November", monthNumber: "11"},
				{monthName: "December", monthNumber: "12"}
			],
		};
	},

	methods: {
		periodChange() {
			this.$emit("periodChange", this.ignoreMonth ? "" : this.selectedMonth, this.ignoreYear ? "" : this.selectedYear);
		}
	},
}
</script>
