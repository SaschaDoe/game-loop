# Most Wanted List

As a player, I want a dynamic most-wanted list of the world's most dangerous criminals and monsters that I can hunt for fame and fortune, so that bounty hunting has high-profile targets.

## Details

- **The List**: 10 targets ranked by danger level and bounty value; displayed on bounty boards in major cities and at the Hunter's Guild; updates dynamically as targets are captured/killed and new threats emerge
- **Target Types**:
  - **Bandit Lords**: leaders of major bandit groups; heavily guarded; often in fortified camps; capturing alive pays 50% more than killing
  - **Serial Killers**: NPCs who murder other NPCs on a pattern; investigation required to identify them; they may be hiding in plain sight as respectable citizens
  - **Rogue Mages**: magic users who've gone mad or evil; extremely dangerous; magical defenses make direct assault difficult; often in warded lairs
  - **Monster Alphas**: legendary creatures terrorizing regions (great dragon, elder vampire, kraken, ancient lich); require expedition-level preparation
  - **Political Exiles**: deposed rulers, traitors, war criminals; hiding in allied territories; diplomatic complications (attacking them in a friendly nation causes international incidents)
  - **Cult Leaders**: heads of dangerous cults; protected by fanatical followers; may have divine/demonic patron backing them
- **Bounty Scaling**: bounties range from 500 gold (#10) to 10,000 gold (#1); bonus rewards for capturing alive (trial and execution provides closure to victims); special item rewards for the top 3
- **Hunter Competition**: other bounty hunter NPCs pursue the same targets; they may reach the target first (target eliminated, you get nothing); or you encounter rivals at the target's location (cooperate or compete)
- **Intel Gathering**: each target has an intel file; start with basic description and last known location; gather more intel by investigating (witnesses, crime scenes, informants); more intel = easier to find and plan approach
- **Target Behavior**: most-wanted targets aren't static; they move, plan, and react; if they learn a hunter is coming, they set traps, hire bodyguards, or relocate; targets may even ambush the hunter
- **Legendary Hunt**: eliminating all 10 targets from the list earns the "Legendary Hunter" title, a unique weapon, and permanent +5 reputation with all law-enforcement factions

## Acceptance Criteria

- [ ] List dynamically updates as targets are eliminated and new ones added
- [ ] All target types have appropriate defenses and capture mechanics
- [ ] Hunter competition creates rival encounters at target locations
- [ ] Intel gathering progressively reveals target information
- [ ] Legendary Hunt completion grants correct rewards
