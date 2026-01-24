<template>
	<v-dialog persistent v-model="appStore.globalDialog" width="1000">
		<v-card class="mb-3">
			<v-toolbar color="primary" height="35" dark flat>
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

				Icons (experimental) {{ this.account.icon }} {{ getIconIndex(this.account.icon) }}
				<v-btn-toggle :v-model="getIconIndex(this.account.icon)" color="secondary" mandatory>
					<v-btn v-for="icon in iconList" @click="setIcon(icon.name)">
						<v-icon :icon="icon.name" size="28" />
					</v-btn>
				</v-btn-toggle>
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
				{ name: "mdi-cube-outline" },
				{ name: "mdi-magnify" },
				{ name: "mdi-vuetify" },
				{ name: "mdi-heart-pulse" },
				{ name: "mdi-lightbulb" },
				{ name: "mdi-gas-station" },
				{ name: "mdi-silverware-fork-knife" },
				{ name: "mdi-wrench" },
				{ name: "mdi-car" },
				{ name: "mdi-broom" },
				{ name: "mdi-wifi" },
				{ name: "mdi-office-building" },
				{ name: "mdi-lightning-bolt" },
				{ name: "mdi-oil" },
				{ name: "mdi-airplane-takeoff" },
				{ name: "mdi-taxi" },
				{ name: "mdi-credit-card" },
				{ name: "mdi-desktop-classic" },
				{ name: "mdi-power-plug" },
				{ name: "mdi-hammer" },
				{ name: "mdi-basketball" },
				{ name: "mdi-cellphone" },
				{ name: "mdi-bicycle" },
				{ name: "mdi-television" },
				{ name: "mdi-hamburger" },
				{ name: "mdi-filmstrip" },
			]
		}
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

		setIcon(iconName) {
			this.account.icon = iconName;
		},

		getIconIndex(iconName) {
			return this.iconList.findIndex(icon => icon.name === iconName);
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
