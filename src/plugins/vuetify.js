/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import { loadThemePreference, themeName, vuetifyThemes } from './themes'

const themePreference = loadThemePreference()

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
	theme: {
		defaultTheme: themeName(themePreference.value, themePreference.dark),
		themes: vuetifyThemes
	},

	defaults: {
		VAppBar: {
			color: "primary",
			density: "compact"
		},
		VToolbar: {
			color: "primary",
			density: "compact"
		},
		VDialog: {
			persistent: true
		},
		VAutocomplete: {
			noDataText: "No results found",
		},
	}
})
