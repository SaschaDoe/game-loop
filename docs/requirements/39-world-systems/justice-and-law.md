# Justice and Law System

As a player, I want towns to have functional legal systems with guards, courts, and prisons, so that crime and justice are meaningful game systems.

## Details

- Guards: patrol towns, respond to crimes, pursue criminals, can be bribed (Charisma + gold)
- Crimes tracked per town: theft, assault, murder, trespassing, smuggling, vandalism
- Crime witnessed vs unwitnessed: unwitnessed crimes only become known if evidence is found
- Arrest: guards attempt to arrest; player can surrender, fight, or flee
- Trial: if arrested, face a court trial (LLM-powered judge, can plead case, hire a lawyer NPC)
  - Evidence matters: stolen goods found on you = guilty, witnesses testify
  - Persuasion: Charisma-based defense arguments
  - Bribery: corrupt judges can be bribed (risky — may backfire)
- Sentencing: fines (gold), imprisonment (skip turns), hard labor (quest), exile (banned from town)
- Prison gameplay: if imprisoned, can serve time (skip turns), attempt escape (stealth/lockpick), or be rescued by companions
- Wrongful accusation: possible to be framed; investigation quest to prove innocence
- Lawful players can become a judge or sheriff through reputation and quests

## Acceptance Criteria

- [ ] Crime tracking differentiates witnessed vs unwitnessed
- [ ] Arrest, trial, and sentencing flow works end-to-end
- [ ] LLM-powered court dialogue allows defense arguments
- [ ] Prison escape mechanics are functional
