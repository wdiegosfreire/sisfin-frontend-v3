<template>
	<v-data-table
		:headers="headers"
		:items="collection"
		:search="search"
		:items-per-page="10"
		:items-per-page-options="itemsPerPageOptions"
		item-value="identity"
		density="comfortable"
		no-data-text="No results found."
		hover
	>
		<template v-slot:top>
			<v-text-field v-model="search" label="Filter" prepend-inner-icon="mdi-magnify" variant="outlined" density="compact" hide-details clearable class="mb-4" />
		</template>

		<template v-slot:[`item.actions`]="{ item }">
			<v-menu>
				<template v-slot:activator="{ props }">
					<v-btn v-bind="props" variant="text" icon="mdi-menu" />
				</template>
				<v-list width="150">
					<v-list-item @click="$emit('accessEdition', item)" append-icon="mdi-file-document-edit-outline">
						<v-list-item-title>Edit</v-list-item-title>
					</v-list-item>
					<v-list-item @click="$emit('executeExclusion', item)" append-icon="mdi-trash-can-outline">
						<v-list-item-title>Delete</v-list-item-title>
					</v-list-item>
				</v-list>
			</v-menu>
		</template>
	</v-data-table>
</template>

<script>
export default {
	name: "LocationResult",

	props: {
		collection: {
			type: Array,
			required: true
		}
	},

	data() {
		return {
			search: "",
			headers: [
				{ title: "Identity", key: "identity", align: "start", width: "100px" },
				{ title: "Name", key: "name", align: "start" },
				{ title: "Notes", key: "note", align: "start" },
				{ title: "", key: "actions", align: "end", sortable: false }
			],
			itemsPerPageOptions: [
				{ value: 10, title: "10" },
				{ value: 50, title: "50" },
				{ value: 100, title: "100" },
				{ value: -1, title: "All" }
			]
		};
	}
};
</script>
