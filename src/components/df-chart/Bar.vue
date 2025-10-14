<template>
	<Bar
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
 import { Bar } from 'vue-chartjs'

 import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	BarElement,
	CategoryScale,
	LinearScale
 } from 'chart.js'

 ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

 export default {
	name: 'BarChart',

	components: { Bar },

	props: {
		width: { type: Number, default: 400 },
		height: { type: Number, default: 400 },
		styles: { type: Object, default: () => {} },
		chartId: { type: String, default: 'bar-chart' },
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
