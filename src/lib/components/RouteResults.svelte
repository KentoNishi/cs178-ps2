<script lang="ts">
	import { routeInfos } from '$lib/ts/data';
	import { findPaths } from '$lib/ts/navigation';
	import { onMount } from 'svelte';

	const tryNavigation = () => {
		console.log(findPaths({
			lat: 42.36797754163142,
			lon: -71.11484132044114
		}, {
			lat: 42.362977,
			lon: -71.127055
		}, new Date('Wed Mar 13 2024 09:00:00 GMT-0400 (Eastern Daylight Time)').getTime()))
	};
	onMount(() => {
		window.tryNavigation = tryNavigation;
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
