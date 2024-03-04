<script lang="ts">
	import type { StopWithPosition } from "$lib/ts/types";

  export let stops: StopWithPosition[];
  export let busLocation = 0;
</script>

<div class="container">
  <svg width="100%" height="100">
    <!-- Route Line -->
    <line x1="10" y1="50" x2="390" y2="50" class="route-line" />

    <!-- Stops -->
    {#each stops as stop}
    <circle cx="{10 + stop.position * 380}" cy="50" r="5" class="stop-dot" />
    <text x="{16 + stop.position * 380}" y="65" class="stop-name">{stop.stop_name}</text>
    {/each}

    <!-- Bus Icon (we could use png) -->
    <text x="{10 + busLocation * 380}" y="40" class="bus-icon">&#128652;</text>
  </svg>
</div>

<style>
  .route-line {
    stroke: black;
    stroke-width: 2;
  }

  .stop-dot {
    fill: red;
  }

  .stop-name {
    font-size: 12px;
    text-anchor: middle;
  }

  .bus-icon {
    font-size: 24px;
  }

  .container {
    margin-left: 10px;
  }
</style>
