# GlobeTrail: Unified UI/UX Design System & Guidelines

This document establishes the permanent, production-ready visual design system, interaction language, and layout rules for **GlobeTrail**. Engineered to feel calm, timeless, and meticulously crafted, the design integrates elements of **Nothing OS** (typographic purity), **Apple Journal** (spacious breathing room), **Notion** (uncluttered layout structure), and **Samsung One UI** (ergonomic one-hand focus).

---

## 1. Design Philosophy: The Aesthetic of Calm

Every visual element in GlobeTrail must justify its existence. The UI acts as a silent gallery frame designed to elevate the user's personal travel logs, notes, and geographical memories rather than demanding attention with heavy decorations or colorful gradients.

### Core Tenets
*   **Acoustic Quietness:** Avoid visual noise. No unrequested status logs, telemetry indicators, shadow halos, or visual clutter.
*   **Generous Negative Space:** Provide wide padding and margins to create a comfortable rhythm. White (or black) space is an active design choice.
*   **Ergonomic Comfort:** Actions, interactive lists, and navigation triggers reside in the bottom two-thirds of the screen, ensuring easy one-hand usage on tall modern displays.
*   **Impeccable Typography:** Establish clear visual hierarchy using precise size pairings, light tracking, and spacious line-heights.

---

## 2. Dynamic AMOLED Color System

GlobeTrail is designed with an **AMOLED-First** mindset, ensuring absolute contrast, eye safety in low light, and maximum power efficiency on modern OLED displays.

### 2.1 Base Canvas Tone (AMOLED Mode Toggle)
*   **AMOLED Enabled (Default):** Pitch-black canvas (`#000000`). Cards, sheets, and interactive surfaces are distinguished by razor-thin border outlines (`#222222`) rather than drop shadows.
*   **AMOLED Disabled:** Deep charcoal slate gray canvas (`#121212`). Surfaces use subtle gray variants (`#1A1A1A`) with soft, high-diffusion, zero-spread shadows.

### 2.2 Color Token Registry
| Token Name | Hex Value | CSS Custom Property | Primary Application |
| :--- | :--- | :--- | :--- |
| **Canvas Black** | `#000000` | `--color-canvas-black` | True AMOLED black background |
| **Slate Gray** | `#121212` | `--color-slate-gray` | Secondary background option |
| **Card Surface** | `#0A0A0A` | `--color-card-surface` | Default card and dialog background |
| **Fine Border** | `#222222` | `--color-fine-border` | Component outlines, dividers, lists |
| **Neutral Text** | `#FFFFFF` | `--color-text-primary` | High-contrast body, place names, active state |
| **Muted Text** | `#777777` | `--color-text-muted` | Secondary data, dates, notes, descriptions |

### 2.3 Semantic Accents
*   **Success (Visited):** Ice Sage (`#8FBC8F`) — Calm, organic green representing completed journeys.
*   **Warning (Pending):** Warm Amber (`#E6AD12`) — Understated warning indicator.
*   **Error (Delete/Alert):** Soft Coral (`#E06C75`) — Clean red for destructive action states.

### 2.4 Centralized Accent Personalization
Users can change the app's accent color instantly from Settings. The selected accent propagates across all text links, active state chips, active tab icons, custom canvas borders, and primary buttons:

```
[ Steel Gray ]    [ Ice Blue ]    [ Sage Green ]    [ Muted Teal ]    [ Soft Coral ]
   #8E8E93           #A1C4FD          #8FBC8F           #008080           #FF7F50
 (Default MVP)
```

---

## 3. Typographic Hierarchy

GlobeTrail uses clean, geometric Sans-Serif typefaces (e.g., **Inter** or **Space Grotesk**) paired with high-precision Mono typefaces (e.g., **JetBrains Mono**) for geographic coordinates, counts, and system metrics.

```
+-------------------------------------------------------------------------------+
| MY WORLD JOURNAL  <-- Display Heading (Space Grotesk, 24px, Tracking: Tight)  |
|                                                                               |
| 🇯🇵 Japan (6)      <-- Section Title (Inter Bold, 16px, Tracking: Normal)      |
|                                                                               |
| Tokyo             <-- Item Header (Inter Medium, 14px, White)                 |
| 35.6762° N, 139   <-- Data/Code (JetBrains Mono, 11px, Muted Gray)             |
+-------------------------------------------------------------------------------+
```

### Typographic Specifications
*   **Display Heading:** `24px` | Space Grotesk | Medium | Tracking: `-0.02em` | For main app bar titles, large statistics headers, and detail view titles.
*   **Section Header:** `16px` | Inter | Semi-Bold | Tracking: `-0.01em` | For Country accordion bars and large card sections.
*   **Item Title:** `14px` | Inter | Medium | Tracking: `0` | For saved place names and primary menu text.
*   **Body Text:** `14px` | Inter | Regular | Tracking: `+0.01em` | Line Height: `1.5` | For user journal notes, logs, and long descriptions.
*   **Data Caption:** `11px` | JetBrains Mono | Medium | Tracking: `0.02em` | For coordinates, counters, status dates, and technical details.

