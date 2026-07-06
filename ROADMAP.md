# GlobeTrail: Production-Ready Development Roadmap & System Architecture

This document serves as the master architectural specification and phased development blueprint for **GlobeTrail**, a minimalist, offline-first travel planning and exploration companion. 

---

## Part 1: High-Level System Architecture & Design Philosophy

GlobeTrail is engineered using **Clean Architecture** principles combined with a **Feature-First (Modular) structure** in Flutter. This maintains modularity, ensures high testability, and supports rapid iteration without introducing regression risks in existing modules.

```
                         ┌───────────────────────────────────┐
                         │         Presentation Layer        │
                         │ (UI Screens, Widgets, State/BLoC) │
                         └─────────────────┬─────────────────┘
                                           │ (Depends on Domain)
                                           ▼
                         ┌───────────────────────────────────┐
                         │            Domain Layer           │
                         │ (Entities, Use Cases, Repositories│
                         │             Interfaces)           │
                         └─────────────────▲─────────────────┘
                                           │ (Implemented by Data)
                                           │
                         ┌─────────────────┴─────────────────┘
                         │             Data Layer            │
                         │ (Models, Repositories Impl, API/  │
                         │    Local Database Data Sources)   │
                         └───────────────────────────────────┘
```

### 1. Architectural Layers (Clean Architecture)
*   **Domain Layer (Core & Pure Dart):** Contains the business logic, entities (pure data structures), and repository interfaces. This layer is entirely independent of any external packages, database SDKs, or UI frameworks.
*   **Data Layer:** Implements repository interfaces defined in the Domain layer. It coordinates data flow between local persistence databases (Isar/Drift) and remote geolocation search services (API Clients). It handles serialization/deserialization via Models extending Domain Entities.
*   **Presentation Layer (Flutter-Dependent):** Handles rendering the UI and reactive state-management. It is composed of Screens, highly reusable Widgets, and State Controllers (BLoC or Riverpod Providers) that listen to UI events and execute Domain Use Cases.

### 2. Folder Structure (Feature-First Core)
To keep the codebase maintainable as it scales to dozens of screens, code is grouped by **feature** rather than by layer. Global utilities and core shared classes reside in a `core/` folder.

```
lib/
├── core/
│   ├── theme/
│   │   ├── app_theme.dart          # Core ThemeData builder
│   │   ├── theme_cubit.dart         # Theme State Controller
│   │   └── theme_state.dart         # Current theme properties (AMOLED, Custom Accent)
│   ├── database/
│   │   ├── local_database.dart      # Database initialization & driver setup
│   │   └── database_helper.dart     # Query wrappers
│   ├── navigation/
│   │   └── app_router.dart          # Declarative Routing system (go_router)
│   └── utils/
│       └── coordinate_helper.dart   # Geolocation & math helpers
├── features/
│   ├── home/                        # Grouped list of places by country
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   └── repositories/
│   │   ├── data/
│   │   │   ├── datasources/
│   │   │   └── repositories/
│   │   └── presentation/
│   │       ├── cubit/
│   │       └── screens/
│   ├── search/                      # Location auto-complete and search
│   │   ├── domain/
│   │   ├── data/
│   │   └── presentation/
│   ├── globe/                       # Interactive 3D Earth and place pinning
│   │   ├── domain/
│   │   ├── data/
│   │   └── presentation/
│   ├── settings/                    # Custom Accents, AMOLED toggles, Backups
│   │   ├── domain/
│   │   ├── data/
│   │   └── presentation/
│   └── statistics/                  # Travel metrics & wishlist indicators
│       ├── domain/
│       ├── data/
│       └── presentation/
└── main.dart                        # Bootstrapper and Provider Scope setup
```

---

## Part 2: Technical Specifications & Recommendations

### 1. State Management Recommendation
*   **Recommendation:** **flutter_bloc (Cubit)**
*   **Rationale:** Perfect for structured state management. Cubits are lightweight and ideal for local-first operations. They offer clear separation of events and state representations (e.g., `PlaceLoading`, `PlaceLoaded`, `PlaceError`), which perfectly mirrors our Clean Architecture boundaries. 

