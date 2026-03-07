<script lang="ts">
	import { onMount } from 'svelte';
	import { createGame, handleInput, renderColored, xpForLevel, CLASS_BONUSES } from '$lib/game/engine';
	import { ABILITY_DEFS } from '$lib/game/abilities';
	import type { GameState, CharacterClass, CharacterConfig, StartingLocation, Difficulty } from '$lib/game/types';
	import { STARTING_LOCATIONS } from '$lib/game/locations';
	import { DIFFICULTY_DEFS, DIFFICULTIES, isPermadeath } from '$lib/game/difficulty';
	import { deleteSave } from '$lib/game/save';

	declare const __APP_VERSION__: string;
	declare const __BUILD_NUMBER__: string;

	type GamePhase = 'intro' | 'creation' | 'playing';

	const INTRO_LINES = [
		'You stand before the entrance to the\nDungeon of Shadows.\n\nCold air rises from the depths below.',
		'A hooded figure emerges from the darkness.\n\n"Another brave soul, drawn to the depths..."',
		'"Many have entered seeking fortune and glory.\nFew have returned to tell the tale."',
		'"Before you descend, adventurer...\ntell me \u2014 who are you?"'
	];

	const CLASSES: CharacterClass[] = ['warrior', 'mage', 'rogue'];
	const CLASS_LABELS: Record<CharacterClass, string> = {
		warrior: 'WARRIOR',
		mage: 'MAGE',
		rogue: 'ROGUE'
	};
	const LOCATIONS: StartingLocation[] = ['village', 'tavern', 'cave'];

	let phase: GamePhase = $state('intro');
	let introStep = $state(0);
	let playerName = $state('');
	let selectedClass: CharacterClass = $state('warrior');
	let selectedLocation: StartingLocation = $state('village');
	let selectedDifficulty: Difficulty = $state('normal');
	let state: GameState = $state(createGame());
	let grid = $derived(renderColored(state));
	let nameInput: HTMLInputElement;

	function advanceIntro() {
		if (introStep < INTRO_LINES.length - 1) {
			introStep++;
		} else {
			phase = 'creation';
		}
	}

	function startGame() {
		const config: CharacterConfig = {
			name: playerName.trim() || 'Hero',
			characterClass: selectedClass,
			difficulty: selectedDifficulty,
			startingLocation: selectedLocation
		};
		state = createGame(config);
		phase = 'playing';
	}

	function sendInput(key: string) {
		const wasAlive = !state.gameOver;
		state = handleInput(state, key);
		// Delete save on permadeath
		if (wasAlive && state.gameOver && isPermadeath(state.characterConfig.difficulty)) {
			deleteSave();
		}
	}

	function onKeyDown(e: KeyboardEvent) {
		if (phase === 'intro') {
			if (e.key === ' ' || e.key === 'Enter') {
				e.preventDefault();
				advanceIntro();
			}
		} else if (phase === 'creation') {
			if (e.key === 'Enter') {
				e.preventDefault();
				startGame();
			}
			const isTyping = nameInput && document.activeElement === nameInput;
			if (!isTyping) {
				if (e.key === '1') selectedClass = 'warrior';
				else if (e.key === '2') selectedClass = 'mage';
				else if (e.key === '3') selectedClass = 'rogue';
			}
		} else if (phase === 'playing') {
			const key = e.key;
			if (['w', 'a', 's', 'd', 'q', 'r', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
				e.preventDefault();
				sendInput(key);
			}
		}
	}

	let touchHandled = false;
	function dpadTouch(key: string) {
		return (e: TouchEvent) => {
			e.preventDefault();
			touchHandled = true;
			sendInput(key);
		};
	}
	function dpadClick(key: string) {
		return () => {
			if (touchHandled) {
				touchHandled = false;
				return;
			}
			sendInput(key);
		};
	}

	onMount(() => {
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	});
</script>

<svelte:head>
	<title>Dungeon of Shadows - ASCII RPG</title>
</svelte:head>

{#if phase === 'intro'}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="screen intro-screen" onclick={advanceIntro}>
		<h1 class="game-title">DUNGEON OF SHADOWS</h1>
		<div class="intro-frame">
			<pre class="intro-art">       #####
      ##   ##
     ##     ##
     #  . . .#
     #  .   .#
     #  .   .#
     ####.####
         .</pre>
		</div>
		<p class="intro-text">{INTRO_LINES[introStep]}</p>
		<p class="intro-prompt">[ Press SPACE or tap to continue ]</p>
	</div>
{:else if phase === 'creation'}
	<div class="screen creation-screen">
		<h2 class="creation-title">WHO ARE YOU?</h2>

		<div class="name-section">
			<label for="char-name">Name</label>
			<input
				id="char-name"
				type="text"
				bind:value={playerName}
				bind:this={nameInput}
				placeholder="Hero"
				maxlength="16"
				class="name-input"
			/>
		</div>

		<p class="class-label">Choose your class:</p>
		<div class="class-grid">
			{#each CLASSES as cls, i}
				{@const bonuses = CLASS_BONUSES[cls]}
				<button
					class="class-card"
					class:selected={selectedClass === cls}
					onclick={() => (selectedClass = cls)}
				>
					<span class="class-key">[{i + 1}]</span>
					<span class="class-name">{CLASS_LABELS[cls]}</span>
					<span class="class-desc">{bonuses.description}</span>
					<span class="class-stats">
						HP {bonuses.hp >= 0 ? '+' : ''}{bonuses.hp} &middot;
						ATK {bonuses.atk >= 0 ? '+' : ''}{bonuses.atk} &middot;
						Sight {bonuses.sight >= 0 ? '+' : ''}{bonuses.sight}
					</span>
				</button>
			{/each}
		</div>

		<p class="class-label">Choose your starting location:</p>
		<div class="class-grid">
			{#each LOCATIONS as loc}
				{@const info = STARTING_LOCATIONS[loc]}
				<button
					class="class-card"
					class:selected={selectedLocation === loc}
					onclick={() => (selectedLocation = loc)}
				>
					<span class="class-name">{info.label}</span>
					<span class="class-desc">{info.description}</span>
					<span class="class-stats">{info.difficulty}</span>
				</button>
			{/each}
		</div>

		<p class="class-label">Difficulty:</p>
		<div class="class-grid">
			{#each DIFFICULTIES as diff}
				{@const info = DIFFICULTY_DEFS[diff]}
				<button
					class="class-card"
					class:selected={selectedDifficulty === diff}
					class:permadeath={diff === 'permadeath'}
					onclick={() => (selectedDifficulty = diff)}
				>
					<span class="class-name">{info.label}</span>
					<span class="class-desc">{info.description}</span>
				</button>
			{/each}
		</div>

		<button class="start-btn" onclick={startGame}>Begin Adventure</button>
		<p class="creation-hint">Press 1/2/3 to pick class &middot; ENTER to begin</p>
	</div>
{:else}
	<div class="game-container">
		<div class="hud">
			<span class="hp">HP: {state.player.hp}/{state.player.maxHp}</span>
			<span class="atk">ATK: {state.player.attack}</span>
			<span class="level">{state.level === 0 ? 'Starting Area' : `Dungeon: ${state.level}`}</span>
			<span class="char-level">Lv {state.characterLevel} {state.player.name}</span>
			{#if state.characterConfig.difficulty !== 'normal'}
				<span class="difficulty difficulty-{state.characterConfig.difficulty}">{DIFFICULTY_DEFS[state.characterConfig.difficulty].label}</span>
			{/if}
			{#each state.player.statusEffects as effect}
				<span class="status-effect status-{effect.type}">{effect.type} ({effect.duration})</span>
			{/each}
		</div>
		<div class="xp-bar-container">
			<div
				class="xp-bar"
				style="width:{state.characterLevel >= 50
					? 100
					: (state.xp / xpForLevel(state.characterLevel + 1)) * 100}%"
			></div>
			<span class="xp-text"
				>{state.characterLevel >= 50
					? 'MAX'
					: `${state.xp}/${xpForLevel(state.characterLevel + 1)} XP`}</span
			>
		</div>
		<pre class="map">{#each grid as row, y}{#each row as cell}<span style="color:{cell.color}">{cell.char}</span>{/each}{#if y < grid.length - 1}
{/if}{/each}</pre>
		<div class="messages">
			{#each state.messages as msg}
				<div class="msg msg-{msg.type}">{msg.text}</div>
			{/each}
		</div>
		<div class="legend">
			<span><span style="color:#ff0">@</span> {state.player.name}</span>
			<span><span style="color:#666">.</span> Floor</span>
			<span><span style="color:#444">#</span> Wall</span>
			<span><span style="color:#f0f">*</span> Potion</span>
			<span><span style="color:#ff0">&gt;</span> Stairs</span>
			<span><span style="color:#f44">^</span> Trap</span>
		</div>

		<div class="dpad">
			<div class="dpad-row">
				<button class="dpad-btn" ontouchstart={dpadTouch('w')} onclick={dpadClick('w')}>&#9650;</button>
			</div>
			<div class="dpad-row">
				<button class="dpad-btn" ontouchstart={dpadTouch('a')} onclick={dpadClick('a')}>&#9664;</button>
				<button class="dpad-btn" ontouchstart={dpadTouch('s')} onclick={dpadClick('s')}>&#9660;</button>
				<button class="dpad-btn" ontouchstart={dpadTouch('d')} onclick={dpadClick('d')}>&#9654;</button>
			</div>
			<div class="dpad-row">
				<button
					class="dpad-btn dpad-ability"
					class:on-cooldown={state.abilityCooldown > 0}
					ontouchstart={dpadTouch('q')}
					onclick={dpadClick('q')}
				>
					{ABILITY_DEFS[state.characterConfig.characterClass].name}
					{#if state.abilityCooldown > 0}({state.abilityCooldown}){/if}
				</button>
			</div>
			{#if state.gameOver}
				<div class="dpad-row">
					<button class="dpad-btn dpad-restart" ontouchstart={dpadTouch('r')} onclick={dpadClick('r')}>Restart</button>
				</div>
			{/if}
		</div>
	</div>
{/if}

<div class="version">v{__APP_VERSION__} #{__BUILD_NUMBER__}</div>

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
		-webkit-user-select: none;
		user-select: none;
	}

	/* ── Shared screens ── */
	.screen {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		padding: 24px;
		box-sizing: border-box;
		text-align: center;
	}

	/* ── Intro ── */
	.game-title {
		font-size: 28px;
		color: #c84;
		text-shadow: 0 0 12px #c84;
		letter-spacing: 6px;
		margin: 0 0 24px;
	}

	.intro-frame {
		margin-bottom: 32px;
	}

	.intro-art {
		font-size: 14px;
		line-height: 1.2;
		color: #555;
		margin: 0;
	}

	.intro-text {
		white-space: pre-line;
		font-size: 16px;
		line-height: 1.6;
		color: #ddd;
		max-width: 400px;
		min-height: 100px;
	}

	.intro-prompt {
		color: #666;
		font-size: 13px;
		animation: blink 1.5s step-end infinite;
	}

	@keyframes blink {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.3;
		}
	}

	/* ── Character Creation ── */
	.creation-title {
		font-size: 22px;
		color: #c84;
		letter-spacing: 4px;
		margin: 0 0 24px;
	}

	.name-section {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 24px;
	}

	.name-section label {
		color: #888;
		font-size: 14px;
	}

	.name-input {
		background: #1a1a1a;
		border: 1px solid #555;
		color: #ff0;
		font-family: 'Courier New', monospace;
		font-size: 16px;
		padding: 6px 10px;
		width: 200px;
		outline: none;
	}

	.name-input:focus {
		border-color: #c84;
	}

	.class-label {
		color: #888;
		font-size: 13px;
		margin: 0 0 12px;
	}

	.class-grid {
		display: flex;
		gap: 12px;
		margin-bottom: 24px;
		flex-wrap: wrap;
		justify-content: center;
	}

	.class-card {
		background: #1a1a1a;
		border: 1px solid #444;
		color: #ccc;
		font-family: 'Courier New', monospace;
		padding: 12px 16px;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		width: 180px;
		transition:
			border-color 0.2s,
			background 0.2s;
	}

	.class-card:hover {
		border-color: #888;
	}

	.class-card.selected {
		border-color: #c84;
		background: #221a10;
	}

	.class-key {
		color: #666;
		font-size: 11px;
	}

	.class-name {
		font-size: 16px;
		font-weight: bold;
		color: #c84;
		letter-spacing: 2px;
	}

	.class-desc {
		font-size: 11px;
		color: #888;
	}

	.class-stats {
		font-size: 12px;
		color: #af4;
	}

	.start-btn {
		background: #331a00;
		border: 1px solid #c84;
		color: #c84;
		font-family: 'Courier New', monospace;
		font-size: 16px;
		padding: 10px 32px;
		cursor: pointer;
		letter-spacing: 2px;
		transition:
			background 0.2s,
			color 0.2s;
	}

	.start-btn:hover {
		background: #c84;
		color: #111;
	}

	.creation-hint {
		color: #555;
		font-size: 11px;
		margin-top: 12px;
	}

	/* ── Game ── */
	.game-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		padding: 8px;
	}

	.hud {
		display: flex;
		gap: 16px;
		font-size: 14px;
		font-weight: bold;
		flex-wrap: wrap;
		justify-content: center;
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

	.difficulty {
		font-size: 12px;
		padding: 1px 6px;
		border-radius: 2px;
	}

	.difficulty-easy {
		color: #4f4;
		border: 1px solid #4f4;
	}

	.difficulty-hard {
		color: #fa4;
		border: 1px solid #fa4;
	}

	.difficulty-permadeath {
		color: #f44;
		border: 1px solid #f44;
	}

	.class-card.permadeath.selected {
		border-color: #f44;
		background: #221010;
	}

	.class-card.permadeath .class-name {
		color: #f44;
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
		min-height: 60px;
	}

	.msg {
		font-size: 13px;
		padding: 1px 0;
	}

	.msg-info {
		color: #aaa;
	}

	.msg-player_attack {
		color: #ff4;
	}

	.msg-damage_taken {
		color: #f44;
	}

	.msg-healing {
		color: #4f4;
	}

	.msg-level_up {
		color: #4ff;
		font-weight: bold;
	}

	.msg-discovery {
		color: #c8f;
	}

	.msg-death {
		color: #f00;
		font-weight: bold;
	}

	.msg-trap {
		color: #fa4;
	}

	.msg-npc {
		color: #8cf;
		font-style: italic;
	}

	.legend {
		display: flex;
		gap: 16px;
		font-size: 12px;
		color: #666;
		flex-wrap: wrap;
		justify-content: center;
	}

	/* ── D-Pad ── */
	.dpad {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		margin-top: 12px;
		touch-action: manipulation;
	}

	.dpad-row {
		display: flex;
		gap: 4px;
	}

	.dpad-btn {
		width: 54px;
		height: 54px;
		background: #222;
		border: 1px solid #555;
		color: #ccc;
		font-size: 22px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 6px;
		touch-action: manipulation;
		-webkit-user-select: none;
		user-select: none;
		font-family: 'Courier New', monospace;
	}

	.dpad-btn:active {
		background: #444;
		border-color: #c84;
		color: #c84;
	}

	.dpad-ability {
		width: auto;
		padding: 0 16px;
		font-size: 12px;
		color: #c84;
		border-color: #c84;
	}

	.dpad-ability.on-cooldown {
		color: #555;
		border-color: #333;
	}

	.dpad-ability:active {
		background: #321;
		border-color: #fa6;
	}

	.dpad-restart {
		width: auto;
		padding: 0 20px;
		font-size: 14px;
		color: #f44;
		border-color: #f44;
	}

	.dpad-restart:active {
		background: #422;
		border-color: #f66;
	}

	/* ── Version ── */
	.version {
		position: fixed;
		bottom: 6px;
		right: 10px;
		font-size: 10px;
		color: #333;
		font-family: 'Courier New', monospace;
	}

	/* ── Responsive ── */
	@media (max-width: 640px) {
		.map {
			font-size: 10px;
			letter-spacing: 0px;
			padding: 4px;
		}

		.hud {
			font-size: 12px;
			gap: 8px;
		}

		.game-title {
			font-size: 20px;
			letter-spacing: 3px;
		}

		.class-grid {
			flex-direction: column;
			align-items: center;
		}

		.class-card {
			width: 240px;
		}
	}
</style>
