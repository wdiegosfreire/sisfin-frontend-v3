<template>
	<v-card>
		<v-card-title class="headline">Vehicle</v-card-title>

		<v-card-text>
			<df-grid spaced>
				<div style="border: solid 1px white;">Vehicle</div>
				<div style="border: solid 1px white;">Vehicle</div>
				<div style="border: solid 1px white;">Vehicle</div>
				<div style="border: solid 1px white;">Vehicle</div>
				<div style="border: solid 1px white;">Vehicle</div>
				<div style="border: solid 1px white;">Vehicle</div>
				<div style="border: solid 1px white;">Vehicle</div>
				<div style="border: solid 1px white;">Vehicle</div>
				<div style="border: solid 1px white;">Vehicle</div>
				<div style="border: solid 1px white;">Vehicle</div>
			</df-grid>
		</v-card-text>
	</v-card>
</template>

<script>
import DfGrid from "../../components/grid/Grid.vue";

export default {
	name: "Vehicle",
	components: { DfGrid }
}
</script>
