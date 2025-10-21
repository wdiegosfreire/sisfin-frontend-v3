<template>
	<div>
		<v-app-bar color="primary" dense dark>
			<v-toolbar-title>Locations</v-toolbar-title>
			<v-spacer></v-spacer>

			<v-btn icon @click.stop="accessModule()" title="Click to reload page"><df-icon icon="fa-arrows-rotate" size="lg" /></v-btn>
			<v-btn icon @click.stop="toggleFilterField()" title="Click to search"><df-icon icon="fa-magnifying-glass" size="lg" /></v-btn>
			<v-btn icon @click.stop="accessRegistration()" title="Click to register a new location"><df-icon icon="fa-plus" /></v-btn>
		</v-app-bar>

		<df-input-filter transition="slide-x-transition" v-if="showSearchField" @type="executeSearch" />

		<location-result :collection="locationListResult"
			@accessEdition="accessEdition"
			@executeExclusion="executeExclusion"
		/>

		<location-form :location="locationForm"
			@executeRegistration="executeRegistration"
			@executeEdition="executeEdition"
			@closeForm="closeForm"
		/>
	</div>
</template>

<script lang="js">
import locationService from "./locationService.js";
import LocationResult from "./LocationResult.vue";
import LocationForm from "./LocationForm.vue";

import DfIcon from "../../components/df-icon/Icon.vue";
import DfInputFilter from "../../components/df-input/InputFilter.vue";

export default {
	name: "Location",

	components: { LocationResult, LocationForm, DfInputFilter, DfIcon },

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
