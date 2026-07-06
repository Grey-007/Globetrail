# GlobeTrail: Product Specification Document (V1.0)

This document defines the complete product specifications, user workflows, interface architectures, and core requirements for **GlobeTrail**. This specification serves as the ground-truth guide for engineering, design, and QA teams.

---

## 1. Project Overview

### 1.1 Purpose
GlobeTrail is a premium, highly polished personal travel journal and world diary designed for travel enthusiasts, explorers, and minimalists. Instead of traditional travel planners focused on calendar schedules, transport logistics, and busy itineraries, GlobeTrail shifts the focus to **long-term place collection, geographical journaling, and emotional mapping**. 

### 1.2 Target Audience
*   **Aesthetic Seekers:** Users who appreciate premium typography, deep contrast ratios, and deliberate, lightweight software.
*   **Frequent Travelers & Dreamers:** Individuals keeping record of places they have been and curation lists of where they want to go.
*   **Privacy-First Users:** Explorers who prefer localized databases over unrequested cloud synchronizations.

---

## 2. Core Principles & Philosophy

*   **Offline-First & Local Sovereignty:** User data is private. Every entry is created, structured, and queried directly on the device. Syncing is strictly opt-in and secondary.
*   **AMOLED Optimization:** Defaulting to a true pitch-black state (`#000000`). Border rules, elevation guides, and divider rules utilize fine grey accents (`#222222`) rather than drop shadows.
*   **One-Hand Ergonomics:** Navigation elements, actions, and sheet prompts are kept within thumb reach in the bottom half of the display.
*   **Architectural Cleanliness:** Uncompromised separation of concerns using Clean Architecture (Presentation, Domain, Data) and a Feature-First modular folder layout.
*   **Performant Custom Rendering:** High frame-rate calculations. The core 3D Globe uses direct projection mapping calculations, maintaining 60+ FPS on mid-tier mobile hardware.

---

## 3. Global Navigation Layout

GlobeTrail implements a highly responsive **Persistent Bottom Navigation** shell. Tab states are preserved on switch, ensuring that returning to a tab places the user exactly where they left off.

```
+-----------------------------------------------------------+
|                                                           |
|                       Active Screen                       |
|                                                           |
+-----------------------------------------------------------+
| [=] Home  |  (O) Globe  |  [Q] Search  |  [%] Stats  | [*] |
+-----------------------------------------------------------+
```

### Navigation Tabs
1.  **Home:** Grouped accordion country list. The operational control center.
2.  **Globe:** The visual interactive showcase. Spherical orthographic projection displaying coordinate-pinned flags.
3.  **Search:** Quick lookup console for world coordinates, cities, and landmarks.
4.  **Statistics:** Dynamic typographic dashboards showing achievements, completion levels, and country coverage.
5.  **Settings:** Global configurations for customization, custom accent color changes, backups, and data imports.

---

## 4. Screen Specifications

---

### 4.1 Home Screen (The Curation Hub)

The Home screen acts as the operational base. It displays saved items grouped neatly within collapsible country accordions instead of a scattered, unorganized list.

#### 4.1.1 User Interface Structure
*   **Header Bar:**
    *   Dynamic greeting title (e.g., *"My World Journal"*).
    *   Search shortcut icon (jumps to the Search Tab).
    *   Refined Filter menu (All, Visited, Wishlist, Priority).
*   **The Accordion List:**
    *   Countries are sorted alphabetically or by the count of saved places.
    *   Header tile displays the country's emoji flag, name, and total count: `🇯🇵 Japan (6)` or `🇳🇴 Norway (3)`.
    *   Tapping the header triggers a smooth accordion slide expansion.
*   **Place Cards (Child Items):**
    *   Compact container with light grey border (`#222222`).
    *   Place Name with elegant display typography.
    *   Status indicator chip: `Visited` (Colored accent) or `Wishlist` (Subtle grey).
    *   Visual priority indicators (e.g., small color-coded dots representing High/Medium/Low).
    *   Favorite star icon.
    *   Tags (e.g., `Beach`, `Historical`, `Hiking`).

