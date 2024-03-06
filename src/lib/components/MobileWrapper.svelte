<script lang="ts">
</script>

<div class="wrapper">
  <div class="mobile">
    <slot />
  </div>
</div>

<style>
  .wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
  }
  :global(body) {
    margin: 0;
    padding: 0;
  }
  .mobile {
    width: 360px;
    height: 634px;
    border: 5px solid black;
  }
</style>
