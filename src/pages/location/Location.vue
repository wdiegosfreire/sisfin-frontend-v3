<template>
	<div>
		<v-app-bar>
			<v-toolbar-title>Locations</v-toolbar-title>
			<v-spacer></v-spacer>

			<v-btn @click.stop="accessModule()" title="Click to reload page" icon="mdi-rotate-3d-variant" />
			<v-btn @click.stop="toggleFilterField()" title="Click to search" icon="mdi-magnify" />
			<v-btn @click.stop="accessRegistration()" title="Click to register a new item" icon="mdi-plus" />
		</v-app-bar>

		<df-input-filter transition="slide-x-transition" v-if="showSearchField" @type="executeSearch" />

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
	</div>
</template>

<script lang="js">
import locationService from "@/pages/location/locationService.js";
import LocationResult from "@/pages/location/LocationResult.vue";
import LocationForm from "@/pages/location/LocationForm.vue";

import DfInputFilter from "@/components/df-input/InputFilter.vue";

export default {
	name: "Location",

	components: { LocationResult, LocationForm, DfInputFilter },

	mixins: [locationService],

	methods: {
		toggleFilterField() {
			if (this.showSearchField)
				this.executeSearch();

			this.showSearchField = !this.showSearchField;
		}
	},

	created() {
		this.accessModule();
	},
};
</script>
