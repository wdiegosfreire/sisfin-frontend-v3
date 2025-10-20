<template>
	<!-- Line {{ chartData }} -->
	<Line
		:data="safeChartData"
		:width="width"
		:height="height"
		:styles="styles"
		:options="chartOptions"
		:plugins="plugins"
		:chart-id="chartId"
		:css-classes="cssClasses"
		:dataset-id-key="datasetIdKey"
	/>
</template>

<script>
import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default {
	name: 'LineChart',

	components: { Line },

	props: {
		width: { type: Number, default: 400 },
		height: { type: Number, default: 300 },
		styles: { type: Object, default: () => {} },
		chartId: { type: String, default: 'line-chart' },
		plugins: { type: Array, default: () => [] },
		chartData: { type: Object, default: () => null },
		cssClasses: { default: '', type: String },
		datasetIdKey: { type: String, default: 'label' }
	},

	data() {
		return {
			chartOptions: {
				responsive: true,
				maintainAspectRatio: false
  			},

			emptyChartData: {
				"filter": null,
				"map": null,
				"filterMap": null,
				"labels": [ "00/0000" ],
				"datasets": [
					{
						"icon": null,
						"label": "Lazer e Entretenimento",
						"identifier": null,
						"backgroundColor": "#EF5350",
						"data": [ 617.78, 1317.72, 416.08, 596.49, 497.68, 2072.31 ]
					},
				],
				"userIdentity": 1
			}
		}
	},

	computed: {
		safeChartData() {
			const isEmpty = Object.keys(this.chartData).length === 0;
			return isEmpty ? this.emptyChartData : this.chartData;
		}
	}
}
</script>
