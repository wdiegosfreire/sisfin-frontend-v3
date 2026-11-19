/**
 * plugins/themes.js
 *
 * Application color themes. Each palette is registered in Vuetify as two named
 * themes ("<value>Light" and "<value>Dark"), switched with theme.change().
 */

const THEME_KEY = 'themeSelected';
const DARK_KEY = 'themeDark';

export const DEFAULT_THEME = 'deepPurple';

// Semantic colors carry meaning (success, error...), so they are the same in every palette.
const semanticColors = {
	light: { success: '#2E7D32', info: '#0277BD', warning: '#E65100', error: '#D32F2F' },
	dark: { success: '#81C784', info: '#4FC3F7', warning: '#FFB74D', error: '#E57373' }
};

// Light variants use 700-ish tones (readable with white text); dark variants use 200-300 tones (readable on dark surfaces).
const palettes = [
	{ name: 'Blue', value: 'blue', light: { primary: '#1976D2', secondary: '#64B5F6' }, dark: { primary: '#64B5F6', secondary: '#90CAF9' } },
	{ name: 'Cyan', value: 'cyan', light: { primary: '#00838F', secondary: '#4DD0E1' }, dark: { primary: '#4DD0E1', secondary: '#80DEEA' } },
	{ name: 'Blue Gray', value: 'blueGray', light: { primary: '#546E7A', secondary: '#90A4AE' }, dark: { primary: '#90A4AE', secondary: '#B0BEC5' } },
	{ name: 'Deep Purple', value: 'deepPurple', light: { primary: '#673AB7', secondary: '#9575CD' }, dark: { primary: '#B39DDB', secondary: '#D1C4E9' } },
	{ name: 'Deep Orange', value: 'deepOrange', light: { primary: '#D84315', secondary: '#FF8A65' }, dark: { primary: '#FF8A65', secondary: '#FFAB91' } },
	{ name: 'Pink', value: 'pink', light: { primary: '#C2185B', secondary: '#F06292' }, dark: { primary: '#F06292', secondary: '#F48FB1' } },
	{ name: 'Gray', value: 'gray', light: { primary: '#616161', secondary: '#9E9E9E' }, dark: { primary: '#BDBDBD', secondary: '#E0E0E0' } },
];

export const themeList = palettes.map(({ name, value }) => ({ name, value }));

export function themeName(value, dark) {
	return `${value}${dark ? 'Dark' : 'Light'}`;
}

export const vuetifyThemes = Object.fromEntries(palettes.flatMap(palette => [
	[themeName(palette.value, false), { dark: false, colors: { ...semanticColors.light, ...palette.light } }],
	[themeName(palette.value, true), { dark: true, colors: { ...semanticColors.dark, ...palette.dark } }],
]));

export function loadThemePreference() {
	const saved = localStorage.getItem(THEME_KEY);

	return {
		value: palettes.some(palette => palette.value === saved) ? saved : DEFAULT_THEME,
		dark: localStorage.getItem(DARK_KEY) === 'true'
	};
}

export function saveThemePreference(value, dark) {
	localStorage.setItem(THEME_KEY, value);
	localStorage.setItem(DARK_KEY, String(dark));
}
