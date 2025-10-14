<template>
	<Pie
		:width="width"
		:height="height"
		:styles="styles"
		:plugins="plugins"
		:chart-id="chartId"
		:chart-data="chartData"
		:css-classes="cssClasses"
		:chart-options="chartOptions"
		:dataset-id-key="datasetIdKey"
	/>
 </template>

 <script>
 import { Pie } from 'vue-chartjs'

 import {
	Chart as ChartJS,
	Title,
	Legend,
	Tooltip,
	ArcElement,
	CategoryScale
 } from 'chart.js'

 ChartJS.register(Title, Legend, Tooltip, ArcElement, CategoryScale)

 export default {
	name: 'PieChart',

	components: { Pie },

	props: {
		width: { type: Number, default: 400 },
		height: { type: Number, default: 300 },
		styles: { type: Object, default: () => {} },
		chartId: { type: String, default: 'pie-chart' },
		plugins: { type: Array, default: () => [] },
		chartData: { type: Object },
		cssClasses: { default: '', type: String },
		datasetIdKey: { type: String, default: 'label' }
	},

	data() {
		return {
			chartOptions: {
				responsive: true,
				maintainAspectRatio: false
			}
		}
	}
}
</script>
