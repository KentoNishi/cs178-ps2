<script lang="ts">
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	import getDistance from 'gps-distance';
	import type { GPS } from '$lib/ts/types';
	import IconButton from '@smui/icon-button';
	import Textfield from '@smui/textfield';
	import { createEventDispatcher } from 'svelte';
	let originLocationName = '';
	let destinationLocationName = '';
	let originLocation: GPS = { lat: 0, lon: 0 };
	let destinationLocation: GPS = { lat: 0, lon: 0 };
	let modifiedOrigin = false;
	let modifiedDestination = false;
	let validOrigin = false;
	let validDestination = false;
	// https://nominatim.openstreetmap.org/search?format=json&q=
	const getLocation = async (locationName: string) => {
		const response = await fetch(
			`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
				`${locationName} 02138`
			)}`
		);
		const data = await response.json();
		// find item with lat and lon
		let item = data.find((item: { lat: string; lon: string }) => item.lat && item.lon);
		// find closest in gps coordinates
		// let minDistance = Infinity;
		// for (const location of data) {
		//   if (getDistance(42.37359113164303, -71.11893583086075, parseFloat(location.lat), parseFloat(location.lon)) < minDistance) {
		//     minDistance = getDistance(42.37359113164303, -71.11893583086075, parseFloat(location.lat), parseFloat(location.lon));
		//     item = location;
		//   }
		//   console.log(location);
		// }
		return { lat: parseFloat(item.lat), lon: parseFloat(item.lon), name: item.display_name };
	};
	const searchOrigin = () =>
		getLocation(originLocationName).then((location) => {
			originLocation = { lat: location.lat, lon: location.lon };
			originLocationName = location.name;
			modifiedOrigin = false;
			validOrigin = true;
			const input = destinationInput.querySelector('input');
			if (input) input.focus();
		});
	const searchDestination = () =>
		getLocation(destinationLocationName).then((location) => {
			destinationLocation = { lat: location.lat, lon: location.lon };
			destinationLocationName = location.name;
			modifiedDestination = false;
			validDestination = true;
		});
	const dispatch = createEventDispatcher();
	$: if (validOrigin && validOrigin && validDestination) {
		dispatch('search', { originLocation, destinationLocation });
	}
	let originInput: HTMLElement;
	let destinationInput: HTMLElement;

	$: if (originInput) {
		setTimeout(() => {
			const input = originInput.querySelector('input');
			if (input) input.placeholder = 'Origin';
		}, 0);
	}
	$: if (destinationInput) {
		setTimeout(() => {
			const input = destinationInput.querySelector('input');
			if (input) input.placeholder = 'Destination';
		}, 0);
	}
	const keyDown = ((event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			if (event.target === originInput.querySelector('input')) searchOrigin();
			if (event.target === destinationInput.querySelector('input')) searchDestination();
		}
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	}) as any;
</script>

<div class="area">
	<div class="inputs">
		<div class="aligned" bind:this={originInput}>
			<Textfield
				variant="outlined"
				class="text-input-location"
				bind:value={originLocationName}
				on:input={() => {
					modifiedOrigin = true;
					validOrigin = false;
				}}
				on:keydown={keyDown}
			/>
			{#if modifiedOrigin}
				<IconButton class="material-icons search" size="mini" on:click={searchOrigin}
					>search</IconButton
				>
			{/if}
		</div>
		<div class="aligned" bind:this={destinationInput}>
			<Textfield
				variant="outlined"
				class="text-input-location"
				bind:value={destinationLocationName}
				on:input={() => {
					modifiedDestination = true;
					validDestination = false;
				}}
				on:keydown={keyDown}
			/>
			{#if modifiedDestination}
				<IconButton class="material-icons search" size="mini" on:click={searchDestination}
					>search</IconButton
				>
			{/if}
		</div>
	</div>
</div>

<style>
	.aligned {
		display: flex;
		align-items: center;
		margin-bottom: 10px;
		position: relative;
	}
	:global(.search) {
		border-radius: 100%;
		position: absolute;
		right: 0px;
	}
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
		background-color: white;
		border-radius: 4px;
		width: 100%;
	}
	:global(.text-input-location > *) {
		font-size: 0.9em;
	}
</style>
