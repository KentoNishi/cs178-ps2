<script lang="ts">
	import type { StopWithPosition } from '$lib/ts/types';
	import Ripple from '@smui/ripple';
	import busImg from '../assets/bus.svg';

	export let stops: StopWithPosition[];
	export let busLocation = 0;
	export let busName = '';
</script>

<div
	class="card"
	use:Ripple={{ surface: true, color: 'secondary' }}
	tabindex="0"
	role="button">
	<div class="container">
		<div class="bus-name">{busName}</div>
		<!-- Horizontal Route Line -->
		<div class="route"></div>
		{#each stops as stop}
			<div class="stop" style="left: calc({100 * stop.position}%);"></div>
		{/each}

		<img src={busImg} alt="bus" class="bus-icon" style="left: calc({100 * busLocation}%);" />
	</div>
</div>
<div class="line" />

<style>
	.line {
		width: 100%;
		height: 1px;
		background-color: rgb(108, 108, 108);
	}
	.card {
		padding-top: 60px;
		width: calc(100%);
		display: flex;
		justify-content: center;
		padding-bottom: 15px;
	}

	.container {
		position: relative;
		width: 80%;
		align-content: center;
		--route-size: 5px;
	}

	.bus-name {
		position: absolute;
		font-size: medium;
		transform: translate(-20px, -52.5px);
		color: white;
	}

	.route {
		position: relative;
		width: 100%;
		height: var(--route-size);
		background-color: var(--passio-green);
		border-radius: 10px;
	}

	.stop {
		position: absolute;
		--inner-size: 8px;
		--border-size: 4px;
		--total-size: calc(var(--inner-size) + var(--border-size) * 2);
		width: var(--inner-size);
		height: var(--inner-size);
		background-color: rgb(255, 255, 255);
		border: var(--border-size) solid rgb(132, 132, 132);
		border-radius: 50%;
		transform: translateY(calc(-50% - var(--route-size) / 2)) translateX(-50%);
	}

	.bus-icon {
		position: absolute;
		width: 40px;
		height: 40px;
		font-size: 40px;
		user-select: none;
		transform: translate(-50%, calc(-20px - 50%));
		filter: invert(0.9);
	}
</style>
