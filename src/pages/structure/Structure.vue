<template>
	<div>
		<structure-header />

		<v-main>
			<v-container fluid>
				<v-row>
					<v-col>
						<router-view />
					</v-col>
				</v-row>
			</v-container>
		</v-main>

		<structure-messaging />
	</div>
</template>

<script>
import StructureHeader from "./StructureHeader.vue";
import StructureMessaging from "./StructureMessaging.vue";

export default {
	name: "Structure",

	components: { StructureHeader, StructureMessaging }
};
</script>