### 2. Local Database Recommendation
*   **Recommendation:** **Isar Database (NoSQL)**
*   **Rationale:** Isar is ultra-fast, tailored specifically for Flutter, and supports type-safe queries, complex embedded objects, links (relations between Country and Place), and asynchronous indexing. It handles local data queries efficiently without the boilerplate of raw SQL.

### 3. Map and 3D Globe Implementation Options
To achieve an elegant, interactive 3D Earth within a minimalist, low-power interface, three options are proposed:
*   **Option A (Native WebGL via flutter_gl & three_dart):** High rendering control but increases app bundle size and carries higher rendering complexity.
*   **Option B (Custom CustomPainter Sphere projection):** A custom canvas rendering option. By mapping 3D spherical coordinates $(x, y, z)$ to 2D screen coordinates with depth testing and orthographic projection, we can create a lightweight, highly responsive, true vector 3D spinning globe. Best for AMOLED, minimalist line-art designs with absolute performance efficiency.
*   **Option C (Flutter Mapbox / Maplibre with Globe Projection):** Full vector mapping capabilities, but requires API access keys and increases resource usage.
*   **Selected Strategy:** **Option B (Custom Canvas Orthographic Projection Vector Globe)** for the core MVP due to its visual alignment with the minimalist true AMOLED aesthetic, followed by **Option A** fallback for high-fidelity rendering if 3D texture mapping is required later.

---

## Part 3: Centralized Minimalist Theme System

```
┌──────────────────────────────────────────────────────────────────────────┐
│                             SETTINGS CONTROLLER                          │
│                      (ThemeCubit / RiverpodNotifier)                     │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │ Emits updated Configuration
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                            APP CUSTOM THEME                              │
│ - AMOLED Canvas: True Black (#000000) or Slate Dark Gray (#121212)      │
│ - Accent Color: Configurable (Steel Gray, Ice Blue, Sage, Amber, Coral)  │
│ - Surface Accents: Elevated Slate (#181818), Fine Borders (#2A2A2A)      │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │ Injected via Material Theme Extensions
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                             UI COMPONENTS                                │
│                     (Rebuilds Reactively in Real Time)                   │
└──────────────────────────────────────────────────────────────────────────┘
```

The system ensures that changing settings propagates instant updates app-wide without full restarts:
*   **AMOLED True Black:** `#000000` base, avoiding light-gray halos. Surfaces are separated using thin border rules (`#222222`) rather than drop shadows.
*   **Dynamic Accent Shifting:** Colors like **Steel Gray** (`#8E8E93`), **Ice Blue** (`#A1C4FD`), **Sage** (`#8FBC8F`), and **Teal** (`#008080`) are injectable into the core theme context.

---

## Part 4: High-Density Development Phases

---

### Phase 0: Architecture, Shell, & Centralized Theme System
*   **Goal:** Establish the type-safe project baseline, dependency injection tree, routing layout, and custom AMOLED-compliant theme architecture.
*   **Features:**
    *   System Theme configuration state.
    *   State-driven declarative routing structure.
    *   Dependency injection containers using `get_it`.
*   **Files to Create:**
    *   `lib/main.dart` - Entry point and bootstrapping.
    *   `lib/core/theme/app_theme.dart` - Material 3 `ThemeData` builder.
    *   `lib/core/theme/theme_cubit.dart` & `theme_state.dart` - Reactively controls colors, dark-mode, and AMOLED toggle.
    *   `lib/core/navigation/app_router.dart` - `go_router` router configurations.
    *   `lib/core/di/injection.dart` - Global dependency container setup.
*   **Dependencies:** `flutter_bloc`, `get_it`, `go_router`, `shared_preferences` (for storing user theme preferences).
*   **Acceptance Criteria:**
    *   App boots to a blank screen matching the requested AMOLED Black background (`#000000`).
    *   Dynamic Accent selector switches colors across components instantaneously without UI lag or flash.
*   **Risks:** Complex initial boilerplate of DI may slow down immediate visual output.
*   **Estimated Complexity:** 3 Story Points (Low/Medium)

---

### Phase 1: Bottom Navigation & Application Shell
*   **Goal:** Construct the skeletal layout of the app using a bottom bar containing Home, Globe, and Settings views.
*   **Features:**
    *   System Navigation Shell with animated slide-transitions between main views.
    *   Dynamic Navigation Bar with customizable indicators.
    *   Responsive layouts that adapt gracefully to varying mobile screen sizes.
