# Changelog

All notable changes to `confettiFX` will be documented in this file.

## [1.3.0] - 2026-03-06

### Added
- Command API via `$.fn.confettiFX()` with `start`, `stop`, and `destroy`.
- New cleanup alias `$.fn.clearConfettiFX()`.
- `mode: "burst"` with `originX` and `originY`.
- Presets support via `preset` (`party`, `snow`, `fireworks`).
- Auto-cleanup by `duration` in milliseconds.

### Improved
- Main path animation now uses `transform: translate3d(...)` for better rendering performance.

## [1.2.0] - 2026-03-06

### Added
- Standalone plugin extraction to `js/jquery.confettiFX.js` with `$.fn.generateConfetti` and `$.fn.clearConfetti`.
- Demo page in `index.html`.
- Documentation in `README.md`.
- Distinct static-image selection across active pieces when possible.
- Per-piece anti-repeat image logic (avoid same image on consecutive cycles).
- Per-iteration randomized trajectory (start/end positions) and path refresh on `animationiteration`.

### Improved
- Better behavior for image arrays where `confettiCount` is lower than image count.
- More natural motion by recalculating trajectory each loop.

## [1.1.0] - 2025-11-08

### Added
- Extended trajectory and rotation controls (`startRotation`, `endRotation`, `rotationStart`).
- Support for frame-based image animation (`animateFrames`, `frameInterval`, `randomFrameStart`).
- Blink/twinkle effects (`blink`, `blinkInterval`, `blinkProbability`, `blinkCooldownTicks`).

### Improved
- Configurable movement modes and directional behavior.
- Fade timing controls with `fadeStart` and `fadeDuration`.

## [1.0.0] - 2024-11-17

### Added
- Initial release of custom confetti generator.
- Icon and image support.
- Spin controls and base movement directions.
- Cleanup helper via `$.fn.clearConfetti`.
