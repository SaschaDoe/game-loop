<script lang="ts">
	import { onMount } from 'svelte';
	import { createGame, handleInput, renderColored } from '$lib/game/engine';
	import type { GameState } from '$lib/game/types';

	let state: GameState = $state(createGame());
	let grid = $derived(renderColored(state));

	function onKeyDown(e: KeyboardEvent) {
		const key = e.key;
		if (['w', 'a', 's', 'd', 'r', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
			e.preventDefault();
			state = handleInput(state, key);
		}
	}

	onMount(() => {
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	});
</script>

<svelte:head>
	<title>ASCII RPG</title>
</svelte:head>

<div class="game-container">
	<div class="hud">
		<span class="hp">HP: {state.player.hp}/{state.player.maxHp}</span>
		<span class="atk">ATK: {state.player.attack}</span>
		<span class="level">Level: {state.level}</span>
	</div>
	<pre class="map">{#each grid as row, y}{#each row as cell}<span style="color:{cell.color}">{cell.char}</span>{/each}{#if y < grid.length - 1}
{/if}{/each}</pre>
	<div class="messages">
		{#each state.messages as msg}
			<div class="msg">{msg}</div>
		{/each}
	</div>
	<div class="legend">
		<span><span style="color:#ff0">@</span> You</span>
		<span><span style="color:#666">.</span> Floor</span>
		<span><span style="color:#444">#</span> Wall</span>
		<span><span style="color:#f0f">*</span> Potion</span>
		<span><span style="color:#ff0">&gt;</span> Stairs</span>
		<span>WASD/Arrows to move | Bump to attack | R to restart</span>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		background: #111;
		color: #ccc;
		font-family: 'Courier New', monospace;
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
	}

	.game-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}

	.hud {
		display: flex;
		gap: 24px;
		font-size: 16px;
		font-weight: bold;
	}

	.hp {
		color: #f44;
	}

	.atk {
		color: #fa0;
	}

	.level {
		color: #4af;
	}

	.map {
		margin: 0;
		font-size: 16px;
		line-height: 1.15;
		letter-spacing: 2px;
		border: 1px solid #333;
		padding: 8px;
		background: #0a0a0a;
	}

	.messages {
		width: 100%;
		max-width: 600px;
		min-height: 80px;
	}

	.msg {
		color: #aaa;
		font-size: 13px;
		padding: 1px 0;
	}

	.legend {
		display: flex;
		gap: 16px;
		font-size: 12px;
		color: #666;
		flex-wrap: wrap;
		justify-content: center;
	}
</style>
