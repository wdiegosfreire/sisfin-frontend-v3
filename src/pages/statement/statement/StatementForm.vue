<template>
	<v-dialog v-model="appStore.globalDialog" width="1500">
		<v-card class="mb-3">
			<v-toolbar>
				<v-toolbar-title v-if="!statement.identity">Import Statement</v-toolbar-title>
				<v-toolbar-title v-else>Export Statement Items</v-toolbar-title>
			</v-toolbar>

			<span v-if="!statement.identity">
				<v-card-text>
					<v-autocomplete v-model="bankComboSelected" label="Bank" item-title="name" item-value="identity" :items="bankListCombo" @update:modelValue="$emit('accessRegistration', bankComboSelected)" return-object autofocus />
					<v-autocomplete v-model="statementTypeComboSelected" label="StatementType" item-title="name" item-value="identity" :items="statementTypeListCombo" return-object />
					<v-file-input v-model="statement.statementFile" label="Statement File" append-icon="mdi-file" prepend-icon=""></v-file-input>
				</v-card-text>
			</span>
			<span v-else>
				<v-card-title>{{ statement.month }}/{{ statement.year }} :: {{ statement.statementType.bank.name }} :: {{ statement.statementType.name }}</v-card-title>
				<v-card-text>
					<df-grid column="auto-md" spaced>
						<df-output-text label="Identity">{{ statement.identity }}</df-output-text>
						<df-output-text label="Opening Balance">{{ currency(statement.openingBalance) }}</df-output-text>
						<df-output-text label="Closing Balance">{{ currency(statement.closingBalance) }}</df-output-text>
						<df-output-text label="Status" class="bold" :color="statement.isClosed ? 'green' : 'red'">{{ statement.isClosed ? "Closed" : "Opened" }}</df-output-text>
						<df-output-text label="Source">{{ traceAccount(statement.statementType.accountSource) }}</df-output-text>
					</df-grid>
					<v-expansion-panels variant="accordion">
						<v-expansion-panel title="Statement Items">
							<v-expansion-panel-text>
								<v-card variant="outlined" border="sm opacity-20" class="mt-3" v-for="(statementItem, index) in statement.statementItemList" :key="statementItem.identity">
									<v-card-title>{{ index + 1 }}. {{ statementItem.description }}</v-card-title>

									<v-card-text>
										<df-grid column="auto-sm" spaced>
											<df-output-text label="Date">{{ toBrasilianDate(statementItem.movementDate) }}</df-output-text>
											<df-output-text label="Value">{{ currency(statementItem.movementValue) }}</df-output-text>
											<df-output-text label="Document Number">{{ statementItem.documentNumber ? statementItem.documentNumber : "-"}}</df-output-text>
										</df-grid>
									</v-card-text>

									<span v-if="!statementItem.isExported && statementItem.props.similarMovementList.length > 0">
										<v-divider />
										<v-card-text style="color: red;">
											<div>Movements were found for the same date and value for this item. Please review the information below before exporting.</div>
											<ul>
												<li v-for="similarMovement in statementItem.props.similarMovementList" :key="similarMovement">{{ similarMovement }}</li>
											</ul>
										</v-card-text>
									</span>

									<v-divider />
									<v-card-text>
										<v-chip small color="success" class="mr-3" v-if="statementItem.operationType == 'C'">Incoming</v-chip>
										<v-chip small color="error" class="mr-3" v-else>Outcoming</v-chip>
										<v-chip small color="success" v-if="statementItem.isExported">Exported</v-chip>
										<v-chip small color="error" v-else>Pending</v-chip>
									</v-card-text>

									<span v-if="!statementItem.isExported">
										<v-divider />
										<v-card-actions>
											<v-btn text @click="statementItem.isVisible = !statementItem.isVisible">SHOW FORM</v-btn>
											<v-spacer />
											<v-btn icon @click="statementItem.isVisible = !statementItem.isVisible"><v-icon>{{ statementItem.isVisible ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon></v-btn>
										</v-card-actions>

										<v-expand-transition>
											<v-card-text v-show="statementItem.isVisible">
												<df-grid column="auto-md" fluid>
													<v-autocomplete v-model="isInstallmentPlan" :disabled="statementItem.operationType == 'C'" label="Is Installment Plan?" item-title="name" item-value="value" :items="yesNoCombo" />
													<v-autocomplete v-model="isFirstInstallment"
														label="Is First Installment?"
														item-title="name"
														item-value="value"
														:items="yesNoCombo"
														:disabled="!isInstallmentPlan">
													</v-autocomplete>
												</df-grid>

												<v-card v-if="isInstallmentPlan" class="mb-5">
													<v-card-text v-if="isInstallmentPlan && isFirstInstallment">
														<v-text-field label="Installment Total Amount" v-model="statementItem.props.installmentAmount" />
													</v-card-text>
													<v-card-text v-if="isInstallmentPlan && !isFirstInstallment">
														<v-radio-group v-model="objectiveMovementSelected" @update:model-value="selectItem(statementItem)">
															<v-table>
																<thead>
																	<tr>
																		<th>Description</th>
																		<th>Installment</th>
																		<th>Location</th>
																		<th>Due Date</th>
																		<th>Payment Date</th>
																		<th>Value</th>
																		<th style="width: 1px;"></th>
																	</tr>
																</thead>
																<tbody>
																	<tr v-for="objectiveMovement in objectiveMovementListInstallmentPlan" :key="objectiveMovement.identity">
																		<td>{{ objectiveMovement.objective.description }}</td>
																		<td>{{ objectiveMovement.installment }}/{{ objectiveMovement.objective.installmentAmount }}</td>
																		<td>{{ objectiveMovement.objective.location?.name }}</td>
																		<td>{{ toBrasilianDate(objectiveMovement.paymentDate) }}</td>
																		<td>{{ currency(objectiveMovement.value) }}</td>
																		<td style="padding: none"><v-radio :value="objectiveMovement" /></td>
																	</tr>
																</tbody>
															</v-table>
														</v-radio-group>
													</v-card-text>
												</v-card>

												<df-grid column="auto-lg" fluid>
													<v-text-field v-model="statementItem.descriptionNew" label="New Description" :readonly="isReadonly" />
													<df-autocomplete-account v-model="statementItem.accountSource" :readonly="isReadonly" v-if="statementItem.operationType == 'C'" label="Source Account" :items="accountListComboSource" validate-as="source" clearable />
													<df-autocomplete-account v-model="statementItem.accountTarget" :readonly="isReadonly" v-if="statementItem.operationType == 'D'" label="Target Account" :items="accountListComboTarget" validate-as="target" :clearable="!isReadonly" />
												</df-grid>
												<df-grid column="auto-md" fluid>
													<v-autocomplete v-model="statementItem.location" label="Location" item-title="name" item-value="identity" :items="locationListCombo" :readonly="isReadonly" :clearable="!isReadonly" return-object />
													<v-autocomplete v-model="statementItem.paymentMethod" label="Payment Method" item-title="name" item-value="identity" :items="paymentMethodListCombo" :readonly="isReadonly" :clearable="!isReadonly" return-object />
												</df-grid>
												<df-grid column="auto-md" fluid>
													<v-btn v-if="!isInstallmentPlan || isFirstInstallment" @click="executeEdition(statementItem, 'createObjective')" class="mr-3" variant="tonal" small>Export and Create Movement</v-btn>
													<v-btn v-if="isInstallmentPlan && !isFirstInstallment" @click="executeEdition(statementItem, 'addInstallment')" class="mr-3" variant="tonal" small>Export and Add Installment</v-btn>
													<v-btn @click="executeEdition(statementItem, '')" variant="tonal" small>Export without Create Movement</v-btn>
												</df-grid>
											</v-card-text>
										</v-expand-transition>
									</span>
								</v-card>
							</v-expansion-panel-text>
						</v-expansion-panel>
					</v-expansion-panels>
				</v-card-text>

			</span>

			<v-card-actions v-if="!statement.identity">
				<v-btn width="150" @click="executeRegistration(statement)" variant="tonal" color="primary">Confirm</v-btn>
				<v-btn width="150" @click="$emit('cleanForm', statement)" variant="tonal">Clear</v-btn>
				<v-btn width="150" @click="$emit('closeForm', statement)" variant="tonal">Close</v-btn>
			</v-card-actions>
			<v-card-actions v-else>
				<v-btn width="150" @click="$emit('closeForm', statement)" variant="tonal">Close</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { useAppStore } from '@/stores/app';

import message from "../../../components/mixins/message.js";

import { currency, traceAccount, toBrasilianDate } from '@/utils/filters.js';

import DfGrid from "@/components/grid/Grid.vue";
import DfOutputText from "@/components/df-output/OutputText.vue";
import DfAutocompleteAccount from "@/components/df-autocomplete/AutocompleteAccount.vue";

export default {
	name: "StatementForm",

	components: { DfGrid, DfOutputText, DfAutocompleteAccount },

	mixins: [ message ],

	props: {
		statement: {
			type: Object,
			required: true
		},
		bankListCombo: {
			type: Array,
			required: true
		},
		locationListCombo: {
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
		},
		paymentMethodListCombo: {
			type: Array,
			required: true
		},
		statementTypeListCombo: {
			type: Array,
			required: false
		},
		objectiveMovementListInstallmentPlan: {
			type: Array,
			required: false,
			default: () => []
		}
	},

	data() {
		return {
			isInstallmentPlan: false,
			isFirstInstallment: true,
			bankComboSelected: null,
			statementTypeComboSelected: null,
			objectiveMovementSelected: null,

			yesNoCombo: [
				{ value: true, name: "Yes" },
				{ value: false, name: "No" }
			]
		}
	},

	methods: {
		currency,
		traceAccount,
		toBrasilianDate,

		executeRegistration(statement) {
			statement.statementType = this.statementTypeComboSelected;
			this.$emit("executeRegistration", statement);
		},

		executeEdition(statementItem, command) {
			if (command === 'createObjective' || command === 'addInstallment') {
				if (!statementItem.descriptionNew) {
					this.$_message_showRequired("Mising movement new description.");
					return;
				}

				if ((!statementItem.accountSource || !statementItem.accountSource.identity) && (!statementItem?.accountTarget || !statementItem?.accountTarget.identity)) {
					this.$_message_showRequired("Mising account source/target.");
					return;
				}

				if (!statementItem.paymentMethod) {
					this.$_message_showRequired("Mising payment method.");
					return;
				}

				if (this.isInstallmentPlan && this.isFirstInstallment && (!statementItem.props.installmentAmount || statementItem.props.installmentAmount <= 0)) {
					this.$_message_showRequired("Mising installment total amount.");
					return;
				}

				if (this.isInstallmentPlan && !this.isFirstInstallment && (!this.objectiveMovementSelected || !this.objectiveMovementSelected.objective || !this.objectiveMovementSelected.objective.identity)) {
					this.$_message_showRequired("Mising previous installment.");
					return;
				}
			}

			let statement = {
				identity: this.statement.identity,
				year: this.statement.year,
				month: this.statement.month,
				openingBalance: this.statement.openingBalance,
				closingBalance: this.statement.closingBalance,
				isClosed: this.statement.isClosed,
				statementType: this.statement.statementType,
				statementItemList: [statementItem],
				props: {
					isAddInstallment: command === 'addInstallment',
					isCreateObjective: command === 'createObjective',
					objectiveIdentity: this.objectiveMovementSelected ? this.objectiveMovementSelected.objective.identity : null
				}
			}

			this.$emit("executeEdition", statement);

			this.isInstallmentPlan = false;
			this.isFirstInstallment = true;
		},

		validateSelectedSource(statementItem) {
			let errorMessage = "";

			if (!statementItem || !statementItem.accountSource || statementItem.accountSource.level.length != 9)
				errorMessage = "Please, select a final source account.";
			else if (statementItem.accountSource.level.startsWith("03."))
				errorMessage = `Accounts with level "03." can't be used as source account.`;

			if (errorMessage) {
				this.$_message_showRequired(errorMessage);
				statementItem.accountSource = {};

				return;
			}
		},

		validateSelectedTarget(statementItem) {
			let errorMessage = "";

			if (!statementItem || !statementItem.accountTarget || statementItem.accountTarget.level.length != 9)
				errorMessage = "Please, select a final target account.";
			else if (statementItem.accountTarget.level.startsWith("02."))
				errorMessage = `Accounts with level "02." can't be used as target account.`;

			if (errorMessage) {
				this.$_message_showRequired(errorMessage);
				statementItem.accountTarget = {};

				return;
			}
		},

		selectItem(statementItem) {
			statementItem.descriptionNew = this.objectiveMovementSelected.objective.description;
			statementItem.accountTarget = this.objectiveMovementSelected.objective.objectiveItemList[0].accountTarget;
			statementItem.location = this.objectiveMovementSelected.objective.location;
			statementItem.paymentMethod = this.objectiveMovementSelected.paymentMethod;
		},

		resetStatementItemForm() {
			this.statement.statementItemList.forEach(statementItem => {
				statementItem.descriptionNew = null;
				statementItem.accountTarget = null;
				statementItem.location = null;
				statementItem.paymentMethod = null;
				statementItem.props.installmentAmount = null;
			});
		}
	},

	computed: {
		appStore() {
			return useAppStore()
		},

		isReadonly() {
			return this.isInstallmentPlan && !this.isFirstInstallment;
		},
	},

	watch: {
		"isInstallmentPlan": function(newValue) {
			if (!newValue) {
				this.isFirstInstallment = true;
				this.resetStatementItemForm();
			}
		},

		"isFirstInstallment": function(newValue) {
			if (newValue) {
				this.objectiveMovementSelected = null;
				this.resetStatementItemForm();
			}
		},

		"statementItem.props.installmentAmount": function(newValue) {
			if (newValue === "1")
				this.isFirstInstallment = true;
		}
	}
};
</script>
