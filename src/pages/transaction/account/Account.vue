<template>
	<div>
		<v-app-bar>
			<v-toolbar-title>Accounts</v-toolbar-title>
			<v-spacer></v-spacer>

			<v-btn @click.stop="accessModule()" title="Click to reload page" icon="mdi-rotate-3d-variant" />
			<v-btn @click.stop="toggleFilterField()" title="Click to search" icon="mdi-magnify" />
			<v-btn @click.stop="accessRegistration()" title="Click to register a new item" icon="mdi-plus" />
		</v-app-bar>

		<df-input-filter transition="slide-x-transition" v-if="showSearchField" @type="executeSearch" />

		<account-result :collection="accountListResult"
			@accessEdition="accessEdition"
			@executeExclusion="executeExclusion"
		/>

		<account-form v-if="appStore.globalDialog"
			:account="accountForm"
			:account-list-combo-level-one="accountListComboLevelOne"
			:account-list-combo-level-two="accountListComboLevelTwo"

			@executeRegistration="executeRegistration"
			@accessRegistration="accessRegistration"
			@executeEdition="executeEdition"
			@closeForm="closeForm"
		/>
	</div>
</template>

<script lang="js">
import accountService from "@/pages/transaction/account/accountService.js";
import AccountResult from "@/pages/transaction/account/AccountResult.vue";
import AccountForm from "@/pages/transaction/account/AccountForm.vue";

import DfInputFilter from "@/components/df-input/InputFilter.vue";

export default {
	name: "Account",

	components: { AccountResult, AccountForm, DfInputFilter },

	mixins: [accountService],

	methods: {
		toggleFilterField() {
			if (this.showSearchField)
				this.executeSearch();

			this.showSearchField = !this.showSearchField;
		}
	},

	created() {
		this.accessModule();
	},
};
</script>