*   **Files to Create:**
    *   `lib/features/shell/presentation/screens/app_shell.dart` - Hosts bottom bar and routes views.
    *   `lib/features/home/presentation/screens/home_screen.dart` - Place list scaffold.
    *   `lib/features/settings/presentation/screens/settings_screen.dart` - Setting controls UI.
    *   `lib/features/globe/presentation/screens/globe_screen.dart` - 3D render placeholder.
*   **Dependencies:** `motion`, `lucide_react` (or `flutter_feather_icons`).
*   **Acceptance Criteria:**
    *   Smooth transitions between Home, Globe, and Settings.
    *   Bottom navigation bar maintains a clean visual style with a solid border rather than a blurred shadow.
*   **Risks:** Ensuring route changes don't lose the underlying screen state. Resolved using `StatefulShellRoute` in GoRouter.
*   **Estimated Complexity:** 2 Story Points (Low)

---

### Phase 2: Country Management & Core Data Layer
*   **Goal:** Establish data structures and domain entities for grouping saved places under their respective countries.
*   **Features:**
    *   Model definitions for Countries and Places with strong validation rules.
    *   State management layers to load countries.
    *   Accordion list layout (Expand/Collapse) for Country buckets on the Home Screen.
*   **Files to Create:**
    *   `lib/features/home/domain/entities/country.dart` - Country business entity.
    *   `lib/features/home/domain/entities/place.dart` - Place business entity.
    *   `lib/features/home/presentation/widgets/country_accordion_tile.dart` - Expandable list widget.
    *   `lib/features/home/presentation/cubit/home_cubit.dart` - Logic for folding/unfolding countries and displaying places.
*   **Dependencies:** `motion` (for accordion expansion animations).
*   **Acceptance Criteria:**
    *   Home page displays countries grouped correctly with smooth slide/fade animations on expand/collapse.
    *   Empty states elegantly prompt user action.
*   **Risks:** Handling high-density accordion lists efficiently without rendering lag.
*   **Estimated Complexity:** 3 Story Points (Medium)

---

### Phase 3: Place Management & Entry Workflows
*   **Goal:** Design the UI workflows to Add, Edit, and Delete individual saved places within any country container.
*   **Features:**
    *   Bottom-sheet input form for place properties.
    *   Validation logic for geographical input fields.
    *   Interactive swipe-to-delete gesture triggers for fast cleanup.
*   **Files to Create:**
    *   `lib/features/home/presentation/widgets/add_place_sheet.dart` - Dynamic bottom-sheet entry form.
    *   `lib/features/home/presentation/widgets/place_card.dart` - Compact UI item listing a single place.
    *   `lib/features/home/presentation/widgets/delete_confirm_dialog.dart` - Minimal confirmation overlay.
*   **Dependencies:** `motion` (for slide-up sheets and confirmation cues).
*   **Acceptance Criteria:**
    *   Adding a place successfully inserts it under the correct Country bucket.
    *   Swipe-to-delete runs an instant UI removal step with a clean "Undo" action.
*   **Risks:** Accidental double-taps on entries; prevented by form validation safeguards.
*   **Estimated Complexity:** 4 Story Points (Medium)

---

### Phase 4: Offline-First Database Layer (Isar Integration)
*   **Goal:** Implement data persistence by replacing transient in-memory state with a robust, local Isar Database schema.
*   **Features:**
    *   Type-safe local Isar collections with built-in schema generation.
    *   Bi-directional relationships between countries and places.
    *   Reactive database listeners that update UI states automatically on database changes.
*   **Files to Create:**
    *   `lib/core/database/isar_schemas.dart` - Isar collection declarations.
    *   `lib/features/home/data/models/isar_country_model.dart` - DB serialization model.
    *   `lib/features/home/data/models/isar_place_model.dart` - DB serialization model.
    *   `lib/features/home/data/repositories/place_repository_impl.dart` - Coordinates local database operations.
