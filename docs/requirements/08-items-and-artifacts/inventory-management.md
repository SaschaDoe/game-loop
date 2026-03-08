# Inventory Management

As a player, I want an inventory system with equipment slots and item storage, so that I can collect, equip, and manage items throughout my adventure.

## Inventory Slots

- 12 general-purpose inventory slots (no weight system)
- Items picked up go to first empty slot; if full, show "Inventory full" message
- Items can be dropped back into the world

## Equipment Slots (8, separate from inventory)

| Slot | Key | Examples |
|------|-----|----------|
| head | head | Helmet, Crown, Hood |
| body | body | Chainmail, Robe, Leather Armor |
| trouser | trouser | Leggings, Greaves |
| leftHand | leftHand | Sword, Staff, Shield |
| rightHand | rightHand | Dagger, Torch |
| back | back | Cape, Quiver, Backpack |
| leftFoot | leftFoot | Boot, Sandal |
| rightFoot | rightFoot | Boot, Sandal |

## Item Types

- **Equipment** — equippable to a slot, provides stat bonuses (HP, ATK, sight, etc.)
- **Book** — readable item with page-by-page content
- **Consumable** — single-use items (potions, food)
- **Misc** — quest items, junk, treasures

## Containers

World-placed storage with persistent contents (saved with game state):

| Size | Slots | Examples |
|------|-------|---------|
| small | 1 | Small box |
| medium | 8 | Chest, wardrobe (Schrank) |
| big | 100 | Vault, storage room |

## UI

- Press `i` to open inventory screen
- Left panel: 12 inventory slots in grid; Right panel: paper-doll equipment slots
- Navigate with WASD/arrows, Enter to select item
- Context actions: Equip, Unequip, Read (books), Use (consumables), Drop
- Press `e` near a container: split view (player inventory left, container right)
- Tab to switch panels, Enter to Take/Store items, ESC to close

## Acceptance Criteria

- [ ] Inventory displays all carried items (max 12)
- [ ] Equipment slots display equipped items separately
- [ ] Equip/unequip moves items between inventory and equipment slots
- [ ] Items can be dropped on the ground
- [ ] Containers persist contents across save/load
- [ ] Container interaction shows split view UI
- [ ] Context menu shows appropriate actions per item type
