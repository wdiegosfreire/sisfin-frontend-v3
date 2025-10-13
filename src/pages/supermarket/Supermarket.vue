<template>
	<v-card>
		<v-card-title class="headline">Supermarket</v-card-title>

		<v-card-text>
			<df-grid spaced>
				<div style="border: solid 1px white;">Supermarket</div>
				<div style="border: solid 1px white;">Supermarket</div>
				<div style="border: solid 1px white;">Supermarket</div>
				<div style="border: solid 1px white;">Supermarket</div>
				<div style="border: solid 1px white;">Supermarket</div>
			</df-grid>
		</v-card-text>
	</v-card>
</template>

<script>
import DfGrid from "../../components/grid/Grid.vue";

export default {
	name: "Supermarket",
	components: { DfGrid }
}
</script>
