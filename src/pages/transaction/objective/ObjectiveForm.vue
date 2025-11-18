<template>
	<v-dialog persistent v-model="appStore.globalDialog" width="1000">
		<v-card class="mb-3">
			<v-toolbar color="primary" height="35" dark flat>
				<v-toolbar-title>
					<span v-if="this.objective.identity">Edit Objective</span>
					<span v-else>New Objective</span>
				</v-toolbar-title>
			</v-toolbar>

			<v-card-text>
				<input type="hidden" v-model.number="objective.value" />

				<v-tabs v-model="tab" color="primary" class="mb-5" grow>
					<v-tab value="tabObj">Objectives</v-tab>
					<v-tab value="tabObm">Movements</v-tab>
					<v-tab value="tabObi">Items</v-tab>
				</v-tabs>

				<v-tabs-window v-model="tab">
					<v-tabs-window-item value="tabObj">
						<v-text-field v-if="objective.identity" label="Identity" readonly v-model="objective.identity" />
						<v-text-field label="Description" v-model="objective.description" :readonly="isIdentityPresent" />
						<v-autocomplete label="Location" v-model="objective.location" item-title="name" item-value="identity" :items="locationListCombo" return-object clearable />
					</v-tabs-window-item>

					<v-tabs-window-item value="tabObm">
						<df-grid column="frac-15">
							<v-text-field v-model.number="objectiveMovementForm.installment" label="Installment" readonly />
							<v-autocomplete v-model="objectiveMovementForm.paymentMethod" label="Payment Method" :item-title="tracePaymentMethod" item-value="identity" :items="paymentMethodListCombo" return-object clearable />
						</df-grid>
						<df-grid>
							<v-autocomplete label="Source" v-model="objectiveMovementForm.accountSource" :item-title="traceAccountWithLevel" item-value="identity" :items="accountListComboSource" return-object @change="validateSelectedSource()" clearable />
						</df-grid>
						<df-grid column="auto-sm">
							<!-- <v-text-field label="Due Date" v-model="objectiveMovementForm.dueDate" /> -->
							<df-input-date v-model="objectiveMovementForm.dueDate" label="Due Date" />
							<df-input-date v-model="objectiveMovementForm.paymentDate" label="Payment Date" />
							<df-input-money v-model="objectiveMovementForm.value" label="Value" />
							<v-btn @click="addNewMovement()">Add</v-btn>
						</df-grid>

						<objective-movement-result
							enable-delete
							:collection="objective.objectiveMovementList"
							@deleteOneMovement="deleteOneMovement"
						/>
					</v-tabs-window-item>

					<v-tabs-window-item value="tabObi">
						<df-grid column="frac-15">
							<v-text-field label="Sequential" v-model="objectiveItemForm.sequential" tabindex="-1" readonly />
							<v-text-field label="Description" v-model="objectiveItemForm.description" append-icon="mdi-map-marker" @click:append="copyDescriptionFromObjective()" />
						</df-grid>
						<df-grid column="auto-sm">
							<v-autocomplete label="Target" v-model="objectiveItemForm.accountTarget" :item-title="traceAccountWithLevel" item-value="identity" :items="accountListComboTarget" return-object @change="validateSelectedTarget()" clearable />
						</df-grid>
						<df-grid column="auto-sm">
							<df-input-money v-model="objectiveItemForm.amount" label="Amount" @blur="calculateItemTotalValue()" precision="3" clearable />
							<df-input-money v-model="objectiveItemForm.unitaryValue" label="Unitary Value" @blur="calculateItemTotalValue()" clearable />
							<df-input-money v-model="objectiveItemForm.totalValue" label="Total" readonly tabindex="-1" />
							<v-btn @click="addNewItem()">Add</v-btn>
						</df-grid>

						<objective-item-result
							enable-delete
							:collection="objective.objectiveItemList"
							@deleteOneItem="deleteOneItem"
						/>
					</v-tabs-window-item>
				</v-tabs-window>
			</v-card-text>

			<v-card-text>
				<table>
					<tbody>
						<tr>
							<td><h3>Total of Movements: {{ calculateTotalValueOfMovements }}</h3></td>
							<td rowspan="2"><df-icon v-if="showTotalAlert" icon="fa-warning" size="3x" color="orange" title="Total of movements is diferent of total of items!" /></td>
						</tr>
						<tr>
							<td><h3>Total of Items: {{ calculateTotalValueOfItems }}</h3></td>
						</tr>
					</tbody>
				</table>
			</v-card-text>

			<v-card-actions>
				<v-btn v-if="this.objective.identity" color="button" width="150" @click="executeEdition">Confirm</v-btn>
				<v-btn v-else width="150" @click="executeRegistration">Confirm</v-btn>

				<v-btn width="150" @click="cleanForm">Clear</v-btn>
				<v-btn width="150" @click="closeForm">Close</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { useAppStore } from '@/stores/app';

