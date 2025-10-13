<template>
	<v-card>
		<v-card-title class="headline">Desejos</v-card-title>

		<v-card-text>
			<df-grid spaced>
				<div style="border: solid 1px white;">Desejos</div>
				<div style="border: solid 1px white;">Desejos</div>
				<div style="border: solid 1px white;">Desejos</div>
				<div style="border: solid 1px white;">Desejos</div>
				<div style="border: solid 1px white;">Desejos</div>
			</df-grid>
		</v-card-text>
	</v-card>
</template>

<script>
import DfGrid from "../../components/grid/Grid.vue";

export default {
	name: "WishList",
	components: { DfGrid }
}
</script>
