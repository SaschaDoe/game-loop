# Void Magic

As a player, I want to learn void magic — the manipulation of nothingness and antimatter — as the most dangerous and powerful forbidden school, so that ultimate magical power comes with ultimate risk.

## Details

- **Void Magic Source**: learned from: Void Rifts (natural dimensional tears), Aboleth memory transfers, Precursor data crystals, or going insane in the void between dimensions; cannot be taught by normal teachers; each learning source teaches different spells
- **Void Spells**:
  - **Void Bolt** (10 mana, 5 sanity): fires a bolt of nothingness; disintegrates what it hits; ignores ALL defenses (armor, shields, magic resistance); deals moderate damage; leaves a small void scar on the terrain (dangerous to step on)
  - **Null Zone** (25 mana, 10 sanity): create a 3-tile zone where magic doesn't function; all active spells end, no spells can be cast, enchantments suppressed; lasts 10 turns; affects you too
  - **Void Step** (15 mana, 3 sanity): briefly step into the void between dimensions; teleport up to 20 tiles; arrive disoriented (-1 to next action); bypasses all barriers
  - **Entropy** (30 mana, 15 sanity): target an item; it ages to dust (destroyed); works on equipment enemies are wearing; CON save: on save, item takes heavy durability damage instead of destruction; unblockable
  - **Void Gaze** (20 mana, 8 sanity): look into the void; see all hidden creatures, objects, and passages within 30 tiles; also see things you wish you hadn't (random sanity loss 1-5 additional)
  - **Annihilation** (80 mana, 40 sanity): ultimate void spell; erases a target from existence; no save; no resurrection possible; works on anything including bosses; but casting it at low sanity may erase YOU instead (50% chance if sanity below 20)
  - **Void Shield** (35 mana, 12 sanity): absorb the next 3 attacks into the void; absorbed attacks cease to exist (no reflected damage, just gone); shield lasts 20 turns
- **Sanity Cost**: all void magic costs sanity in addition to mana; sanity recovers slowly (1 per 20 turns of rest); at 0 sanity, void magic becomes unpredictable (random targets, random effects, self-damage possible)
- **Void Corruption**: frequent void magic use causes physical changes: eyes become black, shadows cling to you, plants die in your presence; NPCs become terrified; at maximum corruption, you partially exist in the void (intangible 10% of the time, randomly)
- **Void Mastery**: reaching maximum void skill unlocks "Void Born" passive: sanity costs halved, void corruption slowed, void sight permanent; but you can never fully leave the void's influence

## Acceptance Criteria

- [ ] All void spells bypass defenses as described
- [ ] Sanity costs deduct correctly and recovery works at correct rate
- [ ] Annihilation self-erasure risk triggers at correct sanity threshold
- [ ] Void corruption progresses with usage and produces correct effects
- [ ] Void Mastery passive applies correct cost reductions
