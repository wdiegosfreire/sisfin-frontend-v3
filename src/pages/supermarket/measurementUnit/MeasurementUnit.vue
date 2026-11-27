<template>
	<v-app-bar>
		<v-toolbar-title>Measurement Units</v-toolbar-title>
		<template v-slot:append>
			<v-btn @click.stop="accessModule()" title="Click to reload page" icon="mdi-rotate-3d-variant" />
			<v-btn @click.stop="accessRegistration()" title="Click to register a new item" icon="mdi-plus" />
		</template>
	</v-app-bar>

	<measurement-unit-result :collection="measurementUnitListResult"
		@accessEdition="accessEdition"
		@executeExclusion="executeExclusion"
	/>

	<measurement-unit-form v-if="appStore.globalDialog"
		:form-data="measurementUnitForm"
		@executeRegistration="executeRegistration"
		@executeEdition="executeEdition"
		@closeForm="closeForm"
	/>
</template>

<script lang="js">
import measurementUnitService from "@/pages/supermarket/measurementUnit/measurementUnitService.js";
import MeasurementUnitResult from "@/pages/supermarket/measurementUnit/MeasurementUnitResult.vue";
import MeasurementUnitForm from "@/pages/supermarket/measurementUnit/MeasurementUnitForm.vue";

export default {
	name: "MeasurementUnit",

	components: { MeasurementUnitResult, MeasurementUnitForm },

	mixins: [measurementUnitService],

	created() {
		this.accessModule();
	},
};
</script>
