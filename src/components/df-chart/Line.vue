<template>
	<LineChartGenerator
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
 import { Line as LineChartGenerator } from 'vue-chartjs'

 import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	LineElement,
	LinearScale,
	CategoryScale,
	PointElement
 } from 'chart.js'

 ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

 export default {
	name: 'LineChart',

	components: { LineChartGenerator },

	props: {
		width: { type: Number, default: 400 },
		height: { type: Number, default: 300 },
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
