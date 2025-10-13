<template>
	<div :class="gridStyle">
		<slot></slot>
	</div>
</template>

<script>
export default {
	name: "DfGrid",
	props: {
		fluid: {
			type: Boolean,
			default: false
		},
		column: {
			type: String,
			default: "auto-md"
		},
		spaced: {
			type: Boolean,
			default: false
		}
	},

	computed: {
		gridStyle() {
			let gridStyle = "df-grid";

			if (this.column)
				gridStyle += ` df-column-${this.column}`;

			if (this.spaced)
				gridStyle += ` df-grid-margin-bottom`;

			if (this.fluid)
				gridStyle += ` df-fluid`;

			return gridStyle;
		}
	}
}
</script>

<style lang="css">
.df-grid {
	display: grid;
	grid-row-gap: 8px;
	grid-column-gap: 8px;
}

.df-grid-margin-bottom {
	margin-bottom: 8px;
}

.df-column-menu {
	grid-template-columns: auto 60px;
}

.df-column-auto-xs {
	grid-template-columns: repeat(auto-fit, minmax(75px, 1fr));
	grid-auto-flow: row;
}

.df-column-auto-sm {
	grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
	grid-auto-flow: row;
}

.df-column-auto-md {
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	grid-auto-flow: row;
}

.df-column-auto-lg {
	grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
	grid-auto-flow: row;
}

.df-column-fixed-1 {
	grid-template-columns: 1fr;
}

.df-column-fixed-2 {
	grid-template-columns: 1fr 1fr;
}

.df-column-fixed-3 {
	grid-template-columns: 1fr 1fr 1fr;
}

.df-column-fixed-4 {
	grid-template-columns: 1fr 1fr 1fr 1fr;
}

.df-column-fixed-5 {
	grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
}

.df-column-frac-15 { grid-template-columns: 0.2fr 0.8fr; }
.df-column-frac-25 { grid-template-columns: 0.4fr 0.6fr; }
.df-column-frac-35 { grid-template-columns: 0.6fr 0.4fr; }
.df-column-frac-45 { grid-template-columns: 0.8fr 0.2fr; }

.df-fluid input[type=text], input[type=password], input[type=email], .df-fluid input[type=button], input[type=number], .df-fluid input[type=file], .df-fluid select, .df-fluid button, .df-fluid textarea {
	width: 100% !important;
	height: 25px;
	box-sizing: border-box !important;
}

.df-vertical-center {
	display: grid;
	align-items: center;
}
</style>
