<template>
	<div role="container">
		<div role="label" class="bold" v-if="label">{{ label }}</div>
		<div role="value" :style="`color: ${color}`"><slot></slot></div>
	</div>
</template>

<script>
export default {
	name: "DfOutputText",

	props: {
		label: { type: String },
		color: { type: String }
	}
};
</script>

<style lang="css">
.bold {
	font-weight: bold;
}
</style>
