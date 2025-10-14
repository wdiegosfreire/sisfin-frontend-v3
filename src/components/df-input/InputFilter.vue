<template>
	<v-text-field v-model="textSearch" label="Search" @input="executeSearch()" />
</template>

<script>
	export default {
		name: "DfInputFilter",
		data() {
			return {
				textSearch: "",
				lastChange: 0,
				delay: 300
			}
		},
		methods: {
			executeSearch() {
				this.lastChange = new Date().getTime();

				setTimeout(() => {
					if (new Date().getTime() >= this.lastChange + this.delay) {
						this.$emit("type", this.textSearch);
					}
				}, this.delay);
			}
		}
	}
</script>
