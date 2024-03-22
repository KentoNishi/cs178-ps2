<script lang="ts">
	import type { TickWithPosition } from '$lib/ts/types';
	import Ripple from '@smui/ripple';
	import busImg from '../assets/bus.svg';
	import RouteDetail from './RouteDetail.svelte';
	import { createRange, getETA, getETABounds, getEstimate } from '$lib/ts/utils';

	export let ticks: TickWithPosition[];
	export let busLocation = 0;
	export let busName = '';
	export let tripDuration = 0;
	export let walkTimes: {
		walkingTimeToStartStop: number;
		walkingTimeFromEndStop: number;
	} = { walkingTimeToStartStop: 0, walkingTimeFromEndStop: 0 };

	let isShow = false;

	function toggleFullscreen() {
		isShow = !isShow;
	}

	const etaBounds = getETABounds(ticks, walkTimes.walkingTimeFromEndStop);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="card"
	use:Ripple={{ surface: true, color: 'secondary' }}
	tabindex="0"
	role="button"
	on:click={toggleFullscreen}
>
	{#if isShow}
		<RouteDetail {ticks} {busLocation} {busName} {tripDuration} {walkTimes} />
	{:else}
		<div class="container">
			<div class="bus-name">{busName}</div>
			<div class="bus-desc">{getETA(ticks[1].uncertainty)}</div>
			<div class="eta">ETA: {createRange(etaBounds)}</div>
			<div class="dropdown">+</div>
			<!-- Horizontal Route Line -->
			<div class="route"></div>
			<div
				class="green-bar bar left-round"
				style="
					left: calc(5% + {90 * ticks[0].position}%);
					width: calc({90 * (ticks[1].position - ticks[0].position)}%);
				"
			/>
			{#each ticks as tick, index}
				{#if [1, 2].includes(index)}
					<div class="stop" style="left: calc(5% + {90 * tick.position}%);">
						<div class="stop-circle" />
						<span class="time-label">{getEstimate(tick, index)}</span>
						<span class="stop-label">{tick.stop_name}</span>
					</div>
				{/if}
			{/each}
			<div
				class="orange-bar bar"
				style="
			left: calc(5% + {90 * ticks[1].position}%);
			width: calc({90 * (ticks[2].position - ticks[1].position)}%);
		"
			>
				<div class="right-arrow" />
			</div>
			<div
				class="green-bar bar right-round"
				style="
					left: calc(5% + {90 * ticks[ticks.length - 2].position}%);
					width: calc({90 * (ticks[ticks.length - 1].position - ticks[ticks.length - 2].position)}%);
				"
			/>
			<div class="bus-icon-wrapper" style="left: calc(5% + {90 * busLocation}%);">
				<img src={busImg} alt="bus" class="bus-icon" />
			</div>
		</div>
	{/if}
</div>

<style>
	.bar {
		height: 5px;
		position: absolute;
		transform: translateY(-100%);
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.left-round {
		border-top-left-radius: 10px;
		border-bottom-left-radius: 10px;
	}
	.right-round {
		border-top-right-radius: 10px;
		border-bottom-right-radius: 10px;
	}
	.orange-bar {
		background-color: #ff3e00;
	}
	.green-bar {
		background-color: var(--passio-green);
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
		height: auto;
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

	.eta {
		position: absolute;
		right: 35px;
		top: -75px;
		color: rgb(212, 212, 212);
		font-size: 0.8rem;
	}

	.dropdown {
		position: absolute;
		right: -10px;
		top: -82px;
		color: rgb(212, 212, 212);
		font-size: 1.5rem;
	}

	.route {
		position: relative;
		width: 100%;
		height: var(--route-size);
		background-color: black;
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
		width: 60px;
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
		color: rgb(212, 212, 212);
		z-index: 1000;
		white-space: nowrap;
	}

	.bus-icon {
		filter: invert(1) brightness(1);
		width: 40px;
		height: 40px;
		font-size: 40px;
	}
	.bus-icon-wrapper {
		background-color: var(--dark-bg);
		opacity: 0.7;
		position: absolute;
		user-select: none;
		transform: translate(-50%, calc(-3px - 50%));
		height: 24px;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
		z-index: 10000;
	}
</style>
