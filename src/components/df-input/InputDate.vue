<template>
	<v-text-field v-model="formattedDate" :label="label" readonly @focus="dialog = true"></v-text-field>
	<v-dialog v-model="dialog" persistent width="290">
		<v-card>
			<v-date-picker v-model="selectedDate" @update:model-value="updateDate"></v-date-picker>

			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn text color="primary" @click="dialog = false">Fechar</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	name: "DfInputDate",
	props: {
		label: {
			type: String,
			default: "Selecione a data"
		},
		modelValue: {
			type: String,
			default: ""
		}
	},

	data() {
		return {
			dialog: false,
			selectedDate: this.modelValue,
			formattedDate: this.modelValue ? this.formatDate(this.modelValue) : ""
		};
	},

	methods: {
		updateDate(val) {
			this.selectedDate = val;
			this.formattedDate = this.formatDate(val);
			this.dialog = false;
			this.$emit("update:modelValue", this.formattedDate);
		},

		formatDate(date) {
			if (!date)
				return "";

			const newDate = new Date(date);
			const day = String(newDate.getDate()).padStart(2, "0");
			const month = String(newDate.getMonth() + 1).padStart(2, "0");
			const year = newDate.getFullYear();

			return `${day}/${month}/${year}`;
		}
	},

	watch: {
		modelValue(newVal) {
			if (!newVal) {
				this.selectedDate = null;
				this.formattedDate = "";
				return;
			}
		}
	}
};
</script>
