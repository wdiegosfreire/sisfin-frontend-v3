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

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
	theme: {
		defaultTheme: 'light',
		themes: {
			light: {
				dark: false,
				colors: { primary: '#2196F3', secondary: '#BBDEFB', accent: '#E91E63', success: '#4CAF50', info: '#2196F3', warning: '#FB8C00', error: '#FF5252' }
			},
			dark: {
				dark: true,
				colors: { primary: '#272727', secondary: '#FFE18D', accent: '#FF4081', success: '#4CAF50', info: '#2196F3', warning: '#FB8C00', error: '#FF5252' }
			}
		}
	}
})
