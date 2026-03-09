# Spell Catalog

Complete spell definitions for all 12 schools (7 arcane + 5 forbidden). Each spell has mechanical stats ready for implementation. Spells are organized into 5 tiers per school.

**Existing code reference:** `ascii-rpg/src/lib/game/spells.ts` currently has 20 spells across 4 schools (Elements: 6, Enchantment: 5, Alchemy: 5, Divination: 4). These spells are retained with their existing IDs and reclassified into the new 5-tier system. New spells are added to fill out all 12 schools.

**Stat reference (from `attributes-and-resources.md`):**
- Entity attributes: HP, mana, STR, INT, WIL, AGI, VIT, attack, spellPower, magicResist
- spellPower scales damage/healing; magicResist reduces incoming spell damage (cap 50%)
- See US-MS-22 at the bottom of this file for all scaling formulas

**Tier requirements (from `spell-schools.md`):**
- Tier 1: No school rank requirement
- Tier 2: School rank Novice
- Tier 3: School rank Adept
- Tier 4: School rank Adept + character level 10
- Tier 5: School rank Master + character level 15
- Forbidden spells: No tier requirement (self-taught), but have escalating side effects

---

## US-MS-17: Elements Spell Catalog

**As a** spell caster, **I want** access to elemental spells across 5 tiers **so that** I can deal damage and control the battlefield with fire, ice, and lightning.

### Spell Table

| ID | Name | Tier | Mana | CD | Range | Cast | Effect |
|----|------|------|------|----|-------|------|--------|
| `spell_firebolt` | Firebolt | 1 | 3 | 2 | 6 | 1 turn | Deal 4 fire damage to one enemy. |
| `spell_frost_lance` | Frost Lance | 1 | 4 | 3 | 6 | 1 turn | Deal 3 damage to one enemy. Apply freeze (1 turn). |
| `spell_lightning_arc` | Lightning Arc | 2 | 6 | 4 | 5 | 1 turn | Deal 3 damage to up to 3 adjacent enemies (chain). |
| `spell_glacial_wall` | Glacial Wall | 2 | 5 | 6 | 4 | 1 turn | Create a 3-tile ice barrier lasting 5 turns. Blocks movement and line of sight. |
| `spell_fireball` | Fireball | 3 | 10 | 8 | 6 | 1 turn | Deal 8 fire damage in a 3x3 AoE. Apply burn (3 turns, 2 damage/turn). |
| `spell_tempest` | Tempest | 4 | 14 | 12 | 5 | 1 turn | Deal 6 damage in a 5x5 AoE. Apply freeze + stun (2 turns) to all targets. |
| `spell_inferno` | Inferno | 5 | 20 | 15 | 6 | 1 turn | Deal 15 fire damage in a 5x5 AoE. Affected tiles become burning terrain for 10 turns (2 damage/turn to anything entering or standing on them). |

**Notes:**
- The existing `spell_inferno` (was level 3, 8 damage, 3x3) is **renamed** to `spell_fireball` at Tier 3 with matching stats. The `spell_inferno` ID is reused for the new Tier 5 version with 15 damage and terrain burn.
- All existing IDs from `spells.ts` are preserved. Tier replaces the old `level` field (1-3 mapped into 1-5).
- Element count: 7 spells (Tier 1: 2, Tier 2: 2, Tier 3: 1, Tier 4: 1, Tier 5: 1).

### Acceptance Criteria

- [ ] All 7 Elements spells are defined in `SPELL_CATALOG` with `tier` field (1-5).
- [ ] Existing spell IDs (`spell_firebolt`, `spell_frost_lance`, `spell_lightning_arc`, `spell_glacial_wall`, `spell_tempest`) retain their IDs.
- [ ] Old `spell_inferno` (3x3, 8 damage) becomes `spell_fireball` at Tier 3; new `spell_inferno` is Tier 5 (5x5, 15 damage, terrain burn).
- [ ] `SpellDef.level` field is renamed to `tier` with type `1 | 2 | 3 | 4 | 5`.
- [ ] Fireball creates burn status effect on targets.
- [ ] Tempest applies both freeze and stun simultaneously.
- [ ] Inferno (Tier 5) converts affected floor tiles to burning terrain hazard for 10 turns.
- [ ] Glacial Wall creates impassable barrier tiles that expire after 5 turns.
- [ ] All damage values listed are base damage (before spellPower scaling).

---

## US-MS-18: Enchantment Spell Catalog

**As a** spell caster, **I want** access to enchantment spells across 5 tiers **so that** I can create shields, buffs, and protective wards for myself and allies.

### Spell Table

