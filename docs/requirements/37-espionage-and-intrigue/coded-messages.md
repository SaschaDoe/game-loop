# Coded Messages

As a player, I want to intercept, decode, and create encrypted messages, so that espionage gameplay has a puzzle-solving cryptography layer.

## Details

- **Message Sources**: intercepted courier pouches, dead drops, pigeon messages, overheard whispered codes, spy network reports
- **Cipher Types** (difficulty scales with espionage level):
  - **Simple Substitution**: each letter replaced by another; solvable with frequency analysis; Intelligence check or manual solving
  - **Keyword Cipher**: substitution using a keyword; requires finding the keyword (on the sender, in their quarters, from interrogation)
  - **Codebook**: words replaced by code phrases ("The eagle flies at dawn" = "Attack at first light"); requires finding the codebook
  - **Magical Encryption**: text only visible under specific conditions (moonlight, blood, detect magic); increasingly common for important messages
  - **Layered Cipher**: multiple encryption methods stacked; requires cracking each layer sequentially
- **Decoding Interface**: player sees the encrypted text; can attempt:
  - Auto-decode: Intelligence check; higher INT = faster decode; may fail on harder ciphers
  - Manual decode: player tries to solve the substitution puzzle themselves (interactive mini-game)
  - Find the key: quest to locate the cipher key (interrogation, theft, social engineering)
- **Message Content**: decoded messages reveal: enemy troop movements, assassination plots, hidden treasure locations, spy identities, faction secrets
- **Creating Messages**: player can encrypt their own messages to send via the mail system or dead drops; used to coordinate with allies, mislead enemies, or plant false intelligence
- **Counter-Intelligence**: enemies may feed encrypted messages that are intentionally decodable — leading to traps or false information
- **Codex Integration**: decoded messages are stored in the intelligence journal with timestamps and reliability ratings

## Acceptance Criteria

- [ ] All cipher types present solvable puzzles at appropriate difficulty
- [ ] Auto-decode uses Intelligence checks correctly
- [ ] Manual decode mini-game is interactive and solvable
- [ ] Decoded content references actual world state
- [ ] Player message creation and encryption functions
