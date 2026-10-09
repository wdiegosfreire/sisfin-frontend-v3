<template>
	<v-app-bar>
		<v-toolbar-title>Locations</v-toolbar-title>
		<template v-slot:append>
			<v-btn @click.stop="accessModule()" title="Click to reload page" icon="mdi-rotate-3d-variant" />
			<v-btn @click.stop="accessRegistration()" title="Click to register a new item" icon="mdi-plus" />
		</template>
	</v-app-bar>

	<location-result :collection="locationListResult"
		@accessEdition="accessEdition"
		@executeExclusion="executeExclusion"
	/>

	<location-form v-if="appStore.globalDialog"
		:form-data="locationForm"
		@executeRegistration="executeRegistration"
		@executeEdition="executeEdition"
		@closeForm="closeForm"
	/>
</template>

<script lang="js">
import locationService from "@/pages/transaction/location/locationService.js";
import LocationResult from "@/pages/transaction/location/LocationResult.vue";
import LocationForm from "@/pages/transaction/location/LocationForm.vue";

export default {
	name: "Location",

	components: { LocationResult, LocationForm },

	mixins: [locationService],

	created() {
		this.accessModule();
	},
};
</script>
