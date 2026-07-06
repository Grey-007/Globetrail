# GlobeTrail: Unified Development Workflow & Quality Checklist

This document defines the permanent development workflow, engineering lifecycle, quality-assurance guidelines, and architectural compliance rules for **GlobeTrail**. As the lead architect and engineer, you must adhere strictly to these processes on every turn, refactoring cycle, and milestone execution.

---

## 1. Core Development Philosophy

GlobeTrail is built using **highly disciplined, incremental engineering**. We value pristine code quality, performance budget integrity, and predictable execution over rapid, unvetted feature volume.

### 1.1 Incremental Milestone Isolation
*   **Single-Milestone Scope:** Implement exactly one milestone or phase at a time. Never work on future phases, placeholder modules, or unrequested features prematurely.
*   **Atomic Deliverability:** Each completed milestone must leave the codebase in a production-ready, fully compiling state with zero analyzer warnings or warnings.
*   **Isolation of Scope:** Never modify unrelated files or introduce "quick hacks" outside the active milestone's feature boundaries.

---

## 2. Pre-Milestone Initialization Phase

Before initiating any development cycle, writing any code, or altering schemas, the AI Architect must present a highly structured plan and wait for explicit developer approval.

### 2.1 The Planning Template
For every development phase, provide a clear, technical outline structured as follows:

1.  **Core Goal:** A concise, singular statement of what the milestone achieves.
2.  **Implementation Rationale:** Why this milestone is needed now and how it fits the architecture.
3.  **Files to Create:** A complete list of target paths.
4.  **Files to Modify:** An explicit checklist of existing code to update.
5.  **External Dependencies:** Any new libraries or platform configurations.
6.  **Architectural Risks & Mitigations:** Known edge cases, layout constraints, or performance bottlenecks.
7.  **Expected Outcome:** A brief description of the functional, testable output.

---

## 3. Active Development Cycle Rules

### 3.1 Strict Feature Isolation
*   **Preserve Boundaries:** Keep features decoupled. Never allow UI presentation files from one feature to import state or domain models from another unrelated feature without routing via established repositories.
*   **No Unfinished Features:** Never check in partial or disabled features with "TODO" or placeholder flags unless they are part of the active milestone's structured scope.
*   **Minimalist Scope:** Implement strictly what is defined in the Product Specification and Design Guidelines. Do not add unrequested visual details, diagnostic tools, or settings sliders.

### 3.2 Immutability & Clean State Flow
*   **State Decoupling:** Keep business logic completely pure and separate from the UI layer. Ensure UI widgets only listen to state transitions and emit intent events.
*   **Data Immutability:** Models and Entities must use immutable definitions (`@immutable` with `final` fields) to protect the application state from side-effects.

---

## 4. Post-Milestone Verification & Self-Review

Upon completing code edits for an active milestone, the engineer must perform a comprehensive self-review of the entire affected surface area before declaring the task complete.

### 4.1 Evaluation Areas
*   **Architecture Compliance:** Are the Presentation, Domain, and Data layer boundaries fully respected? Are dependencies pointing inwards?
*   **Code Cleanliness:** Is there any duplicated business logic or boilerplate UI code? Are functions small, focused, and single-responsibility?
*   **UI Precision:** Does the layout match the Design Guidelines (AMOLED contrast, Inter/Space Grotesk typography, 8pt spacing scale)? Are touch targets comfortable?
*   **Performance Budget:** Are all stream subscriptions, controllers, and custom painter canvases cleanly disposed of to prevent memory leaks? Are widget trees optimized to avoid redundant rebuilding?
*   **Edge Case Handling:** Are empty lists, network drops, and corrupt data imports handled gracefully with clear visual indicators?

---

## 5. Milestone Completion Checklist

A milestone is considered officially complete **only** when it passes every check in this quality gate:

- [ ] **Clean Build:** The application compiles and runs without errors or crashes.
- [ ] **Analyzer Compliance:** The Dart analyzer returns zero warnings or info messages (`flutter analyze`).
- [ ] **Visual Review:** Screen layouts are verified across mobile and tablet screen boundaries.
- [ ] **Zero Logic Duplication:** Repeating logic is extracted into shared core utilities or services.
- [ ] **Documentation Sync:** All architectural changes, schemas, or new features are fully updated in `ROADMAP.md`, `PRODUCT_SPEC.md`, `DATABASE_DESIGN.md`, and `CHANGELOG.md`.
- [ ] **Git Alignment:** A clear semantic commit message and summary of changes are provided.

---

## 6. Debugging & Refactoring Protocols

### 6.1 Debugging Protocol
When resolving errors, bugs, or regression failures, follow this structured process:
1.  **Analyze & Root-Cause:** Identify the exact file, line, and operational context causing the failure.
2.  **Explain the Issue:** Describe why the bug occurred, focusing on architectural patterns.
3.  **Propose Solutions:** Offer at least two different ways to fix the issue.
4.  **Recommend the Best Approach:** Select the optimal solution based on performance, clean architecture, and maintainability.
5.  **Implement Fix:** Write the targeted, verified fix only after confirmation.

### 6.2 Refactoring Protocols
*   **Strict Scope:** Never refactor unrelated code simply because it is in your workspace.
*   **Justify First:** If refactoring is necessary to unblock the active milestone, explain:
    *   *Why the current design is insufficient.*
    *   *The exact architectural and performance benefits of the refactor.*
    *   *The full list of affected files and dependencies.*
    *   *The risk level and regression prevention plans.*

---

## 7. Version Control & Git Guidelines

Every completed milestone or task must finish with a structured summary block containing:

1.  **Suggested Commit Message:** Following Semantic Commit specifications:
    *   `feat(home): add interactive collapsible country accordion list`
    *   `fix(theme): resolve AMOLED contrast colors on settings sheet`
    *   `perf(globe): optimize spherical coordinate projections`
2.  **Summary of Changes:** A high-level description of what has been accomplished.
3.  **Created Files:** List of newly added paths.
4.  **Modified Files:** List of changed paths.
