<script lang="ts">
	import type { TickWithPosition } from '$lib/ts/types';
	import busImg from '../assets/bus.svg';
	import { getETA, getETABounds, getEstimate } from '$lib/ts/utils';

	export let ticks: TickWithPosition[];
	export let busLocation = 0;
	export let busName = '';
	export let tripDuration = 0;
	export let walkTimes: {
		walkingTimeToStartStop: number;
		walkingTimeFromEndStop: number;
	} = { walkingTimeToStartStop: 0, walkingTimeFromEndStop: 0 };

	const etaBounds = getETABounds(ticks, walkTimes.walkingTimeFromEndStop);
</script>

<div class="full-screen">
	<div class="container">
		<div class="bus-name">{busName}</div>
		<div class="bus-desc">{getETA(ticks[1].uncertainty)}</div>
		<div class="dropdown">-</div>
		<div class="trip-details">
			<div style="color: var(--passio-green);">Walking Time</div>
			<div class="walk-time">
				To boarding stop: {Math.round(walkTimes.walkingTimeToStartStop)} min.
				<br />
				After disembarking: {Math.round(walkTimes.walkingTimeFromEndStop)} min.
			</div>
			<br />
			<div style="color: #ff3e00;">Riding Time</div>
			<div class="ride-time">
				{Math.round(tripDuration)} min.
			</div>
			<br />
			<div class="eta">ETA: {etaBounds.timeLowerBound}–{etaBounds.timeHigherBound}</div>
		</div>
		<!-- Vertical Route Line -->
		<div class="route"></div>
		<div
			class="green-bar bar top-round"
			style="
				top: calc(5% + {90 * ticks[0].position}%);
				height: calc({90 * (ticks[1].position - ticks[0].position)}%);
			"
		/>
		{#each ticks as tick, index}
			{#if [1, 2].includes(index)}
				<div class="stop" style="top: calc(5% + {90 * tick.position}%);">
					<div class="stop-circle"></div>
					<div class="stop-label-container">
						<span class="stop-label">{tick.stop_name}</span><span class="time-label"
							>{getEstimate(tick, index)}</span
						>
					</div>
				</div>
			{/if}
		{/each}
		<div
			class="bar orange-bar"
			style="
            top: calc(5% + {90 * ticks[1].position}%);
            height: calc({90 * (ticks[2].position - ticks[1].position)}%);
        "
		>
			<div class="down-arrow" />
		</div>
		<div
			class="green-bar bar bottom-round"
			style="
				top: calc(5% + {90 * ticks[ticks.length - 2].position}%);
				height: calc({90 * (ticks[ticks.length - 1].position - ticks[ticks.length - 2].position)}%);
			"
		/>
		<div class="bus-icon-wrapper" style="top: calc(5% + {90 * busLocation}%);">
			<img src={busImg} alt="bus" class="bus-icon" />
		</div>
	</div>
</div>

<style>
	.bus-name {
		position: absolute;
		font-size: 1rem;
		transform: translate(0px, -60px);
		color: white;
	}

	.bus-desc {
		position: absolute;
		transform: translate(1px, -40px);
		color: rgb(212, 212, 212);
		font-size: 0.8rem;
	}

	.dropdown {
		position: absolute;
		right: 10px;
		top: -5px;
		color: rgb(212, 212, 212);
		font-size: 2.5rem;
	}

	.trip-details {
		position: absolute;
		top: 140px;
		transform: translate(1px, calc(-46px - 10px));
		color: rgb(212, 212, 212);
		font-size: 1rem;
	}

	.walk-time {
		color: rgb(212, 212, 212);
		font-size: 0.8rem;
	}

	.ride-time {
		color: rgb(212, 212, 212);
		font-size: 0.8rem;
	}

	.eta {
		color: rgb(212, 212, 212);
		font-size: 1rem;
	}

	.route {
		position: absolute;
		left: 10%;
		top: 5%;
		height: 90%;
		width: 5px;
		background-color: black;
		transform: translateX(-50%);
		border-radius: 2.5px;
	}
	.top-round {
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}
	.bottom-round {
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;
	}
	.orange-bar {
		background-color: #ff3e00;
		border-radius: 2.5px;
	}
	.green-bar {
		background-color: var(--passio-green);
	}

	.bar {
		position: absolute;
		left: 10%;
		transform: translateX(-50%);
		width: 5px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.stop {
		position: absolute;
		left: 10%;
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
		border: var(--border-size) solid rgb(132, 132, 132);
		border-radius: 50%;
		z-index: 9000;
	}

	.time-label {
		font-size: 0.7rem;
		position: absolute;
		white-space: nowrap;
		color: rgb(212, 212, 212);
		transform: translateY(calc(0.7rem + 5px));
		white-space: nowrap;
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
		left: 10%;
		user-select: none;
		transform: translate(-60%, calc(3px - 50%));
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
		transform: rotate(90deg);
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
	}
</style>