#### 4.1.2 Interactions & Gestures
*   **Tap:** Smooth transition slide to the Place Details screen.
*   **Long-Press Action Menu:** Triggers a bottom-sheet action overlay with quick shortcuts:
    *   *Edit Place*
    *   *Delete Place (with Undo option)*
    *   *Move to Country*
    *   *Toggle Favorite Status*
    *   *Share Details*
*   **Swipe Gestures:**
    *   *Swipe Left-to-Right:* Fast toggle of the Visit status (shifts between Visited and Wishlist).
    *   *Swipe Right-to-Left:* Instantly deletes place (with a transient snackbar "Undo" button).
*   **Floating Action Button (FAB):** Highly accessible, centered/bottom-right button to "Add Place" manually.

---

### 4.2 Globe Screen (The Interactive Visualizer)

A minimalist, high-framerate, true vector 3D Earth projection showing pinned destinations as interactive flags.

#### 4.2.1 Core Capabilities
*   **3D Camera Coordinates:** Orthographic projection translating geographic coordinates $(Latitude, Longitude)$ to 3D Cartesian coordinates $(x, y, z)$ on a spherical custom painter canvas.
*   **Touch Gestures:**
    *   *Single-finger Drag:* Rotates the Globe smoothly across pitch, yaw, and roll axes.
    *   *Fling:* Adds momentum to rotation, decaying naturally via friction.
    *   *Two-finger Pinch:* Dynamic zoom level control.
*   **Occlusion & Depth Culling:**
    *   Pins on the backside of the sphere must be calculated as occluded and dynamically hidden to prevent overlapping wireframe clutter.
*   **Pin Interaction:**
    *   Each pin appears as a stylized vector dot or flag.
    *   Tapping a pin brings up a compact floating card at the bottom of the screen.
    *   The camera automatically performs a smooth fly-to transition, rotating and zooming the globe to center on the selected pin.
*   **Dynamic Filters:**
    *   Floating filter bubbles allow filtering pins on the globe by **Country**, **Status (Visited/Wishlist)**, **Tags**, or **Favorites**.

---

### 4.3 Search Screen (Geographical Ingestion)

The ingestion engine to discover and resolve global coordinates cleanly.

#### 4.3.1 Capabilities
*   **Input Field:** Instant, non-blocking search bar with clean "Clear" button.
*   **Categories Quick-Filters:** Fast selection chips: `Cities`, `Beaches`, `Mountains`, `Museums`, `Parks`, `Historic`.
*   **Autocomplete Results:**
    *   Presents a list of matching geographical objects.
    *   Each row lists the primary name, secondary region/state, parent country, and visual coordinate preview (e.g., `Mt. Fuji, Shizuoka Prefecture, Japan`).
*   **Quick Add Action:**
    *   Tapping the `+` action button resolves the details, identifies the parent country, inserts it into the local database under the appropriate accordion, and updates the state.

---

### 4.4 Place Details Screen (The Diary)

The immersive, journal-style detailed viewer for any saved geographical point.

#### 4.4.1 Fields & Layout
*   **Hero Image Gallery:**
    *   Horizontal image picker scroller with parallax scrolling.
    *   Tapping an image opens a true-black fullscreen immersive lightbox view.
*   **Place Headers:**
    *   Dynamic Name, Parent Country, and exact GPS Coordinates.
    *   Map preview card displaying localized mapping context.
*   **Journal Sections:**
    *   *Visit Status:* Visited (with Visit Date) or Wishlist (with Planned Date).
    *   *Personal Memories:* Elegant rich-text editor for notes, logs, and travel thoughts.
    *   *Tags Carousel:* Expandable array of categories (`#nature`, `#cities`, `#culinary`).
    *   *Priority Level:* Color-coded selectors (Sage, Slate, Coral) indicating value weights.
    *   *Personal Rating:* Minimalist star or numeric slider evaluation system.

---

### 4.5 Statistics Screen (Metrics Dashboard)

A rewarding typographic log breaking down exploration metrics to celebrate travel achievements.

#### 4.5.1 Metric Outputs
*   **Typographic Summary Board:**
    *   Total Places Saved | Visited Count | Wishlist Count.
    *   Global Completion Percentage (Visited vs. Total).
