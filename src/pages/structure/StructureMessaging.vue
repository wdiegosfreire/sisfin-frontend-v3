<template>
	<v-snackbar v-model="showMessage" :color="severity" location="end top">
		<h3 class="mb-3 text-decoration-underline">{{ summary }}</h3>
		<div v-for="detail in detailList" :key="detail">{{ detail }}</div>
		<v-btn variant="tonal" @click="showMessage = false" class="mt-5">Close</v-btn>
	</v-snackbar>
</template>

<script>
import { useAppStore } from '@/stores/app';

export default {
	name: "Feedback",

	data() {
		return {
			severity: "",
			summary: "",
			detailList: [],
			showMessage: false,
		};
	},

	setup() {
		const { proxy } = getCurrentInstance();

		watch(
			() => useAppStore().message.date,
			() => proxy.setMessage()
		);
	},

	methods: {
		setMessage() {
			this.severity = useAppStore().message.severity;
			this.summary = useAppStore().message.summary;
			this.detailList = useAppStore().message.detailList;
			this.showMessage = true;
		},
	},
};
</script>
