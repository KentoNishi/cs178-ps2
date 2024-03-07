<script lang="ts">
	import type { StopWithPosition } from '$lib/ts/types';
	import busImg from '../assets/bus.png';

	export let stops: StopWithPosition[];
	export let busLocation = 0;
	export let busName = '';
</script>

<div class="card">
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

<style>
	.card {
		background-color: rgba(225, 225, 225, 1);
		padding-top: 60px;
		margin-top: 10px;
		width: calc(100% - 8px);
		display: flex;
		justify-content: center;
		padding-bottom: 15px;
		border-radius: 10px;
		box-shadow: 0px 5px 22px -3px rgb(200, 200, 200);
		border: 4px solid rgb(197, 197, 197);
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
		transform: translate(-20px, -55px);
	}

	.route {
		position: relative;
		width: 100%;
		height: var(--route-size);
		background-color: rgb(108, 108, 108);
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
		border: var(--border-size) solid rgb(108, 108, 108);
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
	}
</style>
