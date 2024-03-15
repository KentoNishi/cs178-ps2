<script lang="ts">
  import SearchBar from "$lib/components/SearchBar.svelte";
  import RouteViewer from "$lib/components/RouteResults.svelte";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let navigate: any;
</script>

<SearchBar on:search={navigate} />
<RouteViewer bind:navigate={navigate} />
