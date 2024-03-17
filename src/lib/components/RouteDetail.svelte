<script lang="ts">
	import type { TickWithPosition } from '$lib/ts/types';
	import Ripple from '@smui/ripple';
	import busImg from '../assets/bus.svg';

	export let ticks: TickWithPosition[];
	export let busLocation = 0;
	export let busName = '';
	export let isShow = false;

	const formatDate = (date: number) => {
		const d = new Date(date);
		// hour:minute, 12 hour, no zeros, no am/pm, no seconds
		return d
			.toLocaleTimeString('en-US', {
				hour: 'numeric',
				minute: 'numeric',
				hour12: true,
				hourCycle: 'h23'
			})
			.slice(0, -3);
	};

	const getEstimate = (tick: TickWithPosition, index: number) => {
		if (index == 0) {
			const f1 = formatDate(tick.uncertainty.departureLowEnd);
			const f2 = formatDate(tick.uncertainty.departureHighEnd);
			if (f1 == f2) return f1;
			return `${f1}–${f2}`;
		}
		const f1 = formatDate(tick.uncertainty.arrivalLowEnd);
		const f2 = formatDate(tick.uncertainty.arrivalHighEnd);
		if (f1 == f2) return f1;
		return `${f1}–${f2}`;
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
		return `in ${depHighMinutes} minutes`;
	};
</script>

<div class="full-screen">
	<div class="container">
		<div class="bus-name">{busName}</div>
		<div class="bus-desc">{getETA(ticks[0].uncertainty)}</div>
		<!-- Vertical Route Line -->
		<div class="route"></div>
		{#each ticks as tick, index}
			<div class="stop" style="top: calc(5% + {90 * tick.position}%);">
				<div class="stop-circle"></div>
				<div class="stop-label-container">
					<span class="stop-label">{tick.stop_name}</span><span class="time-label"
						>{getEstimate(tick, index)}</span
					>
				</div>
			</div>
		{/each}
		<div
			class="orange-bar"
			style="
            top: calc(5% + {90 * ticks[0].position}%);
            height: calc({90 * (ticks[ticks.length - 1].position - ticks[0].position)}%);
        "
		>
			<div class="down-arrow" />
		</div>
		<div class="bus-icon-wrapper" style="top: calc(5% + {90 * busLocation}%);">
			<img src={busImg} alt="bus" class="bus-icon" />
		</div>
	</div>
</div>

<style>
	.bus-name {
		position: absolute;
		font-size: medium;
		transform: translate(0px, calc(-70px - 10px));
		color: white;
		font-size: 1.2rem;
	}

	.bus-desc {
		position: absolute;
		transform: translate(5px, calc(-46px - 10px));
		color: rgb(212, 212, 212);
		font-size: 0.8rem;
	}

	.route {
		position: absolute;
		left: 20%;
		top: 5%;
		height: 90%;
		width: 5px;
		background-color: var(--passio-green);
		transform: translateX(-50%);
		border-radius: 2.5px;
	}

	.orange-bar {
		position: absolute;
		left: 20%;
		transform: translateX(-50%);
		width: 5px;
		background-color: #ff3e00;
		border-radius: 2.5px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.stop {
		position: absolute;
		left: 20%;
		transform: translate(-50%, -50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		--inner-size: 10px;
		--border-size: 4px;
		--total-size: calc(var(--inner-size) + var(--border-size) * 2);
		z-index: 100;
	}

	.stop-circle {
		width: var(--inner-size);
		height: var(--inner-size);
		background-color: white;
		border: 4px solid crimson;
		border-radius: 50%;
		z-index: 9000;
	}

	.time-label {
		font-size: 0.7rem;
		position: absolute;
		white-space: nowrap;
		color: rgb(212, 212, 212);
		transform: translateY(calc(0.7rem + 5px));
	}

	.stop-label {
		font-size: 0.7rem;
		position: absolute;
		white-space: nowrap;
		color: rgb(212, 212, 212);
	}

	.stop-label-container {
		position: absolute;
		transform: translate(20px);
	}

	.bus-icon-wrapper {
		background-color: var(--dark-bg);
		opacity: 0.7;
		position: absolute;
		left: 20%;
		user-select: none;
		transform: translate(-150%, calc(-3px - 50%));
		width: 24px;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
		z-index: 10000;
	}

	.bus-icon {
		filter: invert(1) brightness(1);
		width: 40px;
		height: 40px;
		font-size: 40px;
		transform: scaleX(-1) rotate(90deg);
		-webkit-transform: scaleX(-1) rotate(90deg);
	}

	.container {
		height: 200px;
	}

	.down-arrow {
		width: 0;
		height: 0;
		border-top: 20px solid #ff3e00;
		border-right: 10px solid transparent;
		border-left: 10px solid transparent;
		position: absolute;
		transform: translateX(-5%);
	}
</style>
