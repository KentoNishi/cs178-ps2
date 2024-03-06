<script lang="ts">
	import type { StopWithPosition } from '$lib/ts/types';

	export let stops: StopWithPosition[];
	export let busLocation = 0;
	import bus from '../assets/bus.png';
</script>

<div class="container">
	<svg width="100%" height="100">
		<!-- VERTICAL Route Line -->
		<line x1="50" y1="10" x2="50" y2="390" class="route-line" />

		<!-- Stops -->
		{#each stops as stop}
			<circle cx="50" cy={10 + stop.position * 380} r="5" class="stop-dot" />
			<text x="40" y={10 + stop.position * 380} class="stop-name">{stop.stop_name}</text>
		{/each}

		<!-- Bus Icon (we could use png) -->
		<image href={bus} x="55" y={10 + busLocation * 380 - 10} height="20px" width="20px" />
	</svg>
</div>

<style>
	.route-line {
		stroke: black;
		stroke-width: 2;
	}

	.stop-dot {
		fill: red;
	}

	.stop-name {
		font-size: 12px;
		text-anchor: end;
		user-select: none;
	}

	.bus-icon {
		font-size: 24px;
	}

	.container {
		margin-left: 10px;
	}
</style>
