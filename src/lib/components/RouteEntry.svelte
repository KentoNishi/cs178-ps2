<script lang="ts">
	import type { StopWithPosition } from '$lib/ts/types';

	export let stops: StopWithPosition[];
	export let busLocation = 0;
</script>

<div class="container">
	<!-- Horizontal Route Line -->
	<div class="route"></div>
	{#each stops as stop}
		<div class="stop" style="left: calc({100 * stop.position}%);"></div>
	{/each}

	<div class="bus-icon" style="left: calc({100 * busLocation}%);">🚌</div>
</div>

<style>
	.container {
		position: relative;
		width: 100%;
		height: 50px;
		align-content: center;
	}

	.route {
		position: relative;
		width: 100%;
		height: 2px;
		background-color: black;
	}

	.stop {
		position: absolute;
		top: -4px;
		width: 10px;
		height: 10px;
		background-color: red;
		border-radius: 50%;
	}

	.stop-name {
		position: absolute;
		top: 15px;
		white-space: nowrap;
		font-size: 12px;
		text-align: center;
		transform: translateX(-50%);
	}

	.bus-icon {
		position: absolute;
		top: -12px;
		width: 24px;
		height: 24px;
		font-size: 24px;
		text-align: center;
		line-height: 24px;
		user-select: none;
	}
</style>
