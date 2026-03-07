# Moral Dilemma Quests

As a player, I want quests that present genuinely difficult moral choices with no clear right answer, so that decision-making feels weighty and personal.

## Details

- **Dilemma Types**:
  - **The Trolley Problem**: save one important NPC or five unnamed villagers; both groups visible, timer ticking
  - **The Informant**: a spy has information that saves lives but obtaining it requires torturing a prisoner; refuse = people die, comply = moral corruption
  - **The Mercy Kill**: a beloved NPC is cursed with agonizing, incurable pain; they beg for death; killing them is compassionate but murder; leaving them alive is cruel mercy
  - **The Sacrifice**: a ritual can stop a plague but requires sacrificing an innocent child NPC; no sacrifice = plague continues; sacrifice = cure but horror
  - **The Pardoner**: a murderer who killed a tyrant is on trial; legally guilty, morally justified; judge's verdict is the player's choice
  - **The Greater Good**: a town must be destroyed to stop a demonic invasion; evacuate who you can but thousands will die; or gamble on an untested plan with worse odds
  - **The Promise**: promised a dying NPC you'd protect their child; the child grows up to be a dangerous villain; do you keep your promise or break it?
- **No Optimal Solution**: every choice has real, permanent consequences; there is no hidden "best" path; the game validates all choices as legitimate
- **LLM Integration**: NPCs argue passionately for different sides; companions weigh in based on their personality; no NPC says "you did the right thing" — they express their genuine reaction
- **Consequence Tracking**: choices ripple through the world for 100+ turns; affected NPCs remember; some consequences don't emerge until much later
- **Retrospective**: much later in the game, revisit the consequences; see who lived, died, or was affected; quest journal entry updates with the outcome
- **Alignment Impact**: choices shift alignment significantly; but no choice is "evil" or "good" — both options have moral weight
- Player can refuse to choose (walk away); this is itself a choice with its own consequences

## Acceptance Criteria

- [ ] All dilemma quests present genuinely difficult choices
- [ ] No hidden optimal solution exists for any dilemma
- [ ] LLM NPC arguments represent multiple perspectives authentically
- [ ] Consequences manifest both immediately and long-term
- [ ] Refusing to choose has its own tracked consequences
