<template>
	<fa-icon
		:icon="getIcon"
		:size="size"

		:beat="beat"
		:fade="fade"
		:spin="spin"
		:snake="snake"
		:bounce="bounce"

		:title="title"
		:class="getClicked"

		@click="$emit('click')"
	/>
</template>

<script>
export default {
	name: "DfIcon",

	data() {
		return {
			isClicked: false
		}
	},

	props: {
		icon: { type: String, required: true },
		size: { type: String, default: "xl" },
		beat: { type: Boolean },
		fade: { type: Boolean },
		spin: { type: Boolean },
		snake: { type: Boolean },
		bounce: { type: Boolean },
		title: { type: String },
		clicked: { type: Boolean }
	},

	computed: {
		getIcon() {
			return `fa-solid ${this.icon}`;
		},
		getClicked() {
			return this.clicked ? "clicked" : "";
		}
	},
};
</script>

<style lang="css">
.clicked {
	color: red;
}
</style>
