<script lang="ts">
	import { StopEnum, stopInfo } from '$lib/ts/stops';
	import RouteEntry from './RouteEntry.svelte';
</script>

<div class="container">
	<RouteEntry
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
	/>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		--container-width: calc(100% - 20px);
		width: var(--container-width);
		margin-left: calc((100% - var(--container-width)) / 2);
		margin-top: 50px;
	}
</style>
