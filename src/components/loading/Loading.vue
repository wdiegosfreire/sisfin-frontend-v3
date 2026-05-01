<template>
	<v-snackbar v-model="appStore.globalLoading">
		<v-icon icon="mdi-clock" size="48px" />
		<span class="ml-5">Loading</span>
	</v-snackbar>
</template>

<script>
import { useAppStore } from '@/stores/app';

export default {
	name: "Loading",

	computed: {
		appStore() {
			return useAppStore();
		},
	}
};
</script>
