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
import { traceAccount } from '@/utils/filters.js';

export default {
	name: "StatementPatternResult",

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
				{ title: "Comparator", key: "comparator", align: "start" },
				{ title: "Description", key: "description", align: "start" },
				{ title: "Source Account", key: "accountSource", align: "start", value: item => traceAccount(item.accountSource) },
				{ title: "Target Account", key: "accountTarget", align: "start", value: item => traceAccount(item.accountTarget) },
				{ title: "Payment Method", key: "paymentMethod", align: "start", value: item => item.paymentMethod ? `${item.paymentMethod.name} (${item.paymentMethod.acronym})` : "" },
				{ title: "Statement Type", key: "statementType", align: "start", value: item => item.statementType ? `${item.statementType.bank ? item.statementType.bank.name : ""} :: ${item.statementType.name}` : "" },
				{ title: "Location", key: "location", align: "start", value: item => item.location ? item.location.name : "" },
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
