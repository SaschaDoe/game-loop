# Dojo System

As a player, I want to discover and train at martial arts dojos with unique masters, training regimens, and belt progression, so that martial arts growth has dedicated training locations.

## Details

- **Dojo Locations**: hidden dojos in mountains, forests, and city back streets; each dojo specializes in one fighting style; discovery requires: NPC tips, following a martial artist, high Perception in correct area, or invitation after winning a street fight impressively
- **Dojo Masters**: each dojo has a master NPC with personality, backstory, and teaching philosophy:
  - Iron Fist Master: stern, disciplined; demands perfect form; training is painful but effective; respects persistence
  - Wind Step Master: playful, fast-talking; training involves dodging obstacles; rewards creativity and speed
  - Viper Strike Master: quiet, observant; trains by pointing out weaknesses in sparring partners; methodical progression
  - Dragon Breath Master: spiritual, meditative; half the training is sitting still and breathing; chi-focused; tests patience
  - Drunken Fist Master: appears drunk; training involves drinking and improvising; actually brilliant; unconventional tests
- **Training Regimen**: spend turns training at the dojo (10 turns per session); each session improves martial arts XP + chance of learning a new technique; training types:
  - **Forms Practice**: solo; build muscle memory; steady XP gain; low risk
  - **Sparring**: fight the master or other students; faster XP but risk of injury; losing teaches more than winning
  - **Obstacle Course**: DEX/STR challenges; timed; rewards based on performance; teaches movement techniques
  - **Meditation**: chi/ki recovery training; WIS-based; unlocks internal energy techniques
  - **Breaking**: smash boards, bricks, stones; STR-based; unlocks power strike techniques
- **Belt Progression**: White > Yellow > Orange > Green > Blue > Brown > Black > Red; each belt requires: XP threshold, pass a test (fight the master at that belt's difficulty), and complete a dojo quest
- **Belt Benefits**: each belt grants: +1 unarmed damage, access to new technique, dojo reputation; Black belt = can teach others; Red belt (grandmaster) = can open your own dojo
- **Dojo Quests**: each dojo has a storyline; rival dojos challenge yours; defend dojo honor in tournaments; master has a nemesis who returns; ancient martial arts scrolls to recover
- **Multi-Dojo**: can train at multiple dojos but loyalty matters; primary dojo (most training) grants bonus; training at a rival dojo reduces loyalty with your primary

## Acceptance Criteria

- [ ] Dojos are discoverable through correct methods
- [ ] Training sessions provide correct XP and technique chances
- [ ] Belt progression gates on correct XP, tests, and quests
- [ ] Multi-dojo loyalty system tracks primary and adjusts bonuses
- [ ] Dojo quest lines provide narrative content per dojo
