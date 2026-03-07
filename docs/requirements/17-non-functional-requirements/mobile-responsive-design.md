# Mobile Responsive Design

As a player on a phone, I want the game to be fully playable on mobile screen sizes without lag or layout issues, so that I can play anywhere on any device.

## Details

- Responsive layout that adapts from 320px to 2560px viewport width
- Mobile breakpoints:
  - Small phone (320-375px): compact HUD, smaller font, reduced map viewport
  - Phone (376-428px): standard mobile layout
  - Tablet (429-1024px): expanded layout with side panels
  - Desktop (1025px+): full layout with all panels visible
- ASCII map scales font size to fit the viewport while remaining readable
- Touch controls for mobile: on-screen D-pad or swipe gestures for movement
- Tap on enemies/NPCs for context actions (attack, talk)
- No horizontal scrolling; everything fits within the viewport
- Virtual keyboard for LLM dialogue input doesn't obscure the game
- Pinch-to-zoom disabled (use in-game zoom controls instead)

## Non-Functional Targets

- Layout shift (CLS) < 0.1 on all screen sizes
- No content overflow or clipping on any supported viewport
- Touch targets minimum 44x44px (WCAG guideline)

## Acceptance Criteria

- [ ] Game is playable on a 320px wide screen
- [ ] Touch controls are functional and intuitive
- [ ] No horizontal scroll on any viewport size
- [ ] Virtual keyboard doesn't break the layout
