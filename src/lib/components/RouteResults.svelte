<script lang="ts">
	import { routeInfos } from '$lib/ts/data';
	import { findPaths, timeToWalk } from '$lib/ts/navigation';
	import { onMount } from 'svelte';

	const tryNavigation = () => {
		const start = {
			lat: 42.368761836300095, 
			lon: -71.11521053159292
		};
		const end = {
			lat: 42.36348667132956,
			lon: -71.12602311114634
		};
		const date = new Date(); // new Date('Wed Mar 13 2024 9:10:00 GMT-0400 (Eastern Daylight Time)');
		console.log('Navigating from', start, '(Mather) to', end, '(SEC) at', date);
		const foundPaths = findPaths(
			start,
			end,
			date.getTime(),
			3
		);
		return foundPaths;
	};
	onMount(() => {
		const paths = tryNavigation();
		paths.forEach(path => {
    	console.log(path, `WALK ${path.walkingTimeToStartStop} MINUTES. GET ON AT ${path.start.stopInfo.stop_name} AT ${new Date(path.busOriginDepartureTime).toLocaleTimeString()}. RIDE ${path.route.route_long_name} TO ${path.end.stopInfo.stop_name}. GET OFF AT ${new Date(path.busDestinationArrivalTime).toLocaleTimeString()}. WALK ${path.walkingTimeFromEndStop} MINUTES. TOTAL TRIP TIME ${path.tripDuration} MINUTES.`);
  	});
	})
	// console.log(routeInfos);
</script>

<div class="outer-wrapper">
	<div style="font-size: 1.75rem; font-weight: bold;">
		Shuttle Options
	</div>
	<div class="container">
		<!-- <RouteEntry
			stops={[
				{
					...stopInfo[StopEnum.SEC],
					position: 0.1
				},
				{
					...stopInfo[StopEnum.BARRYS_CORNER_NORTHBOUND],
					position: 0.3
				},
				{
					...stopInfo[StopEnum.SEVER_GATE],
					position: 1
				}
			]}
			busLocation={0.3}
			busName={'SEC Express'}
		/>
		<RouteEntry
			stops={[
				{
					...stopInfo[StopEnum.SEC],
					position: 0.2
				},
				{
					...stopInfo[StopEnum.BARRYS_CORNER_NORTHBOUND],
					position: 0.4
				},
				{
					...stopInfo[StopEnum.SEVER_GATE],
					position: 1
				}
			]}
			busLocation={0.0}
			busName={'QYE'}
		/> -->
	</div>
</div>

<style>
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
