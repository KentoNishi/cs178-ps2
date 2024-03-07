<script>
  import MobileWrapper from "$lib/components/MobileWrapper.svelte";
  </script>
<div></div>

<MobileWrapper>
  <slot />
</MobileWrapper>

<style>
  :global(:root) {
    --passio-green: rgb(127, 185, 95);
    --dark-bg: rgb(37, 37, 37);
  }
</style>
