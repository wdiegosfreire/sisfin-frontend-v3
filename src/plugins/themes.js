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
	{ name: 'Indigo', value: 'indigo', light: { primary: '#3949AB', secondary: '#7986CB' }, dark: { primary: '#9FA8DA', secondary: '#C5CAE9' } },
	{ name: 'Teal', value: 'teal', light: { primary: '#00796B', secondary: '#4DB6AC' }, dark: { primary: '#80CBC4', secondary: '#B2DFDB' } },
	{ name: 'Deep Purple', value: 'deepPurple', light: { primary: '#673AB7', secondary: '#9575CD' }, dark: { primary: '#B39DDB', secondary: '#D1C4E9' } },
	{ name: 'Plum', value: 'plum', light: { primary: '#6A1B5A', secondary: '#9C4A8B' }, dark: { primary: '#D8A6CC', secondary: '#E8C8E0' } },
	{ name: 'Wine', value: 'wine', light: { primary: '#880E4F', secondary: '#C2185B' }, dark: { primary: '#F48FB1', secondary: '#F8BBD0' } },
	{ name: 'Brown', value: 'brown', light: { primary: '#6D4C41', secondary: '#A1887F' }, dark: { primary: '#BCAAA4', secondary: '#D7CCC8' } },
	{ name: 'Slate', value: 'slate', light: { primary: '#37474F', secondary: '#78909C' }, dark: { primary: '#B0BEC5', secondary: '#CFD8DC' } },
	{ name: 'Graphite', value: 'graphite', light: { primary: '#2B2B2B', secondary: '#616161' }, dark: { primary: '#E0E0E0', secondary: '#BDBDBD' } },
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