*   **Geographical Breakdown:**
    *   Unique Countries Visited.
    *   Unique Continents Explored (visualized via a clean custom circular graph).
*   **Categorical Analytics:**
    *   Top tags visited (e.g., "70% of your saved places are National Parks").
    *   A clean typographic timeline showing month-by-month visit trends.

---

### 4.6 Settings Screen (Customization & Backups)

The configuration engine where users customize their themes, accent colors, and manage data portability.

#### 4.6.1 Features & Controls
*   **Theme Engine Tuning:**
    *   *System Mode:* Follow System, Light Mode, Dark Mode.
    *   *AMOLED Mode Toggle:* Swaps background between absolute `#000000` (True Black) and `#121212` (Slate Charcoal Gray).
    *   *Accent Selector:* Swaps primary color-accents instantaneously app-wide:
        *   `Steel Gray` (`#8E8E93`) [Default]
        *   `Ice Blue` (`#A1C4FD`)
        *   `Sage` (`#8FBC8F`)
        *   `Coral` (`#FF7F50`)
        *   `Teal` (`#008080`)
*   **Data Portability (Import/Export):**
    *   *Export Backup:* Bundles Isar local tables into a highly portable, validated JSON payload, saving it via native share sheets.
    *   *Import Backup:* Restores files from a chosen JSON payload, validating structures before writing to database.
*   **About Section:** Minimalist app credits and version details.

---

## 5. Visual Theme & Style Specification

The visual language of GlobeTrail is strictly controlled to maintain a highly premium, clean aesthetic.

### 5.1 Color Tokens
| Name | Hex Value | Purpose |
| :--- | :--- | :--- |
| **Canvas Black** | `#000000` | Core background when AMOLED mode is active |
| **Slate Gray** | `#121212` | Core background when AMOLED mode is inactive |
| **Fine Border** | `#222222` | Separator line rule, card borders, list dividers |
| **Interactive Gray** | `#8E8E93` | Default primary interactive accent color |
| **Muted Text** | `#666666` | Secondary body text, coordinate displays, dates |
| **Bright Text** | `#FFFFFF` | Primary headers, place names, active buttons |

---

## 6. Micro-Animations & Transitions

Motion in GlobeTrail is highly intentional. Animations guide focus and provide immediate interactive feedback rather than causing visual noise.

*   **Accordion Toggle:** Fine-tuned vertical slide transitions using `motion` spring dynamics.
*   **Tab Navigation:** Fade-through routing effects, keeping the navigation bar anchored while screen content changes smoothly.
*   **Globe Fly-To Camera Spin:** Smooth interpolation (Slerp) rotating spherical coordinates to target vectors with ease-out acceleration.
*   **Add Place Flow:** A bottom-sheet sliding up from the bottom boundary with a subtle content fade-in.

---

## 7. Product Release Plan (MVP Scope)

To ensure high-quality standards and prevent scope creep, the application is prioritized into a strictly constrained MVP, followed by incremental updates.

### 7.1 MVP Features (V1.0 Focus)
*   **Clean Core Architecture:** DI (`get_it`), Router (`go_router`), State Management (`flutter_bloc`), Persistence (`Isar`).
*   **Centralized AMOLED Theme System:** Dynamic custom accent switching and AMOLED toggle.
*   **Compact Home Screen:** Grouped countries list, collapsible country accordions, place cards with favorite stars.
*   **Basic Place Manager:** Manual bottom-sheet entry form for coordinates, place names, and countries.
*   **Core 3D Vector Globe:** Touch-responsive custom painter sphere with basic pinned flags, zoom, and culling.
*   **Minimalist Statistics Screen:** Visited and Wishlist metrics tracker.
*   **Validated Import/Export Backup Engine:** JSON-based data backups.

### 7.2 Post-MVP Roadmap (Future Versions)
*   **Media Gallery Integrations (V1.1):** Local photo uploads and parallax lightbox view.
*   **Search Autocomplete (V1.2):** Full geocoding API lookup and coordinate autofill.
*   **Social & Collaborative Lists (V1.5):** Encrypted list sharing and friend activity streams.
*   **AI Recommendations (V2.0):** Lightweight offline-first travel curation helpers and automated tagging.
