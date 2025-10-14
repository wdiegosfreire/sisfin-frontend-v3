<template>
	<df-grid>
		<v-select label="Month" :items="monthList" item-text="monthName" item-value="monthNumber" value="01" :v-model="periodMonth"></v-select>
		<v-text-field label="Year" value="2023" :v-model="periodYear" />
	</df-grid>
</template>

<script>
import DfGrid from "../../components/grid/Grid.vue";

export default {
	name: "DfInputPeriod",

	components: { DfGrid },

	data() {
		return {
			periodYear: "",
			periodMonth: "",
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
			]
		}
	},

	methods: {
		periodYearBlur() {
			this.$emit("type", this.textSearch);
		}
	}
}
</script>
