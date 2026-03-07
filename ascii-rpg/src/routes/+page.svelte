<script lang="ts">
	import { onMount } from 'svelte';
	import { createGame, handleInput, renderColored, xpForLevel } from '$lib/game/engine';
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
		<span class="level">Dungeon: {state.level}</span>
		<span class="char-level">Lv {state.characterLevel}</span>
		{#each state.player.statusEffects as effect}
			<span class="status-effect status-{effect.type}">{effect.type} ({effect.duration})</span>
		{/each}
	</div>
	<div class="xp-bar-container">
		<div class="xp-bar" style="width:{state.characterLevel >= 50 ? 100 : (state.xp / xpForLevel(state.characterLevel + 1)) * 100}%"></div>
		<span class="xp-text">{state.characterLevel >= 50 ? 'MAX' : `${state.xp}/${xpForLevel(state.characterLevel + 1)} XP`}</span>
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

	.char-level {
		color: #af4;
	}

	.status-effect {
		font-size: 12px;
		padding: 1px 4px;
		border-radius: 2px;
	}

	.status-poison {
		color: #0f0;
		border: 1px solid #0f0;
	}

	.status-stun {
		color: #ff0;
		border: 1px solid #ff0;
	}

	.status-regeneration {
		color: #0fa;
		border: 1px solid #0fa;
	}

	.xp-bar-container {
		position: relative;
		width: 100%;
		max-width: 600px;
		height: 14px;
		background: #222;
		border: 1px solid #444;
		border-radius: 2px;
		overflow: hidden;
	}

	.xp-bar {
		height: 100%;
		background: #af4;
		transition: width 0.3s ease;
	}

	.xp-text {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		text-align: center;
		font-size: 10px;
		line-height: 14px;
		color: #fff;
		text-shadow: 0 0 2px #000;
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