//Components
import DfGrid from "@/components/grid/Grid.vue";
import DfIcon from "@/components/df-icon/Icon.vue";
import DfInputDate from "@/components/df-input/InputDate.vue";
import DfInputMoney from "@/components/df-input/InputMoney.vue";

import ObjectiveItemResult from "@/pages/transaction/objective/ObjectiveItemResult.vue";
import ObjectiveMovementResult from "@/pages/transaction/objective/ObjectiveMovementResult.vue";

// Mixins
import format from "@/components/mixins/format.js";
import message from "@/components/mixins/message.js";

import { currency, traceAccount, toUtcDate } from '@/utils/filters.js';

export default {
	name: "ObjectiveForm",

	components: { DfGrid, DfIcon, DfInputDate, DfInputMoney, ObjectiveItemResult, ObjectiveMovementResult },

	mixins: [ format, message ],

	data() {
		return {
			tab: null,
			totalAllMovements: 0,
			totalAllItems: 0,
			showTotalAlert: false,
			movementDateUpdated: false,

			objectiveMovementForm: {
				dueDate: "",
				paymentDate: "",
				installment: this.objective.objectiveMovementList.length + 1,
				paymentMethod: null
			},

			objectiveItemForm: {
				description: "",
				sequential: this.objective.objectiveItemList.length + 1,
				unitaryValue: 0,
				amount: 0,
				totalValue: 0,
			}
		}
	},

	props: {
		objective: {
			type: Object,
			required: true,
		},
		locationListCombo: {
			type: Array,
			required: true
		},
		paymentMethodListCombo: {
			type: Array,
			required: true
		},
		accountListComboSource: {
			type: Array,
			required: true
		},
		accountListComboTarget: {
			type: Array,
			required: true
		}
	},

	methods: {
		currency,
		toUtcDate,
		traceAccount,

		calculateItemTotalValue() {
			if (this.objectiveItemForm) {
				let amount = this.objectiveItemForm.amount;
				let unitaryValue = this.objectiveItemForm.unitaryValue;
				this.objectiveItemForm.totalValue = Number((unitaryValue * amount).toFixed(2));
			}
		},

		addNewMovement() {
			if (!this.objectiveMovementForm.installment) {
				this.$_message_showRequired("Missing movement installment.");
				return false;
			}

			if (!this.objectiveMovementForm.paymentMethod) {
				this.$_message_showRequired("Missing movement payment method.");
				return false;
			}

			if (!this.objectiveMovementForm.accountSource) {
				this.$_message_showRequired("Missing movement account source.");
				return false;
			}

			if (!this.objectiveMovementForm.dueDate) {
				this.$_message_showRequired("Missing movement due date.");
				return false;
			}

			if (!this.objectiveMovementForm.value) {
				this.$_message_showRequired("Missing movement value.");
				return false;
			}

			this.objective.objectiveMovementList.push(
				{
					identity: this.objectiveMovementForm.identity,
					installment: this.objectiveMovementForm.installment,
					paymentMethod: this.objectiveMovementForm.paymentMethod,
					accountSource: this.objectiveMovementForm.accountSource,
					dueDate: this.toUtcDate(this.objectiveMovementForm.dueDate),
					paymentDate: this.toUtcDate(this.objectiveMovementForm.paymentDate),
					value: this.objectiveMovementForm.value
				}
			);

			this.resetObjectiveMovementForm();
		},

		addNewItem() {
			if (!this.objectiveItemForm.sequential) {
				this.$_message_showRequired("Missing item sequential.");
				return false;
			}

			if (!this.objectiveItemForm.description) {
				this.$_message_showRequired("Missing item description.");
				return false;
			}

			if (!this.objectiveItemForm.accountTarget) {
				this.$_message_showRequired("Missing target account.");
				return false;
			}

			if (!this.objectiveItemForm.amount) {
				this.$_message_showRequired("Missing item amount.");
				return false;
			}

			if (!this.objectiveItemForm.unitaryValue) {
				this.$_message_showRequired("Missing item unitary value.");
				return false;
			}

			if (!this.objectiveItemForm.totalValue) {
				this.$_message_showRequired("Missing item total value.");
				return false;
			}

			this.objective.objectiveItemList.push(
				{
					identity: this.objectiveItemForm.identity,
					description: this.objectiveItemForm.description,
					sequential: this.objectiveItemForm.sequential,
					unitaryValue: this.objectiveItemForm.unitaryValue,
					amount: this.objectiveItemForm.amount,
					totalValue: this.objectiveItemForm.totalValue,
					accountTarget: this.objectiveItemForm.accountTarget,

					plus: "x",
					equal: "="
				}
			);

			this.resetObjectiveItemForm();
		},

		validateSelectedSource() {
			let errorMessage = "";

			if (!this.objectiveMovementForm || !this.objectiveMovementForm.accountSource || this.objectiveMovementForm.accountSource.level.length != 9)
				errorMessage = "Please, select a final source account.";
			else if (this.objectiveMovementForm.accountSource.level.startsWith("03."))
				errorMessage = `Accounts with level "03." can't be used as source account.`;

			if (errorMessage) {
				this.$_message_showRequired(errorMessage);
				this.objectiveMovementForm.accountSource = {};

				return;
			}
		},

		validateSelectedTarget() {
			let errorMessage = "";

			if (!this.objectiveItemForm || !this.objectiveItemForm.accountTarget || this.objectiveItemForm.accountTarget.level.length != 9)
				errorMessage = "Please, select a final target account.";
			else if (this.objectiveItemForm.accountTarget.level.startsWith("02."))
				errorMessage = `Accounts with level "02." can't be used as target account.`;

			if (errorMessage) {
				this.$_message_showRequired(errorMessage);
				this.objectiveItemForm.accountTarget = {};

				return;
			}
		},

		copyDescriptionFromObjective() {
			if (this.objective.description)
				this.objectiveItemForm.description = this.objective.description;
			else
				this.$_message_showWarning("Objective description not found.");
		},

		cleanForm() {
			this.resetObjectiveMovementForm();
			this.resetObjectiveItemForm();
			this.$emit("cleanForm", this.objective);
		},

		closeForm() {
			this.cleanForm();
			this.$emit('closeForm', this.objective);
		},

		resetObjectiveMovementForm() {
			this.objectiveMovementForm = {
				installment: this.objective.objectiveMovementList.length + 1,
				paymentMethod: null,
				accountSource: null,
				dueDate: "",
				paymentDate: "",
				value: 0
			};
		},

		resetObjectiveItemForm() {
			this.objectiveItemForm = {
				description: "",
				sequential: this.objective.objectiveItemList.length + 1,
				accountTarget: null,
				amount: 0,
				unitaryValue: 0,
				totalValue: 0
			}
		},

		executeRegistration() {
			if (this.validateFormData()) {
				this.$emit("executeRegistration", this.objective);
				this.closeForm();
			}
		},

		executeEdition() {
			if (this.validateFormData()) {
				this.$emit("executeEdition", this.objective);
				this.closeForm();
			}
		},

		validateFormData() {
			if (this.objective.description == "") { this.$_message_showRequired("Missing objective description."); return false; }
			if (this.objective.objectiveMovementList.length == 0) { this.$_message_showRequired("Missing movements."); return false; }
			if (this.objective.objectiveItemList.length == 0) { this.$_message_showRequired("Missing items."); return false }
			if (this.totalAllMovements !== this.totalAllItems) { this.$_message_showRequired("Total of movements is diferent of total of items."); return false; }

			return true;
		},

		formatToBrazilianDate(unformatedDate) {
			if (!unformatedDate) {
				return "";
			}
			else if (unformatedDate.length == 10) {
				return unformatedDate;
			}

			unformatedDate = new Date(unformatedDate);

			let day = unformatedDate.getDate();
			let month = unformatedDate.getMonth() + 1;
			let year = unformatedDate.getFullYear();

			day = day.toString().padStart(2, "0");
			month = month.toString().padStart(2, "0");

			return `${day}/${month}/${year}`;
		},

		deleteOneMovement(selectedMovement) {
			this.objective.objectiveMovementList = this.objective.objectiveMovementList.filter(item => item !== selectedMovement);
			this.objectiveMovementForm.installment = this.objective.objectiveMovementList.length + 1;

			this.objective.objectiveMovementList.forEach((item, index) => {
    			item.installment = index + 1;
  			});
		},

		deleteOneItem(selectedItem) {
			this.objective.objectiveItemList = this.objective.objectiveItemList.filter(item => item !== selectedItem);
			this.objectiveItemForm.sequential = this.objective.objectiveItemList.length + 1;

			this.objective.objectiveItemList.forEach((item, index) => {
    			item.sequential = index + 1;
  			});
		},

		tracePaymentMethod(item) {
			if (!item)
				return "";

			return `${item.name} - ${item.acronym}`;
		},

		traceAccountWithLevel(item) {
			if (!item)
				return "";

			return `${item.level} ${this.traceAccount(item)}`;
		}
	},

	computed: {
		appStore() {
			return useAppStore()
		},

		isIdentityPresent() {
			return this.objective.identity ? true : false;
		},

		calculateTotalValueOfMovements() {
			this.totalAllMovements = this.objective.objectiveMovementList.reduce((acc, item) => acc + item.value, 0);
			this.showTotalAlert = this.totalAllMovements !== this.totalAllItems;

			return this.currency(this.totalAllMovements);
		},

		calculateTotalValueOfItems() {
			this.objective.objectiveItemList.forEach(objectiveItem => {
				objectiveItem.totalValue = objectiveItem.unitaryValue * objectiveItem.amount;
			});

			this.totalAllItems = this.objective.objectiveItemList.reduce((acc, item) => acc + item.totalValue, 0);
			this.showTotalAlert = this.totalAllMovements !== this.totalAllItems;

			return this.currency(this.totalAllItems);
		}
	}
};
</script>
