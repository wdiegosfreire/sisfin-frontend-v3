<template>
	<v-dialog persistent v-model="appStore.globalDialog" width="1000">
		<v-card class="mb-3">
			<v-toolbar>
				<v-toolbar-title>
					<span v-if="this.account.identity">Edit Account</span>
					<span v-else>New Account</span>
				</v-toolbar-title>
			</v-toolbar>

			<v-card-text>
				<span v-if="account.identity" >
					<df-grid>
						<v-text-field label="Identity" readonly v-model="account.identity" />
					</df-grid>
					<df-grid>
						<v-text-field v-if="account.level.length == 6" label="First Level Account" v-model="account.accountParent.name" readonly />
						<v-text-field v-if="account.level.length == 9" label="First Level Account" v-model="account.accountParent.accountParent.name" readonly />
						<v-text-field v-if="account.level.length == 9" label="Second Level Account" v-model="account.accountParent.name" readonly />
					</df-grid>
				</span>
				<span v-else>
					<df-grid>
						<v-autocomplete v-model="accountComboLevelOneSelected" item-title="name" item-value="identity" @update:modelValue="$emit('accessRegistration', accountComboLevelOneSelected); updateParentAccount(accountComboLevelOneSelected);" return-object label="First Level Account" :items="accountListComboLevelOne" autofocus />
						<v-autocomplete v-model="accountComboLevelTwoSelected" item-title="name" item-value="identity" @update:modelValue="updateParentAccount(accountComboLevelTwoSelected)" return-object label="Second Level Account" :items="accountListComboLevelTwo" no-data-text="Contas não Identificadas" />
					</df-grid>
				</span>

				<v-text-field label="Name" v-model="account.name" />
				<v-text-field label="Notes" v-model="account.note" />

				<v-autocomplete v-model="account.icon" item-title="name" item-value="name" label="Icon" :items="iconList">
					<template v-slot:item="{ props, item }">
						<v-list-item v-bind="props" :title="item.raw.description" :prepend-icon="item.raw.name" />
					</template>
					<template #selection="{ props, item }">
						<v-list-item v-bind="props" :title="item.raw.description" :prepend-icon="item.raw.name" class="pa-0" />
					</template>
				</v-autocomplete>
			</v-card-text>

			<v-card-actions>
				<v-btn v-if="this.account.identity" color="button" width="150" @click="executeEdition">Confirm</v-btn>
				<v-btn v-else width="150" @click="executeRegistration">Confirm</v-btn>

				<v-btn width="150" @click="cleanForm">Clear</v-btn>
				<v-btn width="150" @click="closeForm(account)">Close</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { useAppStore } from '@/stores/app';

import DfGrid from "@/components/grid/Grid.vue";

import message from "@/components/mixins/message.js";

