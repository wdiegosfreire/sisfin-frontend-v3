<template>
	<v-snackbar v-model="appStore.globalLoading">
		<div class="text-center">
			<div>Loading</div>
			<v-icon>mdi-clock</v-icon>
		</div>
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
