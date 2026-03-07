# Blood Magic Spells

As a player vampire, I want a dedicated blood magic spell school that uses my blood pool as fuel, so that vampire spellcasting feels fundamentally different from standard magic.

## Details

- **Blood Pool as Mana**: vampires use blood pool instead of mana; blood gained by feeding (10 blood per feeding); max blood = 50 + (5 x vampire age tier); blood decays by 1 per 20 turns (representing metabolic need)
- **Blood Spells**:
  - **Blood Bolt** (5 blood): ranged attack; fires a bolt of crystallized blood; deals moderate piercing + necrotic damage; basic vampire ranged option
  - **Crimson Shield** (10 blood): create a shield of hardened blood; absorbs next 30 damage; lasts 10 turns or until depleted; visible red barrier
  - **Blood Puppet** (15 blood): control a recently killed corpse; puppet fights for you for 20 turns; retains the creature's basic attacks; crumbles when duration expires
  - **Hemorrhage** (12 blood): target bleeds uncontrollably; 3 damage per turn for 10 turns; heals you for half the damage dealt; CON save halves duration
  - **Blood Mist** (20 blood): transform into a cloud of blood mist; AoE that drains 1 HP per turn from all living creatures in the cloud; heals you for total drained; lasts 5 turns; can't be attacked in mist form but can't attack either
  - **Sanguine Chains** (18 blood): blood erupts from the ground and chains a target; immobilized for 5 turns; STR save each turn to break free; chains deal 2 damage per turn
  - **Exsanguinate** (30 blood): ultimate drain; target takes massive necrotic damage (50% of their current HP); you heal for the damage dealt; 1-turn cast time; single target; CON save halves
  - **Blood Frenzy** (25 blood): enter a blood rage; +5 STR, +3 DEX, -5 INT; all attacks heal you for 25% of damage dealt; lasts 10 turns; when it ends, stunned for 2 turns
- **Blood Ritual Magic**: more powerful but requires preparation; draw a blood circle (10 turns); sacrifice blood (cost varies); effects include: mass resurrection (as vampires), territory warding (sunlight repelled in area), blood scrying (locate anyone whose blood you possess)
- **Spell Learning**: blood spells learned from vampire elders, ancient vampire tomes, or discovered through experimentation (combine blood with standard spell knowledge)

## Acceptance Criteria

- [ ] Blood pool tracks correctly as vampire mana source
- [ ] All spells consume correct blood amounts and produce correct effects
- [ ] Hemorrhage and Exsanguinate healing transfers correctly
- [ ] Blood Frenzy applies correct stat changes and post-effect stun
- [ ] Blood ritual magic requires preparation circle and correct costs
