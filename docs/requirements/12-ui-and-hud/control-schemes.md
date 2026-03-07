# Control Schemes

As a player, I want multiple control scheme options including keyboard, touch, and gamepad, so that the game is comfortable to play on any device.

## Details

- **Keyboard Controls** (default):
  - Movement: WASD or Arrow Keys
  - Interact: Enter or E
  - Inventory: I
  - Character Sheet: C
  - Quest Journal: J
  - Map: M
  - Wait/Skip Turn: Space
  - Quick Slots: 1-9 (potions, abilities, items)
  - Cancel/Back: Escape
  - All keys remappable in settings
- **Touch Controls** (mobile):
  - D-pad overlay: semi-transparent directional buttons (bottom-left)
  - Action button: interact/attack (bottom-right)
  - Tap on tiles: move toward tapped location (pathfinding)
  - Swipe gestures: swipe up = inventory, swipe down = character sheet, swipe left = journal
  - Long press: examine tile (shows tooltip with tile info)
  - Pinch zoom: zoom in/out on the ASCII map
  - Touch controls auto-appear on touch devices; hidden on desktop
- **Gamepad Controls**:
  - Left stick/D-pad: movement
  - A/Cross: interact/confirm
  - B/Circle: cancel/back
  - X/Square: attack/use selected ability
  - Y/Triangle: inventory
  - Bumpers: cycle through quick slots
  - Triggers: cycle through menus
  - Start: pause menu
  - Select: map
  - Vibration feedback on hits, crits, and damage taken
- **Accessibility Controls**: one-handed mode (all actions on one side), switch access, customizable hold vs tap, adjustable input timing
- **Control Hints**: on-screen button prompts auto-switch between keyboard/touch/gamepad icons based on last input used

## Acceptance Criteria

- [ ] Keyboard controls work with full remapping support
- [ ] Touch controls are responsive with correct gesture recognition
- [ ] Gamepad controls work with all standard layouts
- [ ] Control hints update based on active input method
- [ ] Accessibility control options function correctly
