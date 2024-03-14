<script lang="ts">
</script>

<div class="wrapper">
  <div class="device">
    <div class="notification-bar" />
    <div class="mobile">
      <slot />
    </div>
    <div class="home-bar" />
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
    background-color: rgb(50, 50, 50);
  }
  .mobile {
    height: 634px;
  }
  .device {
    width: 360px;
    border-top: 40px;
    border-bottom: 40px;
    border-left: 10px;
    border-right: 10px;
    border-color: black;
    border-style: solid;
    border-radius: 20px;
    background-color: var(--dark-bg);
  }
  .notification-bar {
    height: 20px;
    background-color: white;
  }
  .home-bar {
    height: 10px;
    background-color: white;
  }
</style>
