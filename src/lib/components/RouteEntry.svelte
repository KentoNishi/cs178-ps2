<script lang="ts">
	import type { StopWithPosition } from '$lib/ts/types';

	export let stops: StopWithPosition[];
	export let busLocation = 0;
</script>

<div class="card">
	<div class="container">
		<!-- Horizontal Route Line -->
		<div class="route"></div>
		{#each stops as stop}
			<div class="stop" style="left: calc({100 * stop.position}%);"></div>
		{/each}

		<div class="bus-icon" style="left: calc({100 * busLocation}%);">🚌</div>
	</div>
</div>

<style>
	.card {
		background-color: rgba(225, 225, 225, 1);
		padding-top: 50px;
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
		width: 40px;
		height: 40px;
		font-size: 40px;
		text-align: center;
		line-height: 40px;
		user-select: none;
		transform: translate(-50%, calc(-30px - 50%));
	}
</style>