| ID | Name | Tier | Mana | CD | Range | Cast | Effect |
|----|------|------|------|----|-------|------|--------|
| `spell_arcane_ward` | Arcane Ward | 1 | 3 | 4 | Self | 1 turn | Gain +3 HP shield for 5 turns. Absorbs damage before HP. |
| `spell_binding_circle` | Binding Circle | 1 | 5 | 5 | 4 | 1 turn | Stun one enemy for 3 turns. Target cannot move or act. |
| `spell_dispel` | Dispel | 2 | 4 | 3 | 5 | 1 turn | Remove all status effects (positive and negative) from one target. |
| `spell_weapon_enchant` | Weapon Enchant | 2 | 5 | 8 | Self | 1 turn | Gain +3 ATK for 10 turns. |
| `spell_reflective_shield` | Reflective Shield | 3 | 7 | 6 | Self | 1 turn | Reflect 50% of melee damage back to attackers for 4 turns. |
| `spell_sanctum` | Sanctum | 4 | 12 | 10 | Self (area) | 1 turn | Create a 3x3 protective zone centered on caster. All allies in the zone gain +5 HP shield and regeneration (3 HP/turn, 3 turns). |
| `spell_absolute_ward` | Absolute Ward | 5 | 18 | 20 | Self | 1 turn | Gain immunity to the next 3 hits from any source (melee, ranged, spell). Each blocked hit consumes one charge. |

### Acceptance Criteria

- [ ] All 7 Enchantment spells are defined with `tier` 1-5.
- [ ] Existing IDs preserved: `spell_arcane_ward`, `spell_binding_circle`, `spell_dispel`, `spell_reflective_shield`, `spell_sanctum`.
- [ ] New spells added: `spell_weapon_enchant` (Tier 2), `spell_absolute_ward` (Tier 5).
- [ ] Arcane Ward and Sanctum create shield HP that absorbs damage before real HP.
- [ ] Reflective Shield damage reflection only applies to melee attacks, not spells.
- [ ] Absolute Ward tracks remaining charges (3) as a status effect; each incoming hit removes one charge regardless of damage amount.
- [ ] Dispel removes both beneficial and harmful effects (can be used offensively to strip enemy buffs or defensively to cure debuffs).
- [ ] Weapon Enchant stacks additively with equipment ATK bonuses.
- [ ] Shield durations listed are base durations (before INT scaling).

---

## US-MS-19: Restoration, Divination, and Alchemy Combat Spell Catalogs

**As a** spell caster, **I want** access to Restoration, Divination, and Alchemy combat spells across 5 tiers **so that** I can heal, gain information, and apply alchemical effects in combat.

### Restoration Spells

*Restoration is a NEW school not present in current code. It is taught by temple traditions, not the Academy.*

| ID | Name | Tier | Mana | CD | Range | Cast | Effect |
|----|------|------|------|----|-------|------|--------|
| `spell_heal` | Heal | 1 | 4 | 3 | Self/Touch | 1 turn | Restore 8 HP to self or adjacent ally. |
| `spell_cure` | Cure | 1 | 3 | 2 | Self/Touch | 1 turn | Remove 1 negative status effect from self or adjacent ally. Removes the effect with the shortest remaining duration first. |
| `spell_bless` | Bless | 2 | 6 | 8 | Self/Touch | 1 turn | Grant +2 to all attributes (STR, INT, WIL, AGI, VIT) for 10 turns. |
| `spell_regenerate` | Regenerate | 2 | 5 | 6 | Self/Touch | 1 turn | Apply regeneration: heal 3 HP per turn for 10 turns (30 HP total). |
| `spell_purify` | Purify | 3 | 8 | 10 | Self | 1 turn | Remove ALL negative status effects from self. Gain immunity to negative status effects for 3 turns. |
| `spell_mass_heal` | Mass Heal | 4 | 14 | 12 | Self (area) | 1 turn | Heal 12 HP to self and all visible allies within sight radius. |
| `spell_resurrection` | Resurrection | 5 | 25 | Special | Self | 1 turn | Apply a precast buff lasting 100 turns. If the caster takes lethal damage while the buff is active, they are revived at 50% max HP instead of dying. Cooldown: once per rest (cannot be recast until the player rests). |

### Divination Spells

