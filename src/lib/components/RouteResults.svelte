<script lang="ts">
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	import getDistance from 'gps-distance';
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	import kmToMi from 'km-to-mi';
	import RouteEntry from './RouteEntry.svelte';
	import { getPaths, timeToWalk } from '$lib/ts/navigation';
	import type { GPS, TickWithPosition } from '$lib/ts/types';

	let walkOption: {
		walkingTime: number,
		distance: number
	} | null = null;

	const getResults = async (start: GPS, end: GPS) => {
		// const start = {
		// 	lat: 42.368761836300095, 
		// 	lon: -71.11521053159292
		// };
		// const end = {
		// 	lat: 42.36348667132956,
		// 	lon: -71.12602311114634
		// };
		const date = new Date(); // new Date('Wed Mar 13 2024 9:00:00 GMT-0400 (Eastern Daylight Time)');
		console.log('Navigating from', start, '(Mather) to', end, '(SEC) at', date);
		const foundPaths = await getPaths(
			start,
			end,
			date.getTime()
		);
		walkOption = {
			walkingTime: timeToWalk(start, end),
			distance: kmToMi(getDistance(start.lat, start.lon, end.lat, end.lon))
		};
		return foundPaths;
	};
	let displayedResults: ({
		ticks: TickWithPosition[],
		busLocation: number,
		busName: string
	})[] = [];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export const navigate = async (details: any) => {
		const paths = await getResults(details.detail.originLocation, details.detail.destinationLocation);
		paths.forEach(path => {
			console.log(path, `walk ${path.walkingTimeToStartStop} minutes. get on at ${path.start.stopInfo.stop_name} between ${
				new Date(path.uncertainty.departureLowEnd).toLocaleTimeString()
			} and ${
				new Date(path.uncertainty.departureHighEnd).toLocaleTimeString()
			}. ride ${path.route.route_long_name} to ${path.end.stopInfo.stop_name}. get off between ${
				new Date(path.uncertainty.arrivalLowEnd).toLocaleTimeString()
			} and ${
				new Date(path.uncertainty.arrivalHighEnd).toLocaleTimeString()
			}. walk ${path.walkingTimeFromEndStop} minutes. total time ${path.tripDuration} minutes.`);
		});
		let earliestTripStart = Infinity;
		let latestTripEnd = -Infinity;
		paths.forEach(path => {
			earliestTripStart = Math.min(
				// path.tripStartTime - path.walkingTimeToStartStop,
				// path.tripStartTime,
				Math.max(
					path.uncertainty.departureLowEnd - 30 * 60 * 1000,
					(Date.now() - Math.max(0, path.realtime.expectedArrivalAtStartStop - Date.now()))
				),
				earliestTripStart,
			);
			latestTripEnd = Math.max(
				// path.tripEndTime,
				Math.min(
					path.busDestinationArrivalTime,
					(Date.now() + 30 * 60 * 1000)
				),
				latestTripEnd
			);
		});
		displayedResults = paths.map(path => ({
			ticks: [{
				...path.start.stopInfo,
				position: (path.uncertainty.departureLowEnd - earliestTripStart) / (latestTripEnd - earliestTripStart),
				uncertainty: path.uncertainty
			}, {
				...path.end.stopInfo,
				position: (path.uncertainty.arrivalHighEnd - earliestTripStart) / (latestTripEnd - earliestTripStart),
				uncertainty: path.uncertainty
			}],
			busLocation: (
				(Date.now() - Math.max(0, path.realtime.expectedArrivalAtStartStop - Date.now())) - earliestTripStart) / (latestTripEnd - earliestTripStart),
			busName: path.route.route_long_name
		}));
	};
</script>

<div class="outer-wrapper">
	<div class="container">
		{#if walkOption}
			<div class="walk-time">
				{Math.round(walkOption.walkingTime)} min. walk ({Math.round(walkOption.distance * 100) / 100}mi)
			</div>
			<div class="line" />
			{#if displayedResults.length == 0}
				<div style="margin-top: 10px; font-size: 0.9rem;">No Shuttles Found</div>
			{/if}
			{#each displayedResults as entry}
				<RouteEntry {...entry} />
				<div class="line" />
			{/each}
		{:else}
			<div class="line" />
		{/if}
	</div>
</div>

<style>
	.line {
		width: 100%;
		height: 1px;
		background-color: rgb(108, 108, 108);
	}
	.outer-wrapper {
		margin: 10px;
	}
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		--container-width: calc(100%);
		width: var(--container-width);
		margin-left: calc((100% - var(--container-width)) / 2);
		user-select: none;
	}
	.walk-time {
		margin-bottom: 10px;
		background-color: #4a4a4a;
		padding: 5px 7.5px 5px 7.5px;
		border-radius: 200px;
		font-size: 0.8rem;
	}
</style>
