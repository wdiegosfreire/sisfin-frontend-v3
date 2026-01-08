<template>
	<v-dialog persistent v-model="appStore.globalDialog" width="1500">
		<v-card class="mb-3">
			<v-toolbar color="primary" height="35" dark flat>
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
				</v-card-text>
				<v-expansion-panels variant="accordion">
					<v-expansion-panel title="Statement Items">
						<v-expansion-panel-text>
							<v-card class="mt-3" v-for="(statementItem, index) in statement.statementItemList" :key="statementItem.identity" outlined>
								<v-card-title>{{ index + 1 }}. {{ statementItem.description }}</v-card-title>

								<v-card-text>
									<df-grid column="auto-sm" spaced>
										<df-output-text label="Date">{{ toBrasilianDate(statementItem.movementDate) }}</df-output-text>
										<df-output-text label="Value">{{ currency(statementItem.movementValue) }}</df-output-text>
										<df-output-text label="Document Number">{{ statementItem.documentNumber ? statementItem.documentNumber : "-"}}</df-output-text>
									</df-grid>
								</v-card-text>

								<span v-if="!statementItem.isExported && statementItem.props.similarMovementList.length > 0" outlined>
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
											<df-grid column="auto-lg" fluid>
												<v-text-field label="New Description" v-model="statementItem.descriptionNew" dense />
												<df-autocomplete-account v-if="statementItem.operationType == 'C'" label="Source Account" v-model="statementItem.accountSource" :items="accountListComboSource" validate-as="source" clearable dense></df-autocomplete-account>
												<df-autocomplete-account v-if="statementItem.operationType == 'D'" label="Target Account" v-model="statementItem.accountTarget" :items="accountListComboTarget" validate-as="target" clearable dense></df-autocomplete-account>
											</df-grid>
											<df-grid column="auto-lg" fluid>
												<df-grid column="fixed-2">
													<v-autocomplete label="Location" item-text="name" item-value="identity" v-model="statementItem.location" :items="locationListCombo" clearable return-object dense></v-autocomplete>
													<v-autocomplete label="Payment Method" item-text="name" item-value="identity" v-model="statementItem.paymentMethod" :items="paymentMethodListCombo" clearable return-object dense></v-autocomplete>
												</df-grid>
												<df-grid column="fixed-2">
													<v-btn small @click="executeEdition(statementItem, true)" class="mr-3">Export and Create Movement</v-btn>
													<v-btn small @click="executeEdition(statementItem, false)">Export without Create Movement</v-btn>

												</df-grid>
											</df-grid>
										</v-card-text>
									</v-expand-transition>
								</span>
							</v-card>
						</v-expansion-panel-text>
					</v-expansion-panel>
				</v-expansion-panels>
			</span>

			<v-card-actions v-if="!statement.identity">
				<v-btn width="150" @click="executeRegistration(statement)">Confirm</v-btn>
				<v-btn width="150" @click="$emit('cleanForm', statement)">Clear</v-btn>
				<v-btn width="150" @click="$emit('closeForm', statement)">Close</v-btn>
			</v-card-actions>
			<v-card-actions v-else>
				<v-btn width="150" @click="$emit('closeForm', statement)">Close</v-btn>
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
		}
	},

	data() {
		return {
			bankComboSelected: null,
			statementTypeComboSelected: null
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

		executeEdition(statementItem, isCreateMovement) {
			if (isCreateMovement) {
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
			}

			let statement = {
				identity: this.statement.identity,
				year: this.statement.year,
				month: this.statement.month,
				openingBalance: this.statement.openingBalance,
				closingBalance: this.statement.closingBalance,
				isClosed: this.statement.isClosed,
				statementType: this.statement.statementType,
				isCreateMovement: isCreateMovement,
				statementItemList: [statementItem]
			}

			this.$emit("executeEdition", statement);
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
	},

	computed: {
		appStore() {
			return useAppStore()
		},
	}
};
</script>
