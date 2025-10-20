<template>
	<Pie
		:data="chartData"
		:width="width"
		:height="height"
		:styles="styles"
		:options="chartOptions"
		:plugins="plugins"
		:chart-id="chartId"
		:css-classes="cssClasses"
		:dataset-id-key="datasetIdKey"
	/>

	<!-- <Pie
		:width="width"
		:height="height"
		:styles="styles"
		:plugins="plugins"
		:chart-id="chartId"
		:chart-data="chartData"
		:css-classes="cssClasses"
		:chart-options="chartOptions"
		:dataset-id-key="datasetIdKey"
	/> -->
 </template>

 <script>
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, Title } from 'chart.js';
import { Pie } from 'vue-chartjs';
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, Title);

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
				maintainAspectRatio: true
			}
		}
	}
}
</script>