*   **Dependencies:** `isar`, `isar_generator`, `path_provider`.
*   **Acceptance Criteria:**
    *   Application fully preserves saved countries and places across app restarts.
    *   UI components update reactively to database changes without manual triggers.
*   **Risks:** Handling schema migrations as database structure evolves. Mitigation: Establish an explicit migration manager in Isar from start.
*   **Estimated Complexity:** 5 Story Points (High)

---

### Phase 5: Geolocation Search & Address Autocomplete
*   **Goal:** Integrate location lookup to let users search for actual coordinates and save them directly.
*   **Features:**
    *   Reactive geolocation search query builder.
    *   Mock and Production API clients for map services.
    *   Interactive results drawer that maps chosen places to countries.
*   **Files to Create:**
    *   `lib/features/search/domain/repositories/search_repository.dart` - Geocoding contracts.
    *   `lib/features/search/data/repositories/search_repository_impl.dart` - Coordinates API and local checks.
    *   `lib/features/search/presentation/cubit/search_cubit.dart` - Manage search field focus and results.
    *   `lib/features/search/presentation/screens/search_screen.dart` - Main search console UI.
*   **Dependencies:** `http` / `dio` (for calling geocoding API).
*   **Acceptance Criteria:**
    *   Typing queries displays quick matches inside an AMOLED results overlay.
    *   Selecting a result pre-fills coordinates and resolves the correct country automatically.
*   **Risks:** Rate limits or network drops on geocoding APIs. Resolved by debouncing queries and caching recent lookups.
*   **Estimated Complexity:** 4 Story Points (Medium)

---

### Phase 6: Vector 3D Globe Visualization Engine
*   **Goal:** Render an interactive, orthographic projection vector 3D Globe with custom coordinate-pinned indicators.
*   **Features:**
    *   Interactive, touch-responsive 3D canvas mapping geographic points $(Lat, Lon)$ to 3D Cartesian coordinates $(x, y, z)$.
    *   Drag, spin, and fling gestures for intuitive globe rotation.
    *   Smooth visual tracking that flies the camera to a pin when tapped.
*   **Files to Create:**
    *   `lib/features/globe/presentation/widgets/vector_globe_painter.dart` - Extends `CustomPainter` for mathematical sphere rendering.
    *   `lib/features/globe/presentation/widgets/globe_pin_overlay.dart` - Handles input events on 3D coordinates.
    *   `lib/features/globe/presentation/cubit/globe_cubit.dart` - Manages projection math, rotation matrices, and zoom levels.
*   **Dependencies:** `flutter_gl` / `vector_math` / Custom math solvers.
*   **Acceptance Criteria:**
    *   A vector 3D wireframe or shaded globe spins smoothly at 60 FPS in response to drag gestures.
    *   All saved places appear as small pins on the sphere with correct depth-testing (occluded pins hide behind the globe).
*   **Risks:** High CPU usage on complex canvas calculations. Solved by optimizing redraw loops and pre-calculating projections.
*   **Estimated Complexity:** 5 Story Points (High)

---

### Phase 7: Rich Place Properties & Categorization
*   **Goal:** Support deeper categorization by letting users customize place details, notes, tags, and visit statuses.
*   **Features:**
    *   Custom tags and status markers (e.g., "Want to Visit" vs. "Visited").
    *   Priority weights (High, Medium, Low) that change pin sizes on the globe.
    *   Detailed item views for editing custom notes.
*   **Files to Create:**
    *   `lib/features/places/presentation/screens/place_details_screen.dart` - Detailed place editor view.
    *   `lib/features/places/presentation/widgets/priority_selector.dart` - Segmented visual controls.
*   **Dependencies:** None.
*   **Acceptance Criteria:**
    *   Users can categorize places as "Visited" or "Wishlist".
    *   Color-coded tags render beautifully in the country list on the Home screen.
*   **Risks:** Database overhead from growing text notes. Mitigated by using streaming/lazy-loading for long text.
*   **Estimated Complexity:** 3 Story Points (Medium)

---

### Phase 8: Travel Metrics & Analytics Dashboard
*   **Goal:** Give users visual breakdowns of their travel achievements, visited count percentages, and global reach.
*   **Features:**
    *   Travel progress indicator bars showing continent coverage.
    *   Count trackers for visited countries vs. wishlist destinations.
    *   Visual statistics boards using clean typographic charts.
