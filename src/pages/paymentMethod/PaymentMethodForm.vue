<template>
	<v-dialog persistent v-model="appStore.globalDialog" width="800">
		<v-card class="mb-3">
			<v-toolbar color="primary" height="35" dark flat>
				<v-toolbar-title>
					<span v-if="this.paymentMethod.identity">Edit Payment Method</span>
					<span v-else>New Payment Method</span>
				</v-toolbar-title>
			</v-toolbar>

			<v-card-text>
				<df-grid v-if="paymentMethod.identity" >
					<v-text-field label="Identity" readonly v-model="paymentMethod.identity" />
				</df-grid>
				<df-grid>
					<v-text-field label="Name" v-model="paymentMethod.name" autofocus />
				</df-grid>
				<df-grid>
					<v-text-field label="Acronym" v-model="paymentMethod.acronym" v-mask="['AAA']" />
				</df-grid>
			</v-card-text>

			<v-card-actions>
				<v-btn v-if="this.paymentMethod.identity" color="button" width="150" @click="$emit('executeEdition', paymentMethod)">Confirm</v-btn>
				<v-btn v-else width="150" @click="$emit('executeRegistration', paymentMethod)">Confirmar</v-btn>

				<v-btn width="150" @click="$emit('cleanForm', paymentMethod)">Limpar</v-btn>
				<v-btn width="150" @click="$emit('closeForm', paymentMethod)">Close</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script lang="js">
import { useAppStore } from '@/stores/app';

import DfGrid from "../../components/grid/Grid.vue";

export default {
	name: "PaymentMethodForm",

	components: { DfGrid },

	props: {
		paymentMethod: {
			type: Object,
			required: true
		}
	},

	computed: {
		appStore() {
			return useAppStore()
		},
	}
};
</script>
