# Prosthetics and Augmentation

As a player, I want to replace lost limbs or augment my body with magical and mechanical prosthetics, so that injury becomes an opportunity for unique character builds.

## Details

- **Limb Loss**: severe combat injuries, failed trap disarms, or story events can cause limb loss; each lost limb imposes specific penalties (lost hand = can't dual wield, lost leg = movement -2, lost eye = perception -3)
- **Prosthetic Types**:
  - **Wooden/Basic**: cheap, removes the worst penalties but provides no bonus; crafted by any carpenter; visible and obvious
  - **Mechanical (Artificer)**: clockwork limbs; restores full function + minor bonus (mechanical arm = +1 STR, mechanical leg = +1 movement, mechanical eye = darkvision); requires maintenance (oil every 100 turns)
  - **Magical (Enchanted)**: arcane-infused replacements; significant bonuses (arcane arm = can channel spells through it, arcane eye = detect magic vision, arcane leg = silent movement); expensive, requires enchanter
  - **Living (Grafted)**: monster parts grafted onto the body (dragon claw arm = fire damage on unarmed, troll leg = regeneration, beholder eye = random ray 1/day); requires dark magic; sanity cost; NPCs react with fear/disgust
  - **Precursor (Ancient Tech)**: the most powerful; found in ancient ruins; self-repairing, no maintenance; unique abilities (phasing hand = reach through walls, quantum eye = see invisible + through walls, gravity leg = double jump)
- **Augmentation (No Injury Required)**: elective enhancements that replace healthy body parts; controversial; some factions approve (artificers, transhumanists), others condemn (purists, nature druids)
- **Compatibility**: maximum 3 prosthetics before body rejection risk; each additional prosthetic after 3 has a cumulative 15% chance of rejection (causes damage and removes the prosthetic)
- **Maintenance**: mechanical prosthetics need repairs; magical ones need mana infusion; living ones need feeding; neglect causes malfunction (arm locks up in combat, leg gives out while running)

## Acceptance Criteria

- [ ] Limb loss correctly imposes appropriate penalties
- [ ] All prosthetic tiers restore function and grant correct bonuses
- [ ] Body rejection mechanic triggers at correct thresholds
- [ ] Maintenance requirements function on correct schedules
- [ ] NPC reactions reflect prosthetic type and visibility
