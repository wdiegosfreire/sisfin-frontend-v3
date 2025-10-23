<template>
	<v-app-bar app color="primary" dark>
		<template v-slot:prepend>
			<v-app-bar-nav-icon v-if="appStore.sessionToken" @click.stop="showNavigationDrawer = !showNavigationDrawer"></v-app-bar-nav-icon>
		</template>

		<v-app-bar-title :title="computedEnviroment">
			Financial Control System - FCS <span class="text-caption">2025-06-05</span>
		</v-app-bar-title>

		<template v-slot:append>
			<v-btn v-if="appStore.sessionToken" text @click="executeLogout()">Log Out</v-btn>
		</template>
	</v-app-bar>

	<v-navigation-drawer v-model="showNavigationDrawer" width="400" fixed temporary dark >
		<v-list-item>
			<template v-slot:prepend><v-avatar color="primary" size="40">{{ computedInitials }}</v-avatar></template>
			<v-list-item-title>{{ computedName }}</v-list-item-title>
		</v-list-item>

		<v-divider></v-divider>

		<v-list dense>
			<v-list-item>
				<v-autocomplete v-model="themeSelected" label="Theme" :items="themeList" item-title="name" item-value="value" @change="themeChange();" return-object />
				<v-autocomplete v-model="themeDark" label="Dark Theme" :items="decisionList" item-title="label" item-value="value" @change="themeChange();" />
			</v-list-item>

			<v-list-group value="finances">
				<template v-slot:activator="{ props }">
					<v-list-item v-bind="props">FINANCES</v-list-item>
				</template>

				<v-list-group value="activities">
					<template v-slot:activator="{ props }">
						<v-list-item v-bind="props">ACTIVITIES</v-list-item>
					</template>

					<v-list-item link @click="accessModuleSummary()" prepend-icon="mdi-text">Summary (OK)</v-list-item>
					<v-list-item link @click="accessModuleObjective()" prepend-icon="mdi-cash-multiple">Objectives</v-list-item>
					<v-list-item link @click="accessModuleStatement()" prepend-icon="mdi-notebook-plus">Statements</v-list-item>
				</v-list-group>

				<v-list-group value="registrations">
					<template v-slot:activator="{ props }">
						<v-list-item v-bind="props">REGISTRATIONS</v-list-item>
					</template>

					<v-list-item link @click="accessModuleAccount()" prepend-icon="mdi-bank-outline">Accounts</v-list-item>
					<v-list-item link @click="accessModuleLocation()" prepend-icon="mdi-office-building-marker">Locations (OK)</v-list-item>
					<v-list-item link @click="accessModulePaymentMethod()" prepend-icon="mdi-credit-card-check">Payment Methods (OK)</v-list-item>
					<v-list-item link @click="accessModuleBank()" prepend-icon="mdi-bank">Banks (OK)</v-list-item>
					<v-list-item link @click="accessModuleStatementType()" prepend-icon="mdi-format-list-bulleted-type">Statement Types</v-list-item>
					<v-list-item link @click="accessModuleStatementPattern()" prepend-icon="mdi-lock-pattern">Statement Patterns</v-list-item>
				</v-list-group>
			</v-list-group>

			<v-list-group value="supermarket">
				<template v-slot:activator="{ props }">
					<v-list-item v-bind="props">SUPERMARKET</v-list-item>
				</template>

				<v-list-group value="supermarketActivities">
					<template v-slot:activator="{ props }">
						<v-list-item v-bind="props">ACTIVITIES</v-list-item>
					</template>

					<v-list-item link @click="accessModuleSupermarket()" prepend-icon="mdi-text">Activity One</v-list-item>
				</v-list-group>

				<v-list-group value="supermarketRegistrations">
					<template v-slot:activator="{ props }">
						<v-list-item v-bind="props">REGISTRATIONS</v-list-item>
					</template>

					<v-list-item link @click="accessModuleSupermarket()" prepend-icon="mdi-text">Registration One</v-list-item>
				</v-list-group>
			</v-list-group>

			<v-list-group value="comingSoon">
				<template v-slot:activator="{ props }">
					<v-list-item v-bind="props">COMING SOON</v-list-item>
				</template>

				<v-list-item link @click="accessModuleWishList()" prepend-icon="mdi-heart-plus">Wish List</v-list-item>
				<v-list-item link @click="accessModuleVehicle()" prepend-icon="mdi-car">Car Management</v-list-item>
			</v-list-group>

			<v-divider></v-divider>

			<v-list-item link @click="executeLogout()" prepend-icon="mdi-logout">Log Out</v-list-item>
		</v-list>
	</v-navigation-drawer>

</template>

<script>
import { useTheme } from 'vuetify';
import { useAppStore } from '@/stores/app';

import maintenanceApi from "../../components/axios/maintenance/maintenanceApi.js";
import message from "../../components/mixins/message";

