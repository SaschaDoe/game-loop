<script lang="ts">
	import { onMount } from 'svelte';
	import { createGame, handleInput, handleDialogueChoice, closeDialogue, renderColored, xpForLevel, CLASS_BONUSES, MOOD_DISPLAY, garbleText, checkCondition, SOCIAL_SKILL_DISPLAY, canDetectLies, getOverworldInfo } from '$lib/game/engine';
	import { STORIES } from '$lib/game/dialogue';
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
	let worldSeed = $state('');
	let state: GameState = $state(createGame());
	let grid = $derived(renderColored(state));
	let nameInput: HTMLInputElement;
	let logExpanded = $state(false);
	let journalOpen = $state(false);
	let messagesEl: HTMLDivElement;
	let dialogueSelection = $state(0);
	let typewriterText = $state('');
	let typewriterDone = $state(false);
	let typewriterNodeId = $state('');
	let typewriterRaf = 0;
	let typewriterIdx = 0;

	function startTypewriter(text: string, nodeId: string) {
		if (typewriterNodeId === nodeId) return;
		cancelAnimationFrame(typewriterRaf);
		typewriterNodeId = nodeId;
		typewriterText = '';
		typewriterDone = false;
		typewriterIdx = 0;
		const chars = [...text];
		let lastTime = 0;
		const msPerChar = 25;
		function tick(time: number) {
			if (!lastTime) lastTime = time;
			const elapsed = time - lastTime;
			const charsToShow = Math.floor(elapsed / msPerChar);
			if (charsToShow > typewriterIdx) {
				typewriterIdx = Math.min(charsToShow, chars.length);
				typewriterText = chars.slice(0, typewriterIdx).join('');
			}
			if (typewriterIdx >= chars.length) {
				typewriterDone = true;
				return;
			}
			typewriterRaf = requestAnimationFrame(tick);
		}
		typewriterRaf = requestAnimationFrame(tick);
	}

	$effect(() => {
		if (state.activeDialogue) {
			const dlg = state.activeDialogue;
			const node = dlg.tree.nodes[dlg.currentNodeId];
			if (node) {
				const isGarbled = !!(node.language && !state.knownLanguages.includes(node.language));
				const displayText = isGarbled ? garbleText(node.npcText ?? '', node.language ?? '') : (node.npcText ?? '');
				startTypewriter(displayText, dlg.currentNodeId);
			}
		}
	});

	function skipTypewriter(fullText: string) {
		cancelAnimationFrame(typewriterRaf);
		typewriterText = fullText;
		typewriterDone = true;
	}

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
			startingLocation: selectedLocation,
			worldSeed: worldSeed.trim()
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
		// Auto-scroll combat log to bottom
		requestAnimationFrame(() => {
			if (messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight;
		});
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
			const isTyping = document.activeElement?.tagName === 'INPUT';
			if (!isTyping) {
				if (e.key === '1') selectedClass = 'warrior';
				else if (e.key === '2') selectedClass = 'mage';
				else if (e.key === '3') selectedClass = 'rogue';
			}
		} else if (phase === 'playing') {
			// Dialogue mode input
			if (state.activeDialogue) {
				e.preventDefault();
				const key = e.key;
				const node = state.activeDialogue.tree.nodes[state.activeDialogue.currentNodeId];
				if (!node) return;
				// Skip typewriter on SPACE or tap
				if (!typewriterDone && (key === ' ' || key === 'Enter')) {
					skipTypewriter(node.npcText);
					return;
				}
				// Build filtered option list (same as render)
				const ctx = state.activeDialogue.context;
				const filtered = node.options.map((opt, origIdx) => ({ opt, origIdx })).filter(({ opt }) => !opt.showIf || checkCondition(opt.showIf, ctx));
				if (key === 'w' || key === 'ArrowUp') {
					dialogueSelection = Math.max(0, dialogueSelection - 1);
				} else if (key === 's' || key === 'ArrowDown') {
					dialogueSelection = Math.min(filtered.length - 1, dialogueSelection + 1);
				} else if (key === 'Enter' || key === ' ') {
					if (filtered[dialogueSelection]) {
						state = handleDialogueChoice(state, filtered[dialogueSelection].origIdx);
						dialogueSelection = 0;
					}
				} else if (key === 'Escape') {
					state = closeDialogue(state);
					dialogueSelection = 0;
					typewriterNodeId = '';
				} else if (key >= '1' && key <= '9') {
					const idx = parseInt(key) - 1;
					if (idx < filtered.length) {
						state = handleDialogueChoice(state, filtered[idx].origIdx);
						dialogueSelection = 0;
					}
				}
				return;
			}
			const key = e.key;
			if (key === 'j') {
				e.preventDefault();
				journalOpen = !journalOpen;
				return;
			}
			if (journalOpen) {
				if (key === 'Escape') journalOpen = false;
				return;
			}
			if (key === 'l') {
				e.preventDefault();
				logExpanded = !logExpanded;
				return;
			}
			if (['w', 'a', 's', 'd', 'q', 'r', 'f', 'g', 'e', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
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

		<div class="seed-section">
			<label for="world-seed">World Seed</label>
			<input
				id="world-seed"
				type="text"
				bind:value={worldSeed}
				placeholder="random"
				maxlength="20"
				class="seed-input"
			/>
			<span class="seed-hint">Same seed = same world</span>
		</div>

		<button class="start-btn" onclick={startGame}>Begin Adventure</button>
		<p class="creation-hint">Press 1/2/3 to pick class &middot; ENTER to begin</p>
	</div>
{:else}
	<div class="game-container">
		<div class="hud">
			<span class="hp">HP: {state.player.hp}/{state.player.maxHp}</span>
			<span class="atk">ATK: {state.player.attack}</span>
			{#if state.locationMode === 'overworld'}
				{@const owInfo = getOverworldInfo(state)}
				{#if owInfo}
					<span class="level" style="color:{owInfo.regionColor}">{owInfo.regionName}</span>
				{:else}
					<span class="level">Overworld</span>
				{/if}
			{:else}
				<span class="level">{state.level === 0 ? 'Starting Area' : `Dungeon: ${state.level}`}</span>
			{/if}
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
		<div class="combat-log-header">
			<span class="log-title">Combat Log</span>
			<button class="log-toggle" onclick={() => journalOpen = !journalOpen}>
				Journal ({state.rumors.length + state.heardStories.length}) (J)
			</button>
			<button class="log-toggle" onclick={() => logExpanded = !logExpanded}>
				{logExpanded ? '▼ Collapse' : '▲ Expand'} (L)
			</button>
		</div>
		<div class="messages" class:log-expanded={logExpanded} bind:this={messagesEl}>
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
				<button class="dpad-btn dpad-flee" ontouchstart={dpadTouch('f')} onclick={dpadClick('f')}>Flee</button>
				<button class="dpad-btn dpad-defend" ontouchstart={dpadTouch('g')} onclick={dpadClick('g')}>Defend</button>
				<button class="dpad-btn dpad-search" ontouchstart={dpadTouch('e')} onclick={dpadClick('e')}>Search</button>
			</div>
			{#if state.gameOver}
				<div class="dpad-row">
					<button class="dpad-btn dpad-restart" ontouchstart={dpadTouch('r')} onclick={dpadClick('r')}>Restart</button>
				</div>
			{/if}
		</div>
	</div>
	{#if state.activeDialogue}
		{@const dlg = state.activeDialogue}
		{@const node = dlg.tree.nodes[dlg.currentNodeId]}
		{@const isGarbled = !!(node?.language && !state.knownLanguages.includes(node.language))}
		{@const displayText = isGarbled ? garbleText(node?.npcText ?? '', node?.language ?? '') : (node?.npcText ?? '')}
		{@const isSuspicious = !!(node?.suspicious && canDetectLies(state))}
	{@const filteredOpts = (node?.options ?? []).map((opt, origIdx) => ({ opt, origIdx })).filter(({ opt }) => !opt.showIf || checkCondition(opt.showIf, dlg.context))}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="dialogue-overlay" onclick={(e) => {
			e.stopPropagation();
			if (!typewriterDone && node) skipTypewriter(displayText);
		}}>
			<div class="dialogue-box">
				<div class="dialogue-header">
					<span class="dialogue-portrait" style="color:{dlg.npcColor}">{dlg.npcChar}</span>
					<div class="dialogue-name-row">
						<span class="dialogue-name" style="color:{dlg.npcColor}">{dlg.npcName}</span>
						{#if isGarbled}
							<span class="dialogue-mood" style="color:#a8f">[Speaking {node?.language}]</span>
						{:else}
							<span class="dialogue-mood" style="color:{MOOD_DISPLAY[dlg.mood]?.color ?? '#888'}">[{MOOD_DISPLAY[dlg.mood]?.label ?? dlg.mood}]</span>
						{/if}
					</div>
					<button class="dialogue-close" onclick={() => { state = closeDialogue(state); dialogueSelection = 0; typewriterNodeId = ''; }}>ESC</button>
				</div>
				{#if node}
					<div class="dialogue-text" class:garbled={isGarbled}>{typewriterText}{#if !typewriterDone}<span class="typewriter-cursor">|</span>{/if}</div>
					{#if isGarbled}<div class="garbled-hint">You do not understand this language. Perhaps someone could teach you {node.language}...</div>{/if}
					{#if isSuspicious && typewriterDone}<div class="suspicious-hint">[Seems suspicious...]</div>{/if}
					{#if typewriterDone}
					<div class="dialogue-options">
						{#each filteredOpts as { opt: option, origIdx }, i}
							{@const isGiftOption = option.onSelect && dlg.givenItems}
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<div
								class="dialogue-option"
								class:selected={dialogueSelection === i}
								class:visited={dlg.visitedNodes.has(option.nextNode)}
								class:disabled={isGiftOption}
								style="color:{isGiftOption ? '#555' : (option.color ?? '#ccc')}"
								onclick={() => {
									if (!isGiftOption) {
										state = handleDialogueChoice(state, origIdx);
										dialogueSelection = 0;
									}
								}}
							>
								<span class="option-key">[{i + 1}]</span>
								{#if option.socialCheck}<span class="social-tag" style="color:{SOCIAL_SKILL_DISPLAY[option.socialCheck.skill]?.color ?? '#ccc'}">[{SOCIAL_SKILL_DISPLAY[option.socialCheck.skill]?.label}]</span> {/if}{option.text}
								{#if isGiftOption} (already received){/if}
								{#if dlg.visitedNodes.has(option.nextNode)} *{/if}
							</div>
						{/each}
					</div>
				{/if}
				{/if}
				{#if !typewriterDone}
					<div class="dialogue-hint">SPACE or click to skip</div>
				{:else}
					<div class="dialogue-hint">W/S to navigate &middot; ENTER to select &middot; 1-{filteredOpts.length} quick select &middot; ESC to leave</div>
				{/if}
			</div>
		</div>
	{/if}
	{#if journalOpen}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="journal-overlay" onclick={() => journalOpen = false}>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="journal-box" onclick={(e) => e.stopPropagation()}>
				<div class="journal-header">
					<span class="journal-title">Journal</span>
					<button class="dialogue-close" onclick={() => journalOpen = false}>ESC</button>
				</div>
				<div class="journal-section-title">Rumors & Secrets ({state.rumors.length})</div>
				{#if state.rumors.length === 0}
					<div class="journal-empty">No rumors learned yet. Talk to NPCs to learn secrets.</div>
				{:else}
					<div class="journal-list">
						{#each state.rumors as r}
							<div class="journal-entry">
								<span class="journal-rumor-text">"{r.text}"</span>
								<span class="journal-rumor-source">— {r.source || 'Unknown'}</span>
								<span class="journal-accuracy" class:accuracy-true={r.accuracy === 'true'} class:accuracy-exaggerated={r.accuracy === 'exaggerated'} class:accuracy-false={r.accuracy === 'false'}>
									{r.accuracy === 'true' ? '(Seems reliable)' : r.accuracy === 'exaggerated' ? '(Possibly exaggerated)' : '(Dubious)'}
								</span>
							</div>
						{/each}
					</div>
				{/if}
				<div class="journal-section-title">Stories Collected ({state.heardStories.length}/{Object.keys(STORIES).length})</div>
				{#if state.heardStories.length === 0}
					<div class="journal-empty">No stories heard yet. Ask NPCs to tell you tales.</div>
				{:else}
					<div class="journal-list">
						{#each state.heardStories as storyId}
							{@const s = STORIES[storyId]}
							{#if s}
								<div class="journal-entry">
									<div class="journal-story-header">
										<span class="journal-story-title">{s.title}</span>
										<span class="journal-story-type" class:type-legend={s.type === 'legend'} class:type-tall-tale={s.type === 'tall_tale'} class:type-cautionary={s.type === 'cautionary'} class:type-personal={s.type === 'personal'} class:type-lore={s.type === 'lore'}>
											{s.type === 'tall_tale' ? 'Tall Tale' : s.type.charAt(0).toUpperCase() + s.type.slice(1)}
										</span>
									</div>
									<span class="journal-story-text">{s.text}</span>
									<span class="journal-rumor-source">— told by {s.teller}</span>
								</div>
							{/if}
						{/each}
					</div>
				{/if}
				<div class="dialogue-hint">ESC or click outside to close</div>
			</div>
		</div>
	{/if}
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

	.seed-section {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 24px;
	}

	.seed-section label {
		color: #888;
		font-size: 14px;
	}

	.seed-input {
		background: #1a1a1a;
		border: 1px solid #555;
		color: #c84;
		font-family: 'Courier New', monospace;
		font-size: 14px;
		padding: 6px 10px;
		width: 160px;
		outline: none;
	}

	.seed-input:focus {
		border-color: #c84;
	}

	.seed-hint {
		color: #555;
		font-size: 11px;
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

	.combat-log-header {
		width: 100%;
		max-width: 600px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 4px;
	}

	.log-title {
		font-size: 11px;
		color: #666;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.log-toggle {
		background: none;
		border: 1px solid #444;
		color: #888;
		font-family: inherit;
		font-size: 11px;
		padding: 1px 8px;
		cursor: pointer;
	}

	.log-toggle:hover {
		color: #ccc;
		border-color: #666;
	}

	.messages {
		width: 100%;
		max-width: 600px;
		max-height: 80px;
		overflow-y: auto;
		scroll-behavior: smooth;
	}

	.messages.log-expanded {
		max-height: 300px;
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

	/* ── Dialogue Overlay ── */
	.dialogue-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.85);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
		padding: 16px;
		box-sizing: border-box;
	}

	.dialogue-box {
		background: #1a1a1a;
		border: 2px solid #555;
		border-radius: 4px;
		padding: 20px;
		max-width: 600px;
		width: 100%;
		max-height: 80vh;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.dialogue-header {
		display: flex;
		align-items: center;
		gap: 12px;
		border-bottom: 1px solid #333;
		padding-bottom: 12px;
	}

	.dialogue-portrait {
		font-size: 36px;
		font-weight: bold;
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #0a0a0a;
		border: 1px solid #444;
		border-radius: 4px;
	}

	.dialogue-name-row {
		display: flex;
		align-items: baseline;
		gap: 8px;
		flex: 1;
	}
	.dialogue-name {
		font-size: 18px;
		font-weight: bold;
		letter-spacing: 2px;
	}
	.dialogue-mood {
		font-size: 12px;
		font-style: italic;
		opacity: 0.8;
	}

	.dialogue-close {
		background: #222;
		border: 1px solid #555;
		color: #888;
		font-family: 'Courier New', monospace;
		font-size: 11px;
		padding: 4px 8px;
		cursor: pointer;
		border-radius: 2px;
	}

	.dialogue-close:hover {
		color: #ccc;
		border-color: #888;
	}

	.dialogue-text {
		font-size: 14px;
		line-height: 1.6;
		color: #ddd;
		white-space: pre-line;
		padding: 8px 0;
		min-height: 3em;
	}
	.typewriter-cursor {
		animation: blink 0.6s step-end infinite;
		color: #fff;
	}
	.garbled {
		color: #a8f;
		font-style: italic;
		letter-spacing: 1px;
	}
	.garbled-hint {
		color: #666;
		font-size: 11px;
		font-style: italic;
		margin-top: 4px;
	}
	.suspicious-hint {
		color: #fa4;
		font-size: 11px;
		font-style: italic;
		margin-top: 4px;
		animation: blink 2s ease-in-out infinite;
	}
	@keyframes blink {
		50% { opacity: 0; }
	}

	.dialogue-options {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.dialogue-option {
		padding: 8px 12px;
		border: 1px solid #333;
		border-radius: 2px;
		cursor: pointer;
		font-size: 13px;
		transition: background 0.15s, border-color 0.15s;
	}

	.dialogue-option:hover {
		background: #252525;
		border-color: #666;
	}

	.dialogue-option.selected {
		background: #1a2a1a;
		border-color: #8cf;
	}

	.dialogue-option.visited {
		opacity: 0.7;
	}

	.dialogue-option.disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.option-key {
		color: #666;
		font-size: 11px;
		margin-right: 6px;
	}

	.dialogue-hint {
		font-size: 10px;
		color: #555;
		text-align: center;
		border-top: 1px solid #333;
		padding-top: 8px;
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

	.dpad-flee {
		width: auto;
		padding: 0 16px;
		font-size: 12px;
		color: #8ac;
		border-color: #8ac;
	}

	.dpad-flee:active {
		background: #123;
		border-color: #adf;
	}

	.dpad-defend {
		width: auto;
		padding: 0 16px;
		font-size: 12px;
		color: #ac8;
		border-color: #ac8;
	}

	.dpad-defend:active {
		background: #132;
		border-color: #afd;
	}

	.dpad-search {
		width: auto;
		padding: 0 16px;
		font-size: 12px;
		color: #8ac;
		border-color: #8ac;
	}

	.dpad-search:active {
		background: #123;
		border-color: #adf;
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

	/* ── Journal ── */
	.journal-overlay {
		position: fixed;
		top: 0; left: 0; right: 0; bottom: 0;
		background: rgba(0, 0, 0, 0.85);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 200;
	}
	.journal-box {
		background: #1a1a2e;
		border: 2px solid #444;
		border-radius: 8px;
		padding: 16px;
		max-width: 550px;
		width: 90%;
		max-height: 70vh;
		overflow-y: auto;
	}
	.journal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 12px;
		border-bottom: 1px solid #444;
		padding-bottom: 8px;
	}
	.journal-title {
		font-size: 16px;
		font-weight: bold;
		color: #ff4;
		letter-spacing: 2px;
	}
	.journal-empty {
		color: #666;
		font-style: italic;
		padding: 16px 0;
		text-align: center;
	}
	.journal-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.journal-entry {
		border-left: 3px solid #444;
		padding: 6px 10px;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.journal-rumor-text {
		color: #ddd;
		font-style: italic;
	}
	.journal-rumor-source {
		color: #888;
		font-size: 11px;
	}
	.journal-accuracy {
		font-size: 11px;
	}
	.accuracy-true { color: #4f4; }
	.accuracy-exaggerated { color: #ff4; }
	.accuracy-false { color: #f44; }
	.journal-section-title {
		color: #c8f;
		font-size: 13px;
		font-weight: bold;
		border-bottom: 1px solid #333;
		padding: 8px 0 4px;
		margin-top: 6px;
	}
	.journal-story-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.journal-story-title {
		color: #fff;
		font-weight: bold;
		font-size: 13px;
	}
	.journal-story-type {
		font-size: 10px;
		padding: 1px 6px;
		border-radius: 3px;
		background: #333;
	}
	.type-legend { color: #ff4; background: #332800; }
	.type-tall-tale { color: #f84; background: #331800; }
	.type-cautionary { color: #f44; background: #330808; }
	.type-personal { color: #8cf; background: #082033; }
	.type-lore { color: #c8f; background: #200833; }
	.journal-story-text {
		color: #bbb;
		font-size: 12px;
		line-height: 1.4;
	}

	.social-tag {
		font-size: 11px;
		font-weight: bold;
		margin-right: 2px;
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