export default {
	name: "AccountForm",

	components: { DfGrid },

	mixins: [ message ],

	props: {
		account: {
			type: Object,
			required: true
		},
		accountListComboLevelOne: {
			type: Array,
			required: true
		},
		accountListComboLevelTwo: {
			type: Array,
			required: false
		}
	},

	data() {
		return {
			accountComboLevelOneSelected: null,
			accountComboLevelTwoSelected: null,

			iconList: [
				{ name: "mdi-car", description: "Car" },
				{ name: "mdi-oil", description: "Oil" },
				{ name: "mdi-cart", description: "Cart" },
				{ name: "mdi-cash", description: "Cash" },
				{ name: "mdi-food", description: "Food" },
				{ name: "mdi-gift", description: "Gift" },
				{ name: "mdi-taxi", description: "Taxi" },
				{ name: "mdi-wifi", description: "WiFi" },
				{ name: "mdi-alarm", description: "Alarm" },
				{ name: "mdi-alien", description: "Alien" },
				{ name: "mdi-broom", description: "Broom" },
				{ name: "mdi-shape", description: "Shape" },
				{ name: "mdi-water", description: "Water" },
				{ name: "mdi-abacus", description: "Abacus" },
				{ name: "mdi-hammer", description: "Hammer" },
				{ name: "mdi-pencil", description: "Pencil" },
				{ name: "mdi-school", description: "School" },
				{ name: "mdi-wrench", description: "Wrench" },
				{ name: "mdi-account", description: "Account" },
				{ name: "mdi-bicycle", description: "Bicycle" },
				{ name: "mdi-magnify", description: "Magnify" },
				{ name: "mdi-vuetify", description: "Vuetify" },
				{ name: "mdi-arm-flex", description: "Arm Flex" },
				{ name: "mdi-cash-fast", description: "Cash Fast" },
				{ name: "mdi-hamburger", description: "Hamburger" },
				{ name: "mdi-lightbulb", description: "Lightbulb" },
				{ name: "mdi-cellphone", description: "Cell Phone" },
				{ name: "mdi-filmstrip", description: "Film Strip" },
				{ name: "mdi-basketball", description: "Basketball" },
				{ name: "mdi-power-plug", description: "Power Plug" },
				{ name: "mdi-television", description: "Television" },
				{ name: "mdi-credit-card", description: "Credit Card" },
				{ name: "mdi-gas-station", description: "Gas Station" },
				{ name: "mdi-guitar-pick", description: "Guitar Pick" },
				{ name: "mdi-heart-pulse", description: "Heart Pulse" },
				{ name: "mdi-sofa-single", description: "Sofa Single" },
				{ name: "mdi-tshirt-crew", description: "T-Shirt Crew" },
				{ name: "mdi-bank-outline", description: "Bank Outline" },
				{ name: "mdi-cart-outline", description: "Cart Outline" },
				{ name: "mdi-cube-outline", description: "Cube Outline" },
				{ name: "mdi-gas-cylinder", description: "Gas Cylinder" },
				{ name: "mdi-gift-outline", description: "Gift Outline" },
				{ name: "mdi-alien-outline", description: "Alien Outline" },
				{ name: "mdi-shape-outline", description: "Shape Outline" },
				{ name: "mdi-water-outline", description: "Water Outline" },
				{ name: "mdi-lightning-bolt", description: "Lightning Bolt" },
				{ name: "mdi-pencil-outline", description: "Pencil Outline" },
				{ name: "mdi-school-outline", description: "School Outline" },
				{ name: "mdi-desktop-classic", description: "Desktop Classic" },
				{ name: "mdi-office-building", description: "Office Building" },
				{ name: "mdi-airplane-takeoff", description: "Airplane Takeoff" },
				{ name: "mdi-arm-flex-outline", description: "Arm Flex Outline" },
				{ name: "mdi-piggy-bank-outline", description: "Piggy Bank Outline" },
				{ name: "mdi-credit-card-outline", description: "Credit Card Outline" },
				{ name: "mdi-gas-station-outline", description: "Gas Station Outline" },
				{ name: "mdi-guitar-pick-outline", description: "Guitar Pick Outline" },
				{ name: "mdi-tshirt-crew-outline", description: "T-Shirt Crew Outline" },
				{ name: "mdi-file-question-outline", description: "File Question Outline" },
				{ name: "mdi-silverware-fork-knife", description: "Silverware Fork Knife" },
				{ name: "mdi-book-open-page-variant", description: "Book Open Page Variant" },
				{ name: "mdi-human-male-female-child", description: "Human Male Female Child" },
				{ name: "mdi-book-open-page-variant-outline", description: "Book Open Page Variant Outline" },
			]
		}
	},

	created() {
		this.iconList.sort((a, b) => a.description.localeCompare(b.description))
	},

	methods: {
		executeRegistration() {
			if (this.isMissingRequiredFields()) {
				return;
			}

			this.$emit('executeRegistration', this.account);
		},

		executeEdition() {
			if (this.isMissingIdentity() || this.isMissingRequiredFields()) {
				return;
			}

			this.$emit('executeEdition', this.account);
		},

		isMissingIdentity() {
			if (!this.account.identity) {
				this.$_message_showRequired("Missing account identity.");
				return true;
			}

			return false;
		},

		isMissingRequiredFields() {
			if (!this.account?.accountParent?.identity) {
				this.$_message_showRequired("Missing account parent.");
				return;
			}

			if (!this.account?.name?.trim()) {
				this.$_message_showRequired("Missing account name.");
				return;
			}

			return false;
		},

		updateParentAccount(accountParent) {
			this.account.accountParent = null;

			if (this.account && accountParent)
				this.account.accountParent = accountParent;
		},

		cleanForm() {
			if (!this.account.identity) {
				this.account.name = null;
				this.account.level = "";
				this.account.icon = "";
				this.account.accountParent = null;

				this.accountComboLevelOneSelected = null;
				this.accountComboLevelTwoSelected = null;
			}

			this.account.note = "";
		},

		closeForm(account) {
			this.accountComboLevelOneSelected = null;
			this.accountComboLevelTwoSelected = null;

			this.$emit('closeForm', account);
		}
	},

	computed: {
		appStore() {
			return useAppStore()
		},
	}
};
</script>
