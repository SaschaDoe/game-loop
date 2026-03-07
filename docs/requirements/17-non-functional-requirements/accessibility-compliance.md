# Accessibility Compliance

As a player with disabilities, I want the game to meet accessibility standards, so that it is playable by the widest possible audience.

## Details

- Target: WCAG 2.1 Level AA compliance where applicable to game content
- Color contrast ratios: minimum 4.5:1 for normal text, 3:1 for large text
- All interactive elements are keyboard-accessible (inherent in ASCII roguelike)
- Screen reader: ARIA labels on all UI regions, live regions for game messages
- Focus management: visible focus indicators, logical tab order
- Reduced motion: respect `prefers-reduced-motion` OS setting
- Text scaling: game UI scales with browser font size settings (up to 200%)
- No time-dependent actions that can't be paused (turn-based inherently supports this)
- Colorblind-safe: all information conveyed by color is also conveyed by shape/symbol

## Non-Functional Targets

- Lighthouse Accessibility score >= 90
- Zero critical WCAG 2.1 AA violations
- Playable with screen reader + keyboard only

## Acceptance Criteria

- [ ] Color contrast meets WCAG 2.1 AA ratios
- [ ] Screen reader can narrate game state and actions
- [ ] `prefers-reduced-motion` disables animations
- [ ] All game info is accessible without relying solely on color
