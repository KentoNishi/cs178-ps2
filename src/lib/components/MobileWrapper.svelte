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
  }
  .mobile {
    width: 360px;
    height: 634px;
    background-color: red;
  }
</style>
