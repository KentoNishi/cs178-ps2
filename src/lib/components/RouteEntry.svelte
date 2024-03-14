<script lang="ts">
	import type { TickWithPosition } from '$lib/ts/types';
	import Ripple from '@smui/ripple';
	import busImg from '../assets/bus.svg';

	export let ticks: TickWithPosition[];
	export let busLocation = 0;
	export let busName = '';

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

	const getEstimate = (tick: TickWithPosition, index: number) => {
		if (index == 0) return `${formatDate(tick.uncertainty.departureLowEnd)}–${formatDate(tick.uncertainty.departureHighEnd)}`;
		return `${formatDate(tick.uncertainty.arrivalLowEnd)}–${formatDate(tick.uncertainty.arrivalHighEnd)}`;
	};

	const getETA = (uncertainty: TickWithPosition['uncertainty']) => {
		// "in X-XX minutes"
		const depLow = new Date(uncertainty.departureLowEnd);
		const depHigh = new Date(uncertainty.departureHighEnd);
		const now = new Date();
		const depLowDiff = Math.max(0, depLow.getTime() - now.getTime());
		const depHighDiff = Math.max(0, depHigh.getTime() - now.getTime());
		const depLowMinutes = Math.floor(depLowDiff / 60000);
		const depHighMinutes = Math.floor(depHighDiff / 60000);
		if (depLowMinutes != depHighMinutes) return `in ${depLowMinutes}–${depHighMinutes} minutes`;
		return `in ${depLowMinutes}–${depHighMinutes} minutes`;
	};
</script>

<div
	class="card"
	use:Ripple={{ surface: true, color: 'secondary' }}
	tabindex="0"
	role="button">
	<div class="container">
		<div class="bus-name">{busName}</div>
		<div class="bus-desc">{getETA(ticks[0].uncertainty)}</div>
		<!-- Horizontal Route Line -->
		<div class="route"></div>
		{#each ticks as tick, index}
			<div class="stop" style="left: calc(5% + {90 * tick.position}%);">
				<div class="stop-circle" />
				<span class="time-label">{getEstimate(tick, index)}</span>
				<span class="stop-label">{tick.stop_name}</span>
			</div>
		{/each}
		<div class="orange-bar" style="
			left: calc(5% + {90 * ticks[0].position}%);
			width: calc({90 * (ticks[ticks.length - 1].position - ticks[0].position)}%);
		">
			<div class="right-arrow" />
		</div>
		<div class="bus-icon-wrapper" style="left: calc(5% + {90 * busLocation}%);">
			<img src={busImg} alt="bus" class="bus-icon" />
		</div>
	</div>
</div>

<style>
	.orange-bar {
		background-color: #ff3e00;
		height: 5px;
		position: absolute;
		transform: translateY(-100%);
		display: flex;
    justify-content: center;
    align-items: center;
	}
	.right-arrow {
		width: 0;
		height: 0;
		border-top: 10px solid transparent;
		border-bottom: 10px solid transparent;
		border-left: 20px solid #ff3e00;
		position: absolute;
		transform: translateX(25%);
	}
	.card {
		padding-top: calc(78px + 10px);
		width: calc(100%);
		display: flex;
		justify-content: center;
		padding-bottom: 36px;
		user-select: none;
	}

	.container {
		position: relative;
		width: 90%;
		align-content: center;
		--route-size: 5px;
	}

	.bus-name {
		position: absolute;
		font-size: medium;
		transform: translate(-8px, calc(-70px - 10px));
		color: white;
		font-size: 1.2rem;
	}

	.bus-desc {
		position: absolute;
		transform: translate(-8px, calc(-46px - 10px));
		color: rgb(212, 212, 212);
		/* font-style: italic; */
		font-size: 0.8rem;
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
		font-size: 0.7rem;
		max-width: 50px;
		text-align: center;
		position: absolute;
		transform: translateY(-25px);
		color: rgb(212, 212, 212);
		height: 25px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
		z-index: 1000;
	}

	.time-label {
		position: absolute;
		font-size: 0.7rem;
		transform: translateY(20px);
		white-space: nowrap;
		color: rgb(212, 212, 212);
		z-index: 1000;
	}

	.bus-icon {
		filter: invert(0.9) brightness(0.9);
		width: 40px;
		height: 40px;
		font-size: 40px;
	}
	.bus-icon-wrapper {
		background-color: var(--dark-bg);
		position: absolute;
		user-select: none;
		transform: translate(-50%, calc(-3px - 50%));
		height: 24px;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
	}
</style>
