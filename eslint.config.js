import vue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';

export default [
	{
		ignores: ["dist/"]
	},

	{
		files: ['**/*.vue', '**/*.js'],

		languageOptions: {
			parser: vueParser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
		},

		plugins: {
			vue,
		},

		rules: {
			// Regras específicas para arquivos .vue
			'vue/no-unused-vars': 'error', // Verifica variáveis não utilizadas
			'vue/no-dupe-keys': 'error', // Evita chaves duplicadas em objetos
			'vue/no-parsing-error': 'error', // Verifica erros de sintaxe
			'vue/no-unused-components': 'warn', // Verifica componentes não utilizados
			'vue/valid-v-for': 'error', // Verifica diretiva v-for válida
			'vue/valid-v-if': 'error', // Verifica diretiva v-if válida
			'vue/valid-v-model': 'error', // Verifica diretiva v-model válida
			"vue/html-indent": ["error", "tab"], // Indentação consistente em arquivos .vue
			// 'vue/no-mutating-props': 'warn', // Evita mutação direta de props

			// Suas regras personalizadas
			// "semi": ["error", "always"],
			"brace-style": ['warn', 'stroustrup', { allowSingleLine: true }],
			"comma-spacing": ['error', { before: false, after: true }],
			"quotes": ["off"],
			"indent": ["error", "tab"],
		},
	},
];
