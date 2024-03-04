<script lang="ts">
  import { StopEnum, getStopByEnum } from '$lib/ts/stops';
  import BusDetail from './BusDetail.svelte';

</script>

<div class="container">
  <BusDetail stops={[{
    ...getStopByEnum(StopEnum.SEC),
    position: 0.1
  }, {
    ...getStopByEnum(StopEnum.BARRYS_CORNER_NORTHBOUND),
    position: 0.3
  }, {
    ...getStopByEnum(StopEnum.SEVER_GATE),
    position: 1
  },]} />
</div>