*   **Files to Create:**
    *   `lib/features/statistics/presentation/screens/statistics_screen.dart` - Main analytics console.
    *   `lib/features/statistics/presentation/widgets/metric_card.dart` - Typographic number charts.
    *   `lib/features/statistics/presentation/widgets/continent_progress.dart` - Progress bars.
*   **Dependencies:** `recharts` / `d3` / Canvas-based graph helpers.
*   **Acceptance Criteria:**
    *   Dynamic metrics update instantly as places are toggled to "Visited".
    *   Interactive progress indicators render with smooth entrance animations.
*   **Risks:** Ensuring statistics calculate efficiently on heavy dataset sizes. Caching values speeds up rendering.
*   **Estimated Complexity:** 3 Story Points (Medium)

---

### Phase 9: Media Integrations & Places Gallery
*   **Goal:** Enable users to attach photos directly to saved places, preserving visual memories.
*   **Features:**
    *   Local photo attachments linking directly to Isar records.
    *   Optimized image-caching layers with thumbnail scaling.
    *   AMOLED-style sliding photo gallery overlay.
*   **Files to Create:**
    *   `lib/features/places/presentation/widgets/media_scroller.dart` - Thumbnail grid list.
    *   `lib/features/places/presentation/screens/gallery_viewer.dart` - Immersive image viewer.
*   **Dependencies:** `image_picker`, `path_provider`.
*   **Acceptance Criteria:**
    *   Adding photos works smoothly from both camera and local gallery.
    *   Large media assets load on-demand to prevent stuttering in list views.
*   **Risks:** Storing heavy high-res images locally can quickly exhaust app storage. Solved by auto-downscaling media before saving.
*   **Estimated Complexity:** 4 Story Points (Medium/High)

---

### Phase 10: Import, Export, & Offline Backup Schemes
*   **Goal:** Provide secure, local JSON backup schemes so users can import or export their travel data.
*   **Features:**
    *   Type-safe JSON serialization engine for entire Isar collections.
    *   Local system file sharing integration (Share sheets).
    *   File selection workflows that validate import schemas safely.
*   **Files to Create:**
    *   `lib/core/backup/backup_manager.dart` - Handles file input/output and parsing.
    *   `lib/features/settings/presentation/widgets/backup_row.dart` - UI controls for import/export.
*   **Dependencies:** `share_plus`, `file_picker`.
*   **Acceptance Criteria:**
    *   Exporting saves a highly portable, encrypted/clean JSON file of countries and places.
    *   Importing a backup file updates the database and refreshes the Home list instantaneously.
*   **Risks:** Malformed or corrupt import files crashing the database. Solved by checking schemas before writing to Isar.
*   **Estimated Complexity:** 3 Story Points (Medium)

---

## Part 5: Quality Gates & Acceptance Matrix

```
                      ┌────────────────────────────────────┐
                      │    Continuous Integration Check    │
                      │  (Dart Analyzer & strict Linter)   │
                      └─────────────────┬──────────────────┘
                                        │ PASSES
                                        ▼
                      ┌────────────────────────────────────┐
                      │       Unit & Repository Tests      │
                      │  (100% Core Business Logic Rules)  │
                      └─────────────────┬──────────────────┘
                                        │ PASSES
                                        ▼
                      ┌────────────────────────────────────┐
                      │        Widget & State Tests        │
                      │   (Verifying UI theme triggers)    │
                      └─────────────────┬──────────────────┘
                                        │ PASSES
                                        ▼
                      ┌────────────────────────────────────┐
                      │      COMPILER PRODUCTION READY     │
                      └────────────────────────────────────┘
```

Each completed Phase must satisfy these strict quality requirements:
1.  **Strict Lint Checks:** Zero warnings or info messages under `flutter analyze` with `package:flutter_lints` enabled.
2.  **Test Driven Coverage:** Core domain entities and use cases must maintain high test coverage before landing in production.
3.  **Performance Budgets:** Bottom bar navigation switches and Accordion lists must run at a smooth 60 FPS under normal conditions.
4.  **Leak Prevention:** Dispose all canvas controllers and stream subscriptions inside UI lifecycles.
