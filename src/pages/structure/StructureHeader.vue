<template>
	<v-app-bar density="default">
		<template v-slot:prepend>
			<v-app-bar-nav-icon v-if="appStore.sessionToken" @click.stop="showNavigationDrawer = !showNavigationDrawer"></v-app-bar-nav-icon>
		</template>

		<v-app-bar-title :title="'Environment ' + computedEnviroment">
			Financial Control System - FCS <span class="text-caption">{{ computedVersion }}</span>
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

		<v-divider />

		<v-list density="compact">
			<v-list-item>
				<v-autocomplete v-model="themeSelected" label="Theme" :items="themeList" item-title="name" item-value="value" @update:modelValue="themeChange();" />
				<v-autocomplete v-model="themeDark" label="Dark Theme" :items="decisionList" item-title="label" item-value="value" @update:modelValue="themeChange();" />
			</v-list-item>

			<v-list-group value="finances">
				<template v-slot:activator="{ props }">
					<v-list-item v-bind="props">FINANCES</v-list-item>
				</template>

				<v-list-group value="activities">
					<template v-slot:activator="{ props }">
						<v-list-item v-bind="props">ACTIVITIES</v-list-item>
					</template>

					<v-list-item link @click="accessModuleSummary()" prepend-icon="mdi-text">Summary</v-list-item>
					<v-list-item link @click="accessModuleObjective()" prepend-icon="mdi-cash-multiple">Objectives</v-list-item>
					<v-list-item link @click="accessModuleStatement()" prepend-icon="mdi-notebook-plus">Statements</v-list-item>
				</v-list-group>

				<v-list-group value="registrations">
					<template v-slot:activator="{ props }">
						<v-list-item v-bind="props">REGISTRATIONS</v-list-item>
					</template>

					<v-list-item link @click="accessModuleAccount()" prepend-icon="mdi-bank-outline">Accounts</v-list-item>
					<v-list-item link @click="accessModuleLocation()" prepend-icon="mdi-office-building-marker">Locations</v-list-item>
					<v-list-item link @click="accessModulePaymentMethod()" prepend-icon="mdi-credit-card-check">Payment Methods</v-list-item>
					<v-list-item link @click="accessModuleBank()" prepend-icon="mdi-bank">Banks</v-list-item>
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

					<v-list-item link @click="accessModuleBrand()" prepend-icon="mdi-tag-outline">Brands</v-list-item>
					<v-list-item link @click="accessModuleCompany()" prepend-icon="mdi-domain">Companies</v-list-item>
					<v-list-item link @click="accessModuleProduct()" prepend-icon="mdi-package-variant-closed">Products</v-list-item>
					<v-list-item link @click="accessModuleProductCompany()" prepend-icon="mdi-store-outline">Product Companies</v-list-item>
					<v-list-item link @click="accessModuleProductCategory()" prepend-icon="mdi-shape-outline">Product Categories</v-list-item>
					<v-list-item link @click="accessModuleProductProperty()" prepend-icon="mdi-format-list-checks">Product Properties</v-list-item>
					<v-list-item link @click="accessModuleMeasurementUnit()" prepend-icon="mdi-scale-balance">Measurement Units</v-list-item>
				</v-list-group>
			</v-list-group>

			<v-list-group value="comingSoon">
				<template v-slot:activator="{ props }">
					<v-list-item v-bind="props">COMING SOON</v-list-item>
				</template>

				<v-list-item link @click="accessModuleWishList()" prepend-icon="mdi-heart-plus">Wish List</v-list-item>
				<v-list-item link @click="accessModuleVehicle()" prepend-icon="mdi-car">Car Management</v-list-item>
			</v-list-group>

			<v-divider />

			<v-list-item link @click="executeBackendAppStart()" prepend-icon="mdi-play-circle-outline">Start</v-list-item>
			<v-list-item link @click="executeBackendAppStop()" prepend-icon="mdi-stop-circle-outline">Stop</v-list-item>

			<v-divider />

			<v-list-item link @click="executeLogout()" prepend-icon="mdi-logout">Log Out</v-list-item>
		</v-list>
	</v-navigation-drawer>

