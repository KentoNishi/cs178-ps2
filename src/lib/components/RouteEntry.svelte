<script lang="ts">
	import type { StopWithPosition } from '$lib/ts/types';
	import bus from '../assets/bus.png';

	export let stops: StopWithPosition[];
	export let busLocation = 0;
</script>

<div class="container">
	<!-- Horizontal Route Line -->
	<div class="route"></div>
	{#each stops as stop}
		<div class="stop" style="left: calc({100 * stop.position}%);"></div>
	{/each}

	<img src={bus} alt="bus" class="bus-icon" style="left: calc({100 * busLocation}%);" />
</div>

<style>
	.container {
		position: relative;
		width: 100%;
		height: 80px;
		align-content: center;
	}

	.route {
		position: relative;
		width: 100%;
		height: 5px;
		border-radius: 20px;
		background-color: black;
	}

	.stop {
		position: absolute;
		transform: translate(-7.5px, -10px);
		width: 15px;
		height: 15px;
		background-color: crimson;
		border-radius: 50%;
	}

	.bus-icon {
		position: absolute;
		top: -12px;
		width: 30px;
		height: 30px;
		user-select: none;
		transform: translate(-50%, -40%);
	}
</style>
