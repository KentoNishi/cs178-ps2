<script lang="ts">
	import type { TickWithPosition } from '$lib/ts/types';
	import Ripple from '@smui/ripple';
	import busImg from '../assets/bus.svg';

	export let ticks: TickWithPosition[];
	export let busLocation = 0;
	export let busName = '';
	export let earliestTripStart: number;
	export let latestTripEnd: number;

	const formatDate = (date: number) => {
		const d = new Date(date);
		// hour:minute, 12 hour, no zeros, no am/pm, no seconds
		return d.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: 'numeric',
			hour12: true,
			hourCycle: 'h23',
		}).slice(0, -3);
	};
</script>

<div
	class="card"
	use:Ripple={{ surface: true, color: 'secondary' }}
	tabindex="0"
	role="button">
	<div class="container">
		<div class="bus-name">{busName}</div>
		<!-- Horizontal Route Line -->
		<span class="time-label left">{formatDate(earliestTripStart)}</span>
		<span class="time-label right">{formatDate(latestTripEnd)}</span>
		<div class="route"></div>
		{#each ticks as tick}
			<div class="stop" style="left: calc(10% + {80 * tick.position}%);">
				<div class="stop-circle" />
				<span class="stop-label">{tick.stop_name}</span>
			</div>
		{/each}
		<div class="orange-bar" style="
			left: calc(10% + {80 * ticks[0].position}%);
			width: calc({80 * (ticks[ticks.length - 1].position - ticks[0].position)}%);
		">
		</div>
		<img src={busImg} alt="bus" class="bus-icon" style="left: calc(10% + {80 * busLocation}%);" />
	</div>
</div>

<style>
	.time-label {
		position: absolute;
		font-size: 0.75rem;
	}
	.time-label.left {
		transform: translate(calc(-100% - 4px), calc(-50% + var(--route-size) / 2));
		left: 0px;
	}
	.time-label.right {
		transform: translate(calc(100% + 4px), calc(-50% + var(--route-size) / 2));
		right: 0px;
	}
	.orange-bar {
		background-color: #ff3e00;
		height: 5px;
		position: absolute;
		transform: translateY(-100%);
	}
	.card {
		padding-top: 64px;
		width: calc(100%);
		display: flex;
		justify-content: center;
		padding-bottom: 42px;
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
		transform: translate(-25px, -55px);
		color: white;
		font-size: 1.2rem;
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
		transform: translateY(calc(-50% - var(--route-size) / 2)) translateX(-50%);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		z-index: 100;
	}

	.stop-circle {
		width: var(--inner-size);
		height: var(--inner-size);
		background-color: rgb(255, 255, 255);
		border: var(--border-size) solid rgb(132, 132, 132);
		border-radius: 50%;
	}

	.stop-label {
		font-size: 0.6rem;
		max-width: 50px;
		text-align: center;
		position: absolute;
		transform: translateY(25px);
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
