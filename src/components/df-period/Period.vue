<template>
	<df-grid>
		<v-autocomplete v-model="selectedMonth"
			autofocus
			label="Month"
			item-title="monthName"
			item-value="monthNumber"
			:items="monthList"
			:style="ignoreMonth ? 'opacity: 0.5' : 'opacity: 1'"
			:readonly="ignoreMonth"
			:append-inner-icon="ignoreMonth ? 'mdi-toggle-switch-off-outline' : 'mdi-toggle-switch-outline'"
			@update:modelValue="periodChange();"
			@click:append-inner="ignoreMonth = !ignoreMonth"
		/>
		<v-text-field v-model="selectedYear"
			type="text"
			label="Year"
			maxlength="4"
			:style="ignoreYear ? 'opacity: 0.5' : 'opacity: 1'"
			:readonly="ignoreYear"
			:append-inner-icon="ignoreYear ? 'mdi-toggle-switch-off-outline' : 'mdi-toggle-switch-outline'"
			@input="periodChange();"
			@click:append-inner="ignoreYear = !ignoreYear"
		/>
	</df-grid>
</template>

<script>
import DfGrid from "../../components/grid/Grid.vue";
import message from "../../components/mixins/message.js";

export default {
	name: "DfPeriod",

	components: { DfGrid },

	mixins: [ message ],

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
			lowerLimit: 2000,
			upperLimit: 2100,

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
			if (this.selectedYear.length > 4 || this.isYearOutOfRange() || isNaN(this.selectedYear)) {
				this.$_message_showWarning(`The year must be a four-digit number between ${this.lowerLimit} and ${this.upperLimit}.`);
				return;
			}

			this.$emit("periodChange", this.ignoreMonth ? "" : this.selectedMonth, this.ignoreYear ? "" : this.selectedYear);
		},

		isYearOutOfRange() {
			return this.selectedYear.length === 4 && (this.selectedYear < this.lowerLimit || this.selectedYear > this.upperLimit);
		},
	},
}
</script>
