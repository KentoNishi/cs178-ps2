<script lang="ts">
	import { getPaths } from '$lib/ts/navigation';
	import { onMount } from 'svelte';

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