*Expands the existing 4 Divination spells (True Sight, Reveal Secrets, Foresight, Scryer's Mark) to 7 across 5 tiers. Astral Projection moves from level 3 to Tier 5.*

| ID | Name | Tier | Mana | CD | Range | Cast | Effect |
|----|------|------|------|----|-------|------|--------|
| `spell_true_sight` | True Sight | 1 | 3 | 5 | Self | 1 turn | +3 sight radius for 10 turns. Reveals hidden enemies and invisible entities. |
| `spell_reveal_secrets` | Reveal Secrets | 1 | 4 | 8 | Self (area) | 1 turn | Detect all traps and secret doors within a 5-tile radius. Detected traps are revealed on the map. |
| `spell_foresight` | Foresight | 2 | 6 | 6 | Self | 1 turn | +20% dodge chance for 5 turns. Dodge is rolled before damage calculation. |
| `spell_scryers_mark` | Scryer's Mark | 2 | 5 | 10 | 6 | 1 turn | Mark one visible enemy. Reveal the target's position through walls for 20 turns. |
| `spell_enemy_analysis` | Enemy Analysis | 3 | 4 | 3 | 6 | 1 turn | Target one visible enemy. Display its full stats (HP, ATK, DEF, resistances), weaknesses, and next intended action in the combat log. |
| `spell_premonition` | Premonition | 4 | 10 | 15 | Self | 1 turn | Auto-dodge the next 2 incoming attacks (melee or ranged). Each dodged attack consumes one charge. Charges last until used or 20 turns elapse. |
| `spell_astral_projection` | Astral Projection | 5 | 15 | 20 | Self | 1 turn | Reveal the entire current map for 3 turns. Caster cannot move or take any actions while projecting. Cancellable early. |

### Alchemy Combat Spells

*Retains all 5 existing Alchemy spells, adds Stone Skin (Tier 3) and Philosopher's Touch (Tier 5).*

| ID | Name | Tier | Mana | CD | Range | Cast | Effect |
|----|------|------|------|----|-------|------|--------|
| `spell_acid_splash` | Acid Splash | 1 | 3 | 2 | 5 | 1 turn | Deal 3 damage to one enemy. Reduce target's ATK by 1 for 3 turns. |
| `spell_healing_mist` | Healing Mist | 1 | 4 | 4 | Self | 1 turn | Heal 6 HP. |
| `spell_transmute_weapon` | Transmute Weapon | 2 | 5 | 6 | Self | 1 turn | +2 ATK for 5 turns. |
| `spell_corrosive_cloud` | Corrosive Cloud | 2 | 6 | 5 | 5 | 1 turn | Create a 3x3 poison cloud. All enemies in the area take 2 damage/turn for 3 turns (poison status). |
| `spell_stone_skin` | Stone Skin | 3 | 8 | 8 | Self | 1 turn | Gain +5 damage reduction for 8 turns. Each incoming hit has its damage reduced by 5 (minimum 1 damage). |
| `spell_petrify` | Petrify | 4 | 10 | 8 | 5 | 1 turn | Stun one enemy for 5 turns. Target turns to stone and cannot act. |
| `spell_philosophers_touch` | Philosopher's Touch | 5 | 25 | 30 | Self | 1 turn | Fully restore HP to maximum. Remove all negative status effects. Gain invulnerability for 2 turns (take 0 damage from all sources). |

### Acceptance Criteria

- [ ] Restoration school added as new `SpellSchool` type value: `'restoration'`.
- [ ] All 7 Restoration spells defined with IDs prefixed `spell_`.
- [ ] Heal and Cure support self or adjacent-tile targeting (touch range).
- [ ] Regenerate applies the existing `regeneration` status effect.
- [ ] Purify grants a `status_immune` buff that blocks application of negative status effects.
- [ ] Resurrection creates a precast buff tracked as a status effect with turn counter; triggers on lethal damage.
- [ ] Resurrection cooldown resets on rest (not a fixed turn count).
- [ ] All 4 existing Divination spell IDs preserved with unchanged stats.
- [ ] 3 new Divination spells added: `spell_enemy_analysis` (T3), `spell_premonition` (T4); Astral Projection reclassified from level 3 to Tier 5.
- [ ] Enemy Analysis reads target Entity stats and displays them in the combat log.
- [ ] Premonition uses a charge system (2 charges), consumed on incoming attacks.
- [ ] All 5 existing Alchemy spell IDs preserved.
- [ ] 2 new Alchemy spells added: `spell_stone_skin` (T3), `spell_philosophers_touch` (T5).
- [ ] Petrify reclassified from level 3 to Tier 4 (mana cost unchanged at 10).
- [ ] Stone Skin damage reduction stacks with armor but each source applies independently.
- [ ] Philosopher's Touch invulnerability is absolute (0 damage from all sources for 2 turns).
- [ ] All heal values listed are base heals (before spellPower scaling via healing formula).

---

## US-MS-20: Conjuration and Shadow Spell Catalogs

**As a** spell caster, **I want** access to Conjuration and Shadow spells across 5 tiers **so that** I can summon creatures, teleport, and wield darkness-based magic.

### Conjuration Spells

*Conjuration is a NEW school. Not taught at the Academy (considered too dangerous for students). Learned from wandering conjurers, ancient tomes, or planar rift events.*

| ID | Name | Tier | Mana | CD | Range | Cast | Effect |
|----|------|------|------|----|-------|------|--------|
| `spell_summon_light` | Summon Light | 1 | 2 | 1 | 6 | 1 turn | Create a light source at target visible tile. Lasts 10 turns. Illuminates a 3-tile radius (overrides fog of war for the area). |
| `spell_phase_step` | Phase Step | 1 | 4 | 5 | 5 | 1 turn | Teleport to any visible floor tile within 5 tiles. Cannot teleport through walls or into occupied tiles. |
| `spell_phantom_image` | Phantom Image | 2 | 5 | 6 | 4 | 1 turn | Create a decoy entity at target tile. Decoy has 3 HP, no attack, and attracts enemy attacks (enemies within 3 tiles target the decoy instead of the caster). Disappears when destroyed or after 8 turns. |
| `spell_conjure_weapon` | Conjure Weapon | 2 | 6 | 10 | Self | 1 turn | Summon a spectral weapon granting +3 ATK for 15 turns. Replaces current weapon temporarily; original weapon returns when the spell expires. |
| `spell_summon_elemental` | Summon Elemental | 3 | 12 | 15 | 3 | 1 turn | Summon an allied elemental creature on an adjacent tile. The elemental has 10 HP, 4 ATK, and acts independently on the caster's turn (moves toward and attacks the nearest enemy). Lasts 10 turns. Elemental type matches the caster's highest-ranked spell school (fire for Elements, etc.). |
| `spell_dimensional_door` | Dimensional Door | 4 | 10 | 20 | Map | 1 turn | Teleport to any previously explored floor tile on the current map. Cannot target unexplored tiles or tiles occupied by enemies. |
| `spell_grand_illusion` | Grand Illusion | 5 | 18 | 15 | Sight | 1 turn | All enemies within sight radius see phantom copies of the caster. Affected enemies gain the `confused` status for 5 turns (50% chance to attack random adjacent target instead of intended target each turn). |

### Shadow Spells

*Shadow is a NEW school. Morally ambiguous — the Academy does not teach it. Learned from the Whispering Shade, shadow cults, or ancient Shadow-touched artifacts.*

| ID | Name | Tier | Mana | CD | Range | Cast | Effect |
|----|------|------|------|----|-------|------|--------|
| `spell_darkness` | Darkness | 1 | 2 | 3 | 5 | 1 turn | Reduce one target's sight radius by 3 for 5 turns. Enemies with reduced sight may lose track of the player. |
| `spell_shadow_bolt` | Shadow Bolt | 1 | 4 | 3 | 6 | 1 turn | Deal 5 shadow damage to one enemy. Shadow damage ignores armor and shields (bypasses damage reduction and shield HP). |
| `spell_fear` | Fear | 2 | 6 | 6 | 5 | 1 turn | Target one enemy. Apply `fear` status for 3 turns. Feared enemies move away from the caster each turn and cannot attack. |
| `spell_life_drain` | Life Drain | 2 | 8 | 5 | 4 | 1 turn | Deal 8 shadow damage to one enemy. Heal self for 50% of damage dealt (4 HP base, scales with spellPower). |
| `spell_shadow_cloak` | Shadow Cloak | 3 | 10 | 10 | Self | 1 turn | Become invisible for 5 turns. Enemies cannot see or target the caster. Invisibility breaks immediately if the caster attacks, casts an offensive spell, or takes damage. |
| `spell_curse_of_weakness` | Curse of Weakness | 4 | 12 | 12 | 5 | 1 turn | Curse one enemy: all attributes (STR, INT, WIL, AGI, VIT) reduced by 3 for 20 turns. Affects derived stats (ATK, spellPower, dodge, etc.). |
| `spell_soul_rip` | Soul Rip | 5 | 25 | 20 | 4 | 1 turn | Deal 30 shadow damage to one enemy (ignores armor). If the target dies from this damage, a spectral ally is created at the target's position with 50% of the target's original HP and ATK. The spectral ally fights for the caster for 10 turns, then dissipates. |

### Acceptance Criteria

- [ ] Conjuration school added as new `SpellSchool` type value: `'conjuration'`.
- [ ] Shadow school added as new `SpellSchool` type value: `'shadow'`.
- [ ] All 7 Conjuration spells defined with unique IDs.
- [ ] All 7 Shadow spells defined with unique IDs.
- [ ] Summon Light creates a temporary light entity that affects FOV calculations.
- [ ] Phase Step validates target tile is visible, floor type, unoccupied, and within range.
- [ ] Phantom Image creates an Entity with `isDecoy: true` flag; enemy AI prioritizes decoys.
- [ ] Summon Elemental creates an allied Entity that uses basic chase-and-attack AI.
- [ ] Elemental type/appearance varies based on caster's highest school rank.
- [ ] Dimensional Door target must be an explored tile (visited or revealed by FOV at some point).
- [ ] Grand Illusion applies `confused` status effect: each turn, 50% chance the enemy attacks a random adjacent entity instead of its intended target.
- [ ] Shadow Bolt damage bypasses `damageReduction` and shield HP — applied directly to HP.
- [ ] Life Drain healing = floor(damage_dealt * 0.5); actual damage dealt (after magicResist) is used for heal calculation.
- [ ] Shadow Cloak sets `invisible: true` on Entity; AI skips invisible entities when selecting targets.
- [ ] Curse of Weakness modifies base attributes (not derived stats directly); derived stats recalculate from reduced attributes.
- [ ] Soul Rip's spectral ally inherits 50% of the slain target's HP and ATK, uses chase AI, and despawns after 10 turns.
- [ ] Soul Rip only creates a spectral ally if the target actually dies from the spell (not if it survives).

---

## US-MS-21: Forbidden School Spell Catalogs

**As a** player who discovers forbidden magic, **I want** access to powerful forbidden spells with unique mechanics and costs **so that** I experience high-risk, high-reward magic that normal schools cannot provide.

Forbidden spells have no school rank requirement (they are self-taught from dark sources), but they impose escalating side effects. See `spell-schools.md` for side effect rules per school.

### Blood Magic (7 spells)

*Resource: HP instead of mana. Every Blood Magic spell costs HP to cast.*

| ID | Name | Tier | HP Cost | CD | Range | Cast | Effect |
|----|------|------|---------|----|-------|------|--------|
| `spell_blood_bolt` | Blood Bolt | 1 | 5 HP | 2 | 6 | 1 turn | Deal 6 damage to one enemy. Damage scales with caster's missing HP (bonus = missing HP / 10, rounded down). |
| `spell_hemorrhage` | Hemorrhage | 2 | 8 HP | 6 | 5 | 1 turn | Inflict a bleeding wound on one enemy. Target takes 3 damage/turn for 5 turns (15 total). Bleed cannot be cured by normal Cure spells (requires Purify or rest). |
| `spell_blood_shield` | Blood Shield | 2 | 10 HP | 8 | Self | 1 turn | Convert 10 HP into a 15 HP shield lasting 8 turns. Net gain: 5 effective HP as shield. Shield absorbs damage before HP. |
| `spell_sanguine_whip` | Sanguine Whip | 3 | 12 HP | 5 | 3 | 1 turn | Deal 10 damage to one enemy in a line (up to 3 tiles). Heal self for 50% of damage dealt. |
| `spell_blood_pact` | Blood Pact | 3 | 15 HP | 15 | Self | 1 turn | Sacrifice 15 HP. For the next 8 turns, all attacks deal +5 bonus damage and all spells cost 0 mana (HP cost for Blood spells still applies). |
| `spell_crimson_tide` | Crimson Tide | 4 | 20 HP | 12 | Self (area) | 1 turn | Deal 12 damage to ALL entities (enemies and allies) in a 5x5 area centered on caster. Heal self for 25% of total damage dealt. |
| `spell_heart_stop` | Heart Stop | 5 | 30 HP | 25 | 4 | 1 turn | Attempt to stop the target's heart. If target's current HP is below 40% of its max HP, it dies instantly. Otherwise, deal 20 damage and stun for 3 turns. |

### Necromancy (7 spells)

*Resource: Mana + corpses. Some spells require a corpse tile (where an enemy died on the current map).*

| ID | Name | Tier | Mana | CD | Range | Cast | Effect | Requires Corpse |
|----|------|------|------|----|-------|------|--------|-----------------|
| `spell_life_tap` | Life Tap | 1 | 0 | 4 | Self | 1 turn | Sacrifice 5 HP to restore 8 mana. | No |
| `spell_bone_shield` | Bone Shield | 1 | 4 | 6 | Self | 1 turn | Gain +4 HP shield for 6 turns. Shield appearance: bone fragments orbiting caster. | No |
| `spell_corpse_explosion` | Corpse Explosion | 2 | 6 | 5 | 6 | 1 turn | Detonate a corpse tile. Deal 8 damage in a 3x3 area centered on the corpse. Removes the corpse. | Yes |
| `spell_wither` | Wither | 2 | 7 | 6 | 5 | 1 turn | Drain vitality from one target. Deal 5 damage and reduce target's max HP by 5 for 15 turns. | No |
| `spell_raise_dead` | Raise Dead | 3 | 10 | 12 | 4 | 1 turn | Raise a corpse as an undead ally. The undead has 60% of the original creature's HP and ATK. Lasts 15 turns or until destroyed. Max 2 raised undead at once. | Yes |
| `spell_plague_cloud` | Plague Cloud | 4 | 14 | 10 | 5 | 1 turn | Create a 5x5 area of necrotic fog lasting 5 turns. Enemies entering or standing in the fog take 4 damage/turn and have a 30% chance per turn to become stunned for 1 turn. | No |
| `spell_army_of_the_dead` | Army of the Dead | 5 | 25 | 30 | Self (area) | 2 turns | Raise ALL corpses on the current map as undead allies. Each undead has 50% of original stats. Lasts 20 turns. No limit on number raised. 2-turn cast time (caster is immobile and vulnerable during cast). | Yes (all) |

### Void Magic (7 spells)

*Resource: Mana + sanity. Void spells drain a hidden "stability" counter. At 0 stability, the caster suffers hallucinations (phantom enemies, distorted map).*

| ID | Name | Tier | Mana | CD | Range | Cast | Effect | Stability Cost |
|----|------|------|------|----|-------|------|--------|----------------|
| `spell_void_bolt` | Void Bolt | 1 | 3 | 2 | 6 | 1 turn | Deal 5 damage that ignores magicResist entirely. | -3 |
| `spell_null_zone` | Null Zone | 2 | 6 | 8 | 4 | 1 turn | Create a 3x3 area where no spells can be cast for 5 turns. Affects enemies and allies (including caster). | -5 |
| `spell_void_step` | Void Step | 2 | 5 | 6 | 8 | 1 turn | Teleport up to 8 tiles. Unlike Phase Step, does NOT require line of sight — can teleport through walls. Target must be a floor tile. | -4 |
| `spell_entropy` | Entropy | 3 | 8 | 8 | 5 | 1 turn | Reduce all stats of one target by 2 for 10 turns. Additionally, the target's healing received is halved for the duration. | -6 |
| `spell_void_gaze` | Void Gaze | 3 | 10 | 10 | 4 | 1 turn | Target sees into the Void. Apply `terror` status for 5 turns: target cannot move (paralyzed), takes 2 psychic damage per turn. | -8 |
| `spell_annihilation` | Annihilation | 4 | 16 | 15 | 5 | 1 turn | Deal 25 damage to one target. Damage ignores all defenses (armor, shields, magicResist). If target dies, its corpse is erased (cannot be used for Necromancy). | -10 |
| `spell_void_shield` | Void Shield | 5 | 20 | 20 | Self | 1 turn | Envelop self in Void energy for 5 turns. While active: immune to all spell damage, reflect 100% of spell damage back to caster, but take +50% melee damage. | -15 |

### Chronomancy (7 spells)

*Resource: Mana + temporal strain. Each Chronomancy spell adds "temporal strain" — at high strain, the caster may skip turns involuntarily.*

| ID | Name | Tier | Mana | CD | Range | Cast | Effect | Strain |
|----|------|------|------|----|-------|------|--------|--------|
| `spell_haste` | Haste | 1 | 4 | 6 | Self | 1 turn | Gain 1 extra action per turn for 3 turns (move + act twice). | +2 |
| `spell_slow` | Slow | 1 | 3 | 5 | 5 | 1 turn | Target acts every other turn for 6 turns (skips alternating turns). | +2 |
| `spell_temporal_sense` | Temporal Sense | 2 | 5 | 8 | Self | 1 turn | For 10 turns, see enemy movement patterns 1 turn ahead (ghost images showing where enemies will move next turn). | +3 |
| `spell_rewind` | Rewind | 3 | 10 | 15 | Self | 1 turn | Revert self to state from 3 turns ago: restore HP, mana, position, and status effects to their values 3 turns prior. Does not affect enemies or the map. | +5 |
| `spell_time_stop` | Time Stop | 4 | 15 | 20 | Self (global) | 1 turn | Freeze all other entities for 3 turns. Only the caster can act. Enemies cannot move, attack, or take damage during the stop (damage is deferred until time resumes). | +8 |
| `spell_age` | Age | 4 | 12 | 12 | 4 | 1 turn | Rapidly age one target. Reduce target's max HP by 25% and ATK by 25% permanently (persists until target dies). | +6 |
| `spell_paradox` | Paradox | 5 | 20 | 25 | Self | 1 turn | Create a temporal paradox: the caster exists in two timelines simultaneously for 5 turns. Caster has a "shadow self" that copies all actions 1 turn later. Effectively doubles all damage, healing, and spell effects. At the end, take 10 unavoidable damage as the timelines collapse. | +12 |

### Soul Magic (7 spells)

*Resource: Mana + soul fragments. Soul fragments are gained by slaying sentient enemies. Some spells consume fragments.*

| ID | Name | Tier | Mana | CD | Range | Cast | Effect | Fragment Cost |
|----|------|------|------|----|-------|------|--------|---------------|
| `spell_soul_sight` | Soul Sight | 1 | 3 | 5 | Self | 1 turn | See all living entities through walls within a 10-tile radius for 8 turns. Also reveals entity type and current HP percentage. | 0 |
| `spell_soul_rend` | Soul Rend | 2 | 6 | 4 | 5 | 1 turn | Deal 8 damage to one enemy. If target is below 50% HP, deal 12 damage instead. Damage ignores magicResist. | 0 |
| `spell_soul_trap` | Soul Trap | 2 | 5 | 8 | 4 | 1 turn | Mark one enemy. If the marked enemy dies within 10 turns, gain 2 soul fragments instead of the normal 1. | 0 |
| `spell_soul_transfer` | Soul Transfer | 3 | 8 | 10 | 4 | 1 turn | Swap current HP percentage with one target. If caster is at 30% HP and target is at 80% HP, caster goes to 80% and target goes to 30%. | 1 |
| `spell_soul_shield` | Soul Shield | 3 | 6 | 8 | Self | 1 turn | Consume 1 soul fragment to create a 20 HP shield lasting 10 turns. The shield regenerates 2 HP/turn. | 1 |
| `spell_soul_devour` | Soul Devour | 4 | 12 | 12 | 3 | 1 turn | Consume 2 soul fragments. Deal 20 damage to one enemy. Permanently gain +1 to a random attribute (STR, INT, WIL, AGI, or VIT). The attribute gain persists for the rest of the run. | 2 |
| `spell_soulless` | Soulless | 5 | 20 | 30 | Self | 1 turn | Consume 5 soul fragments. For 10 turns: immune to all status effects (positive and negative), +10 to all attributes, all attacks deal +10 bonus damage. When the effect ends, lose 3 from all attributes for 20 turns (soul exhaustion). | 5 |

### Acceptance Criteria

- [ ] All 5 forbidden schools added as `SpellSchool` type values: `'blood_magic'`, `'necromancy'`, `'void_magic'`, `'chronomancy'`, `'soul_magic'`.
- [ ] 35 forbidden spells total (7 per school) defined in `SPELL_CATALOG` with unique IDs.
- [ ] Blood Magic spells use `hpCost` field instead of `manaCost` (mana cost is 0).
- [ ] Necromancy spells that require corpses have `requiresCorpse: true` on SpellDef.
- [ ] Corpse tiles are tracked on the map when enemies die (new `corpsePositions` array on GameState).
- [ ] Void Magic spells have `stabilityCost` field; Entity gains `stability` stat (starts at 100, min 0).
- [ ] At stability 0, caster sees hallucination entities (phantom enemies that deal no damage but appear real).
- [ ] Chronomancy spells have `strainCost` field; Entity gains `temporalStrain` stat (starts at 0).
- [ ] At temporal strain >= 10, caster has a (strain - 10) * 5% chance to skip their turn each round.
- [ ] Soul Magic spells have `fragmentCost` field; Entity gains `soulFragments` counter.
- [ ] Sentient enemies (humanoid types, bosses) drop 1 soul fragment on death; non-sentient enemies drop 0.
- [ ] Soul Trap marks increase fragment drop to 2 from the marked target.
- [ ] Heart Stop instant-kill check: `target.hp < target.maxHp * 0.4`.
- [ ] Raise Dead enforces max 2 undead summon limit.
- [ ] Army of the Dead has 2-turn cast time: caster is immobile and vulnerable during turn 1, effect triggers on turn 2.
- [ ] Time Stop defers all damage to frozen entities until the stop ends (damage queue).
- [ ] Rewind stores a snapshot of caster state every turn (rolling 3-turn history).
- [ ] Paradox shadow-self copies actions with 1-turn delay; collapsing deals 10 fixed damage.
- [ ] Soul Transfer swaps HP *percentages*, not absolute HP values.
- [ ] Soul Devour permanent attribute gain is tracked and persists through level transitions.
- [ ] All forbidden spells are tagged `forbidden: true` on SpellDef for UI filtering and side-effect triggering.

---

## US-MS-22: Spell Scaling and Balance

**As a** game designer, **I want** clear formulas for how spells scale with attributes and level **so that** spell balance is predictable, testable, and consistent across all schools.

### Damage Formula

All damage spells use:

```
baseDamage + floor(spellPower / 4)
```

- `baseDamage`: fixed per spell (the damage number listed in the spell tables above).
- `spellPower`: derived from INT (see `attributes-and-resources.md`).
- Example: Firebolt (base 4) with spellPower 20 = 4 + floor(20/4) = 4 + 5 = 9 damage.

After scaling, apply target's magicResist:

```
finalDamage = floor(damage × (1 - magicResist / 100))
```

- `magicResist` is capped at 50 (50% reduction max).
- Example: 9 damage vs. 30 magicResist = floor(9 × 0.70) = 6 final damage.

**Exception:** Shadow damage (Shadow Bolt, Life Drain, Soul Rip) ignores armor/shields but still applies magicResist unless the spell explicitly states "ignores magicResist" (Void Bolt, Soul Rend, Annihilation).

### Healing Formula

All healing spells use:

```
baseHeal + floor(spellPower / 3)
```

- `baseHeal`: fixed per spell (the heal number listed in the spell tables).
- Healing is slightly more responsive to spellPower than damage (divide by 3 vs 4).
- Example: Heal (base 8) with spellPower 18 = 8 + floor(18/3) = 8 + 6 = 14 HP restored.
- Healing cannot exceed the target's maxHP (excess is wasted).

### Duration Scaling

Buff and debuff spells scale duration with INT:

```
finalDuration = baseDuration + floor(INT / 10)
```

- `baseDuration`: fixed per spell (the turns listed in the spell tables).
- Example: Arcane Ward (base 5 turns) with INT 23 = 5 + floor(23/10) = 5 + 2 = 7 turns.
- Duration scaling applies to: shields, buffs, debuffs, status effects applied by spells, summoned creature lifetimes.
- Duration scaling does NOT apply to: terrain effects (Glacial Wall, Inferno terrain, Null Zone), precast buffs (Resurrection), or "charge" effects (Absolute Ward, Premonition).

### Mana Cost and Cooldown

- Mana cost is **fixed** per spell. It does not scale with any attribute or level.
- Cooldown is **fixed** per spell. It does not scale.
- Rationale: scaling mana cost down with level makes high-level casters too spammy; scaling cooldown creates unpredictable balance. Fixed costs keep the resource game meaningful at all levels.

### Tier Requirements

| Tier | School Rank Required | Level Required | Typical Mana Range | Typical Power Level |
|------|---------------------|----------------|--------------------|--------------------|
| 1 | None | None | 2-5 | Single-target, small effects |
| 2 | Novice | None | 4-8 | Multi-target or strong single, moderate buffs |
| 3 | Adept | None | 7-12 | AoE, powerful buffs, summons |
| 4 | Adept | 10 | 10-16 | Large AoE, game-changing effects |
| 5 | Master | 15 | 15-25 | Ultimate abilities, terrain alteration, revival |

- Tier requirement is checked at cast time: if the caster does not meet the tier requirement, the spell appears greyed out in the spell menu and cannot be cast.
- Tier requirements apply to the 7 arcane schools only.

### Forbidden Spell Requirements

- Forbidden spells have **no tier or school rank requirement**. Any character who discovers the spell can cast it.
- Instead, forbidden spells have **escalating side effects** based on total forbidden casts (tracked per school):
  - 1-5 casts: no side effects (grace period).
  - 6-15 casts: minor (cosmetic changes, NPC comments, -1 to a random attribute per 5 casts).
  - 16-30 casts: moderate (periodic -2 HP drain per turn in combat, forbidden school's unique debuff activates).
  - 31+ casts: severe (permanent attribute losses, NPC hostility, potential game-over paths).
- Specific side effects per school are defined in `spell-schools.md`.

### Balance Constraints

- **No spell should one-shot a full-HP enemy of equal level.** Tier 5 spells can one-shot enemies 5+ levels below the caster.
- **Healing should not outpace incoming damage** in sustained combat. A character casting Heal every turn (with cooldown) should still take net damage from 2+ enemies.
- **Forbidden spells are 20-40% stronger** than arcane equivalents at the same tier, justified by their side effects.
- **Summoned creatures** (Summon Elemental, Raise Dead, etc.) should deal approximately 50-70% of the caster's own DPS to avoid pet-class dominance.
- **AoE spells** deal less per-target damage than single-target spells of the same tier (except Tier 5 ultimates).

### Acceptance Criteria

- [ ] Damage formula implemented: `baseDamage + floor(spellPower / 4)`, then apply `magicResist` reduction.
- [ ] Healing formula implemented: `baseHeal + floor(spellPower / 3)`, capped at target maxHP.
- [ ] Duration formula implemented: `baseDuration + floor(INT / 10)`, applied to buffs/debuffs/summon lifetimes.
- [ ] Duration scaling excluded from: terrain effects, precast buffs, charge-based effects.
- [ ] Mana cost is fixed (no scaling).
- [ ] Cooldown is fixed (no scaling).
- [ ] Tier requirement check at cast time: spell greyed out if school rank or level insufficient.
- [ ] Forbidden spells bypass tier requirements.
- [ ] Forbidden cast counter tracked per school on GameState: `forbiddenCasts: Record<string, number>`.
- [ ] Side effect thresholds implemented: 1-5 (none), 6-15 (minor), 16-30 (moderate), 31+ (severe).
- [ ] `magicResist` capped at 50 in damage formula.
- [ ] Shadow damage bypasses armor/shields but still applies magicResist (unless spell specifies otherwise).
- [ ] Void/Soul spells that "ignore magicResist" skip the magicResist reduction step entirely.
- [ ] Unit tests cover: damage formula at various spellPower values, healing cap at maxHP, duration scaling with INT, magicResist cap at 50, tier requirement blocking, forbidden spell side effect thresholds.
