# Undead Variants

As a player, I want a deep roster of undead enemies with distinct abilities, so that necropolis dungeons and graveyards have terrifying enemy variety.

## Details

- **Zombie**: slow, high HP, attacks in melee, can infect (creates more zombies from killed NPCs)
- **Skeleton Warrior**: medium speed, uses weapons and shields, blocks attacks
- **Skeleton Archer**: ranged attacker, fragile, stays at distance
- **Ghost**: incorporeal (50% physical damage reduction), passes through walls, drains mana on hit
- **Wraith**: fast, powerful, life-drains on hit (heals itself), immune to non-magical weapons
- **Lich**: casts powerful spells, teleports, raises nearby corpses as minions
- **Death Knight**: heavily armored undead, dark magic aura that weakens nearby living creatures
- **Banshee**: screams in a cone AoE that deals psychic damage and can stun
- **Revenant**: target-locked on the player, cannot be permanently killed until its quest is resolved
- All undead are weak to Holy magic and fire; immune to poison and fear

## Acceptance Criteria

- [ ] All undead types have distinct behaviors and abilities
- [ ] Holy and fire weaknesses apply
- [ ] Poison and fear immunities are enforced
- [ ] Lich corpse-raising and Revenant persistence work correctly