</template>

<script>
import { useTheme } from 'vuetify';
import { useAppStore } from '@/stores/app';
import { DEFAULT_THEME, loadThemePreference, saveThemePreference, themeList, themeName } from '@/plugins/themes';

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
			themeSelected: DEFAULT_THEME,
			themeRef: null,

			decisionList: [
				{ label: 'No', value: false },
				{ label: 'Yes', value: true }
			],

			themeList,
		}
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
				lastChar = splittedName[splittedName.length - 1].substring(0, 1);
			}

			return (firstChar + lastChar).toUpperCase();
		},

		computedName() {
			let splittedName = [];
			let firstName = "";
			let lastName = "";

			if (this.appStore.userName) {
				splittedName = this.appStore.userName.split(" ");

				firstName = splittedName[0];
				firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();

				lastName = splittedName[splittedName.length - 1];
				lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
			}

			return `${firstName} ${lastName}`;
		},

		computedEnviroment() {
			return import.meta.env.VITE_SISFIN_FRONTEND_ENVIROMENT;
		},

		computedVersion() {
			return import.meta.env.VITE_SISFIN_FRONTEND_VERSION;
		}
	},

	methods: {
		accessModuleVehicle() { this.navigateTo("/vehicle"); },
		accessModuleWishList() { this.navigateTo("/wishList"); },
		accessModuleSupermarket() { this.navigateTo("/supermarket"); },

		accessModuleBank() { this.navigateTo("/statement/bank"); },
		accessModuleStatement() { this.navigateTo("/statement/statement"); },
		accessModuleStatementType() { this.navigateTo("/statement/statementType"); },
		accessModuleStatementPattern() { this.navigateTo("/statement/statementPattern"); },

		accessModuleAccount() { this.navigateTo("/transaction/account"); },
		accessModuleSummary() { this.navigateTo("/transaction/summary"); },
		accessModuleLocation() { this.navigateTo("/transaction/location"); },
		accessModuleObjective() { this.navigateTo("/transaction/objective"); },
		accessModulePaymentMethod() { this.navigateTo("/transaction/paymentMethod"); },

		accessModuleBrand() { this.navigateTo("/supermarket/brand"); },
		accessModuleCompany() { this.navigateTo("/supermarket/company"); },
		accessModuleProduct() { this.navigateTo("/supermarket/product"); },
		accessModuleProductCompany() { this.navigateTo("/supermarket/productCompany"); },
		accessModuleProductCategory() { this.navigateTo("/supermarket/productCategory"); },
		accessModuleProductProperty() { this.navigateTo("/supermarket/productProperty"); },
		accessModuleMeasurementUnit() { this.navigateTo("/supermarket/measurementUnit"); },

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
			}).catch(error => {
				this.$_message_showError(error.response);
			});
		},

		async executeBackendAppStart() {
			if (this.computedEnviroment !== "aws" || sessionStorage.getItem('BACKEND_APP_STARTED') === "true") {
				return;
			}

			window.open(import.meta.env.VITE_SISFIN_BACKEND_URL_APP_START, "_blank");
			sessionStorage.setItem('BACKEND_APP_STARTED', true);
			this.$_message_showInfo("Backend app start executed.");
		},

		async executeBackendAppStop() {
			if (this.computedEnviroment !== "aws") {
				return;
			}

			window.open(import.meta.env.VITE_SISFIN_BACKEND_URL_APP_STOP, "_blank");
			sessionStorage.setItem('BACKEND_APP_STARTED', false);
			this.$_message_showInfo("Backend app stop executed");
		},

		themeChange() {
			if (!this.themeRef)
				return;

			this.themeRef.change(themeName(this.themeSelected, this.themeDark));
			saveThemePreference(this.themeSelected, this.themeDark);
		},
	},

	created() {
		this.themeRef = useTheme();

		// The saved theme is already applied by plugins/vuetify.js; here it only syncs the selection fields.
		const themePreference = loadThemePreference();
		this.themeSelected = themePreference.value;
		this.themeDark = themePreference.dark;

		this.executeBackendAppStart();
	},
};
</script>
