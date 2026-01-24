<template>
	<df-result-layout :collection-length="collection.length">
		<v-treeview :items="collection" :item-title="traceAccountName" item-children="accountListChild" open-on-click>
			<template v-slot:prepend="{ item }">
				<v-icon v-if="item.icon" size="28" :icon="item.icon" />
			</template>
			<template v-slot:append="{ item }">
				<div v-if="item.level.length > 3">
					<v-menu>
						<template v-slot:activator="{ props }">
							<v-btn v-bind="props" variant="text" icon="mdi-menu" />
						</template>
						<v-list width="150">
							<v-list-item @click="$emit('accessEdition', item)" append-icon="mdi-file-document-edit-outline">
								<v-list-item-title>Edit</v-list-item-title>
							</v-list-item>
							<v-list-item v-if="!item.accountListChild || item.accountListChild.length == 0" @click="$emit('executeExclusion', item)" append-icon="mdi-trash-can-outline">
								<v-list-item-title>Delete</v-list-item-title>
							</v-list-item>
						</v-list>
					</v-menu>
				</div>
			</template>
		</v-treeview>
	</df-result-layout>
</template>

<script>
import DfResultLayout from "@/components/df-layout/ResultLayout.vue";

export default {
	name: "AccountResult",

	components: { DfResultLayout },

	props: {
		collection: {
			type: Array,
			required: true
		}
	},

	data() {
		return {
			search: ""
		};
	},

	methods: {
		traceAccountName(item) {
			if (!item)
				return "";

			return item.level + " " + item.name + (item.note ? " (" + item.note + ")" : "");
		}
	}
};
</script>
