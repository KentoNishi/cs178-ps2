<script lang="ts">
	import RouteEntry from './RouteEntry.svelte';
	import { getPaths } from '$lib/ts/navigation';
	import { onMount } from 'svelte';
	import type { TickWithPosition } from '$lib/ts/types';

	const tryNavigation = async () => {
		const start = {
			lat: 42.368761836300095, 
			lon: -71.11521053159292
		};
		const end = {
			lat: 42.36348667132956,
			lon: -71.12602311114634
		};
		const date = new Date(); // new Date('Wed Mar 13 2024 9:00:00 GMT-0400 (Eastern Daylight Time)');
		console.log('Navigating from', start, '(Mather) to', end, '(SEC) at', date);
		const foundPaths = await getPaths(
			start,
			end,
			date.getTime()
		);
		return foundPaths;
	};
	let displayedResults: ({
		ticks: TickWithPosition[],
		busLocation: number,
		busName: string
	})[] = [];
	let sharedParams: ({
		earliestTripStart: number,
		latestTripEnd: number
	})
	onMount(async () => {
		const paths = await tryNavigation();
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
				path.tripStartTime - path.walkingTimeToStartStop,
				path.uncertainty.departureLowEnd - path.walkingTimeToStartStop,
				Date.now() - (path.realtime.expectedArrivalAtEndStop - Date.now()),
				earliestTripStart,
			);
			latestTripEnd = Math.max(
				path.tripEndTime + path.walkingTimeFromEndStop,
				path.uncertainty.arrivalHighEnd + path.walkingTimeFromEndStop,
				latestTripEnd
			);
		});
		displayedResults = paths.map(path => ({
			ticks: [{
				...path.start.stopInfo,
				position: (path.tripStartTime - earliestTripStart) / (latestTripEnd - earliestTripStart)
			}, {
				...path.end.stopInfo,
				position: (path.tripEndTime - earliestTripStart) / (latestTripEnd - earliestTripStart)
			}],
			busLocation: ((Date.now() - (path.realtime.expectedArrivalAtEndStop - Date.now())) - earliestTripStart) / (latestTripEnd - earliestTripStart),
			busName: path.route.route_long_name
		}));
		sharedParams = {
			earliestTripStart,
			latestTripEnd
		};
	});
</script>

<div class="outer-wrapper">
	<div style="font-size: 1.5rem; font-weight: bold; padding-bottom: 8px;">
		Shuttle Options
	</div>
	<div class="container">
		<div class="line" />
		{#each displayedResults as entry}
			<RouteEntry {...entry} {...sharedParams} />
			<div class="line" />
		{/each}
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
	}
</style>
