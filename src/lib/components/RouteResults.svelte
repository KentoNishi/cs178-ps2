<script lang="ts">
	import { StopEnum, stopInfo } from '$lib/ts/stops';
	import BusDetail from './RouteEntry.svelte';
</script>

<div>
	<BusDetail
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
	/>
	<BusDetail
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
	/>
</div>
