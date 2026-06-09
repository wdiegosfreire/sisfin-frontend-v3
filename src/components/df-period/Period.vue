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
			@update:modelValue="periodChange()">

			<template #prepend v-if="allowDecreaseIncrease">
				<v-icon @click.stop="decreasePeriod()" color="primary" class="chevron">mdi-chevron-left-circle</v-icon>
			</template>
			<template #append-inner v-if="allowPartialSearch">
				<v-icon @click.stop="ignoreMonthChange()" color="primary" class="switch">{{ getMonthAppendInnerIcon() }}</v-icon>
			</template>
		</v-autocomplete>

		<v-text-field v-model="selectedYear"
			type="text"
			label="Year"
			maxlength="4"
			:style="ignoreYear ? 'opacity: 0.5' : 'opacity: 1'"
			:readonly="ignoreYear"
			@input="periodChange();"
			@click:append-inner="ignoreYearChange()">

			<template #append v-if="allowDecreaseIncrease">
				<v-icon @click.stop="increasePeriod()" color="primary" class="chevron">mdi-chevron-right-circle</v-icon>
			</template>
			<template #append-inner v-if="allowPartialSearch">
				<v-icon @click.stop="ignoreYearChange()" color="primary" class="switch">{{ getYearAppendInnerIcon() }}</v-icon>
			</template>
		</v-text-field>
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
		},
		allowPartialSearch: {
			type: Boolean,
			default: true,
			required: false
		},
		allowDecreaseIncrease: {
			type: Boolean,
			default: true,
			required: false
		},
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

		ignoreMonthChange() {
			this.ignoreMonth = !this.ignoreMonth;
			this.periodChange();
		},

		ignoreYearChange() {
			this.ignoreYear = !this.ignoreYear;
			this.periodChange();
		},

		isYearOutOfRange() {
			return this.selectedYear.length === 4 && (this.selectedYear < this.lowerLimit || this.selectedYear > this.upperLimit);
		},

		getYearAppendInnerIcon() {
			return this.ignoreYear ? 'mdi-toggle-switch-off-outline' : 'mdi-toggle-switch-outline'
		},

		getMonthAppendInnerIcon() {
			return this.ignoreMonth ? 'mdi-toggle-switch-off-outline' : 'mdi-toggle-switch-outline'
		},

		decreasePeriod() {
			if (this.selectedMonth && this.selectedYear) {
				let monthIndex = this.monthList.findIndex(month => month.monthNumber === this.selectedMonth);

				if (monthIndex > 0) {
					this.selectedMonth = this.monthList[monthIndex - 1].monthNumber;
				}
				else {
					this.selectedMonth = this.monthList[this.monthList.length - 1].monthNumber;
					this.selectedYear = (Number(this.selectedYear) - 1).toString();
				}

				this.periodChange();
			}
		},

		increasePeriod() {
			if (this.selectedMonth && this.selectedYear) {
				let monthIndex = this.monthList.findIndex(month => month.monthNumber === this.selectedMonth);

				if (monthIndex < this.monthList.length - 1) {
					this.selectedMonth = this.monthList[monthIndex + 1].monthNumber;
				}
				else {
					this.selectedMonth = this.monthList[0].monthNumber;
					this.selectedYear = (Number(this.selectedYear) + 1).toString();
				}

				this.periodChange();
			}
		}
	}
}
</script>

<style scoped>
.chevron {
	font-size: 28px;
}

.switch {
	font-size: 30px;
}
</style>
