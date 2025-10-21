<template>
	<v-card>
		<v-card-text>
			<h3 v-if="collectionLength > 0" class="text-left pb-3">Results in This Page: {{ collectionLength }}</h3>
			<slot></slot>
			<v-card-text v-if="collectionLength == 0">No results found.</v-card-text>
		</v-card-text>
	</v-card>
</template>

<script>
export default {
	name: "DfResultLayout",

	props: {
		collectionLength: {
			type: Number,
			required: true
		}
	}
}
</script>