---

## 4. Spacing, Grid, & Corner Systems

### 4.1 Spacing Scale (8-Point System)
To ensure balanced layout density, all paddings, margins, and gaps follow a strict 8-point multiplier system:
*   **Tiny (4px):** Internal chip spacing, small badge margins.
*   **Small (8px):** Internal element padding inside cards, list spacing.
*   **Medium (16px):** Core margin buffers, padding inside sheets, vertical grid gaps.
*   **Large (24px):** Section-to-section spacing, app bar padding, margins around interactive groups.
*   **Extra Large (32px / 48px):** Top header margins, empty-state illustrations, breathing space.

### 4.2 Corner Radius Consistency
Rounded corners should be consistent across all components to create a unified structural language:
*   `4px` (Very Sharp): Small status tags, notification micro-dots.
*   `8px` (Standard Card): Main saved place list cards, action items.
*   `16px` (Container / Dialog): Expandable country accordion wrappers, dialog popups, search consoles.
*   `24px` (Immersive Sheets): Bottom sheets sliding up from the lower boundary.

---

## 5. UI Elements & Components

### 5.1 Interactive Buttons
All interactive surfaces must react immediately to touch, click, or hover states with subtle visual changes.

```
[    Save Place    ]  <-- Filled Primary (Active Accent Fill, White Text, No Outline)
[  Add Destination  ]  <-- Outlined Secondary (Fine Border #222222, Text Accent)
[      Cancel       ]  <-- Text Link (No Border, Muted Text #777777, Hover White)
```

*   **Filled Primary Button:** Generous padding (`16px x 24px`), custom active accent fill, zero shadows. On touch/click: Scales down slightly (`scale(0.98)`).
*   **Outlined Secondary Button:** Outlined with a fine border (`#222222`). Background is transparent. On hover/click: Fine border shifts to the active accent color.
*   **Floating Action Button (FAB):** Positioned within thumb reach. Features a prominent custom icon. Uses a clean active accent background with a subtle scale transition on scroll.

### 5.2 Card Elements
Cards should feel cohesive and integrated rather than floating arbitrarily above the canvas:
*   **Outline Boundary:** Structured with a thin border outline (`#222222`) against the AMOLED pitch-black background.
*   **Dense Padding:** `16px` padding on all sides of the card content, ensuring clear separation of elements without looking crowded.
*   **Visual Priority Strip:** High-priority cards are highlighted by a subtle color accent border strip along the left edge.

### 5.3 Iconography
*   **Family:** Use **Material Symbols Rounded** or **Lucide Icons** exclusively.
*   **Purpose-Driven:** Only use icons to clarify structural actions (e.g., Star for Favorite, Trash for Delete, Settings for Configurations). Avoid decorative icons that add visual noise.
*   **Color Matching:** Match icon colors with the active accent or muted text tokens depending on their active/inactive states.

---

## 6. Micro-Animations & Interaction Motion

GlobeTrail's motion language is designed to feel crisp, lightweight, and natural. Motion is used to communicate system state and component hierarchy, keeping frame calculations well within the 60+ FPS budget.

*   **Slide-Up sheets:** Transition sheets from `y: 100%` to `y: 0` with a smooth ease-out spring effect.
*   **Accordion Transition:** Smooth height-scaling vertically paired with a subtle fade-in of child elements.
*   **Tab Switching:** Smooth cross-fades between screen states over `150ms`. Avoid layout-shift slides when navigating between main tabs.
*   **Globe Camera Fly-To:** Rotate and zoom coordinates smoothly using spherical linear interpolation (Slerp), easing out gracefully as the target pin centers on the display.

---

## 7. Responsive Adaptability

While GlobeTrail focuses on high-quality mobile usage, layouts adapt gracefully across device configurations.

*   **Mobile (Default):** Bottom navigation controls are optimized for easy, thumb-friendly, one-handed reach. Large lists use full-width single-column cards.
*   **Tablets & Foldables:** Layout structures expand into dual-pane or multi-column grids. The collapsible Country accordion list sits comfortably on the left, while the selected Place details pane displays on the right.
*   **Canvas Boundaries:** The interactive 3D Globe uses a responsive `ResizeObserver` system on its parent container. This ensures the sphere auto-scales to fit available space cleanly on orientation flips or multi-tasking windows.

---

## 8. Permanent UX Commandments

1.  **Strict Contrast Integrity:** Text colors must strictly respect contrast rules against absolute black. Subtitles use `#777777`, never dipping lower to ensure legibility.
2.  **Zero Unrequested Features:** Build exactly what is requested. Avoid adding unrequested focus guides, telemetry logs, or diagnostic terminal logs.
3.  **Graceful Empty States:** When no saved places or countries exist, show an elegant, centralized placeholder graphic (e.g., a simple vector wireframe planet) paired with a clear action prompt to "Add Place".
4.  **Confirm Destructive Actions:** Never delete data without confirming first. Use a clean bottom-sheet or overlay prompt for deleting countries or places.