export default {
	name: "StructureHeader",

	mixins: [maintenanceApi, message],

	data() {
		return {
			user: {},
			showNavigationDrawer: false,

			themeDark: false,
			themeSelected: {},

			decisionList: [
				{ label: 'No', value: false },
				{ label: 'Yes', value: true }
			],

			themeList: [
				{
					name: "Blue",
					value: "blue",
					light: { primary: '#2196F3', secondary: '#BBDEFB', accent: '#E91E63', success: '#4CAF50', info: '#2196F3', warning: '#FB8C00', error: '#FF5252' },
					dark: { primary: '#2196F3', secondary: '#BBDEFB', accent: '#E91E63', success: '#4CAF50', info: '#2196F3', warning: '#FB8C00', error: '#FF5252' }
				},
            {
					name: "Cyan",
					value: "cyan",
					light: { primary: '#00BCD4', secondary: '#80DEEA', accent: '#E0F7FA', success: '#4CAF50', info: '#2196F3', warning: '#FFC107', error: '#D32F2F' },
					dark: { primary: '#00BCD4', secondary: '#80DEEA', accent: '#E0F7FA', success: '#4CAF50', info: '#2196F3', warning: '#FFC107', error: '#D32F2F' }
				},
				{
					name: "Blue Gray",
					value: "blueGray",
					light: { primary: '#607D8B', secondary: '#FFC107', accent: '#FF5722', success: '#4CAF50', info: '#03A9F4', warning: '#FF9800', error: '#F44336' },
					dark: { primary: '#607D8B', secondary: '#FFC107', accent: '#FF5722', success: '#4CAF50', info: '#03A9F4', warning: '#FF9800', error: '#F44336' }
				},
				{
					name: "Deep Purple",
					value: "deepPurple",
					light: { primary: '#673AB7', secondary: '#9575CD', accent: '#D1C4E9', success: '#4CAF50', info: '#29B6F6', warning: '#FFC107', error: '#D32F2F' },
					dark: { primary: '#673AB7', secondary: '#9575CD', accent: '#D1C4E9', success: '#4CAF50', info: '#29B6F6', warning: '#FFC107', error: '#D32F2F' }
				},
				{
					name: "Deep Orange",
					value: "deepOrange",
					light: { primary: '#FF5722', secondary: '#FFC107', accent: '#4CAF50', success: '#8BC34A', info: '#2196F3', warning: '#FF9800', error: '#D32F2F' },
					dark: { primary: '#FF5722', secondary: '#795548', accent: '#FF9800', error: '#D32F2F', warning: '#FF9800', info: '#2196F3', success: '#8BC34A' }
				},
				{
					name: "Pink",
					value: "pink",
					light: { primary: '#E91E63', secondary: '#9C27B0', accent: '#FF9800', error: '#F44336', warning: '#FFC107', info: '#2196F3', success: '#4CAF50' },
					dark: { primary: '#E91E63', secondary: '#673AB7', accent: '#FF5722', error: '#D32F2F', warning: '#FF9800', info: '#03A9F4', success: '#8BC34A' }
				},
				{
					name: "Gray",
					value: "gray",
					light: { primary: '#9E9E9E', secondary: '#607D8B', accent: '#FF9800', error: '#F44336', warning: '#FFC107', info: '#2196F3', success: '#4CAF50' },
					dark: { primary: '#9E9E9E', secondary: '#455A64', accent: '#FF5722', error: '#D32F2F', warning: '#FF9800', info: '#03A9F4', success: '#8BC34A' }
				},
			],
		}
	},

	created() {
		const theme = useTheme();

		this.themeSelected = this.themeList[3];
		// theme.themes.value.light = this.themeSelected.light;
	},

	computed: {
		appStore() {
			return useAppStore()
		},

		computedInitials() {
			let splittedName = [];
			let firstChar = "";
			let lastChar = "";

			if (this.appStore.userName) {
				splittedName = this.appStore.userName.split(" ");
				firstChar = splittedName[0].substring(0, 1);
				lastChar = splittedName[splittedName.length - 1].substr(0, 1);
			}

			return firstChar + lastChar;
		},

		computedName() {
			let splittedName = [];
			let firstName = "";
			let lastName = "";

			if (this.appStore.userName) {
				splittedName = this.appStore.userName.split(" ");
				firstName = splittedName[0];
				lastName = splittedName[splittedName.length - 1];
			}

			return `${firstName} ${lastName}`;
		},

		computedEnviroment() {
			return `Environment ${import.meta.env.VITE_SISFIN_FRONTEND_ENVIROMENT}`;
		}
	},

	methods: {
		accessModuleSummary() {
			this.navigateTo("/summary");
		},

		accessModuleObjective() {
			this.navigateTo("/objective");
		},

		accessModuleStatement() {
			this.navigateTo("/statement");
		},

		accessModuleAccount() {
			this.navigateTo("/account");
		},

		accessModuleLocation() {
			this.navigateTo("/location");
		},

		accessModulePaymentMethod() {
			this.navigateTo("/paymentMethod");
		},

		accessModuleBank() {
			this.navigateTo("/bank");
		},

		accessModuleStatementType() {
			this.navigateTo("/statementType");
		},

		accessModuleStatementPattern() {
			this.navigateTo("/statementPattern");
		},

		accessModuleWishList() {
			this.navigateTo("/wishList");
		},

		accessModuleVehicle() {
			this.navigateTo("/vehicle");
		},

		accessModuleSupermarket() {
			this.navigateTo("/supermarket");
		},

		navigateTo(path) {
			this.$router.push(path).catch(error => {
				if (error.name !== 'NavigationDuplicated' && !error.message.includes('Avoided redundant navigation to current location')) {
					this.$_message_console(error);
				}
			});
		},

		executeLogout() {
			this.$_maintenance_post(`/user/executeLogout`, this.user).then(() => {
				useAppStore().setUserName("");
				useAppStore().setUserIdentity("");
				useAppStore().setSessionToken("");

				this.$router.push("/");
			})
			.catch(error => {
				this.$_message_showError(error.response);
			});
		},

		themeChange() {
			const theme = useTheme();

			theme.global.name.value = this.themeDark ? 'dark' : 'light';
			theme.themes.value.light = this.themeSelected.light;
			theme.themes.value.dark = this.themeSelected.dark;
		},
	}
};
</script>
