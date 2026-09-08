# CHANGELOG

All notable changes, architectural milestones, and UI Kit versions will be documented here.

## [UI Kit v0.1.2-fullscreen] - 2026-09-08

### Full-Screen Viewport Architecture
- **Converted `/ui-kit` to Edge-to-Edge Desktop Web Layout (`100vw × 100vh`)**:
  - Eliminated artificial centered card container and outer margins that caused "window-in-a-window" nesting.
  - Introduced standard 44px top application bar with macOS traffic lights (🔴 🟡 🟢) and audio toggle.
  - Implemented 2-panel desktop split layout:
    - **Left Navigation Rail (220px)**: Quick anchor navigation to all UI Kit categories with active states.
    - **Main Canvas (`flex-1`)**: Wide, edge-to-edge scroll area utilizing the user's full PC monitor resolution.
- Verified TypeScript strict typecheck (0 errors) and live server response (HTTP 200).
