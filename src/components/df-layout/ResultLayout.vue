<template>
	<v-skeleton-loader :loading="appStore.globalLoading" type="table" class="mx-auto border">
		<v-card variant="elevated" elevation="3">
			<v-card-text>
				<h3 v-if="collectionLength > 0" class="text-left pb-3">Results in This Page: {{ collectionLength }}</h3>
				<slot></slot>
				<v-card-text v-if="collectionLength == 0">No results found.</v-card-text>
			</v-card-text>
		</v-card>
	</v-skeleton-loader>
</template>

<script>
import { useAppStore } from '@/stores/app';

export default {
	name: "DfResultLayout",

	props: {
		collectionLength: {
			type: Number,
			required: true
		}
	},

	computed: {
		appStore() {
			return useAppStore();
		}
	}
}
</script>
