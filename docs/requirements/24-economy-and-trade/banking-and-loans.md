# Banking and Loans

As a player, I want to deposit gold in banks, take out loans, and earn interest, so that financial management is a meaningful game system.

## Details

- **Bank Services** (available in major towns):
  - **Deposit**: store gold safely; deposited gold can't be lost on death or stolen by pickpockets
  - **Withdrawal**: retrieve gold from any branch (bank network spans all major towns)
  - **Interest**: deposited gold earns 2% per 100 in-game days; compounding
  - **Loans**: borrow up to 5x your reputation level in gold; 10% interest per 100 days; must repay or face consequences
  - **Safe Deposit Box**: store items (not just gold); limited to 10 items; protected from all loss
- **Loan Consequences** (failure to repay):
  - Overdue 100 days: warning letter, +5% penalty interest
  - Overdue 200 days: bounty hunter sent to collect (combat encounter)
  - Overdue 500 days: reputation tanked in all towns with banks, shops refuse to trade, arrest warrant issued
- **Investment**: invest in NPC businesses (shops, caravans, mines); returns vary based on business success (10-50% over time, or total loss if the business fails)
- **Money Laundering**: the Thieves Guild offers to "clean" stolen gold (marked gold becomes unmarked) for a 30% fee
- **Heist Quest**: rob a bank vault (complex multi-step quest involving stealth, lockpicking, guard schedules, and a getaway plan)
- **Bank Robbery Defense**: if bandits rob the bank while you have deposits, you can defend it for a reward or lose your deposits
- **Inflation**: if the player injects too much gold into the economy (selling dragon hoards), local prices rise temporarily
- Each town's bank has a unique banker NPC with personality and dialogue

## Acceptance Criteria

- [ ] Deposit and withdrawal work across all bank branches
- [ ] Interest accrues correctly over time
- [ ] Loan system tracks debt and triggers consequences
- [ ] Investment returns vary based on business outcomes
- [ ] Bank heist quest is completable
