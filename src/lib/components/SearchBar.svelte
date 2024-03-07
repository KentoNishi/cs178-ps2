<script lang="ts">
	import Textfield from "@smui/textfield";
</script>

<div class="area">
  <div class="inputs">
    <Textfield variant="outlined" value='Current Location' class="text-input-location" />
    <Textfield variant="outlined" value='Destination' class="text-input-location" />
  </div>
</div>

<style>
  .area {
    height: 20%;
    width: 100%;
    background-color: var(--passio-green);
  }
  .inputs {
    padding: 20px;
  }
  :global(.text-input-location) {
    height: 40px;
    background-color: var(--dark-bg);
    border-radius: 4px;
    margin-bottom: 10px;
  }
  :global(.text-input-location > *) {
    font-size: 0.9em;
  }
</style>