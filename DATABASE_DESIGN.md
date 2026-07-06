# GlobeTrail: Production Database Design & Schema Specification (V1.0)

This document establishes the official offline-first database design, entity relationships, migration guidelines, backup architecture, and cloud-synchronization preparation for **GlobeTrail**.

---

## 1. Database Philosophy & Technology Selection

### Selected Database: Isar Database (NoSQL)
For a premium, high-fidelity offline-first application like GlobeTrail, **Isar** is selected as the primary local storage solution. 

#### Rationale for Isar:
1.  **Ultra-Fast Performance:** Isar features asynchronous operations, multi-threading support, and highly optimized query filters that run circles around raw SQLite (and Sqflite) in reads and writes.
2.  **Type-Safe Collections:** Schema structures are generated natively from Dart classes, preventing runtime SQL parser failures.
3.  **Bi-directional Relationships:** Built-in support for links (`IsarLink`) and backlink collections (`IsarLinks`), which make managing parent-child models (like Countries and Places) incredibly simple.
4.  **NoSQL with Relational Capabilities:** Offers NoSQL scalability with clean relational links, making it the perfect bridge for a future Cloud sync schema (e.g., Firestore or PostgreSQL).
5.  **Reactive Queries:** Built-in streams automatically emit updated records whenever database operations occur, enabling a dynamic, self-refreshing UI without manual controllers.

---

## 2. Entity Schema Definitions

To ensure compatibility with future cloud sync, **all primary identifiers (IDs) are mapped to UUID strings (v4)** or auto-incrementing integers that map cleanly to globally unique string keys.

---

### 2.1 Country Collection (`Country`)
Acts as the parent bucket containing all saved places. Countries can exist even if no places are currently linked.

```dart
@collection
class Country {
  Id? id; // Auto-incrementing local ID

  @Index(unique: true, replace: true)
  late String uuid; // Globally unique ID (v4 UUID) for future cloud sync

  @Index(unique: true)
  late String isoCode; // ISO 3166-1 alpha-2 code (e.g., "JP", "NO")

  late String countryName; // e.g., "Japan", "Norway"
  late String flagEmoji; // Flag unicode (e.g., "🇯🇵")
  late String continent; // e.g., "Asia", "Europe"

  late DateTime createdDate;
  late DateTime updatedDate;

  // Local sync metadata
  late int version; // Increments on change
  late bool isDeleted; // Soft-delete flag for conflict resolution

  // Relationships
  final places = IsarLinks<Place>(); // Backlinks to saved places
}
```

---

### 2.2 Place Collection (`Place`)
The central entity mapping individual geographic entries, journals, and status markers.

```dart
@collection
class Place {
  Id? id;

  @Index(unique: true, replace: true)
  late String uuid;

  @Index()
  late String countryUuid; // Foreign Key relation mapping to Country.uuid

  late String name; // e.g., "Kiyomizu-dera Temple"
  
  // High-precision geographic coordinates
  late double latitude;
  late double longitude;
  
  String? address;
  String? externalId; // Google Places ID or OpenStreetMap ID

  late String description; // Brief highlight text
  late String notes; // User's personal travel journal
  
  @Index()
  late String priority; // ENUM: "high", "medium", "low"
  
  @Index()
  late String status; // ENUM: "visited", "wishlist"
  
  @Index()
  late bool isFavorite;

  late DateTime createdDate;
  late DateTime updatedDate;

  String? thumbnailPath; // Path to local thumbnail file
  String? colorMarker; // Accent hex override (e.g., "#FF5A5F")
  
  double? rating; // User evaluation (1.0 - 5.0)

  // Future cloud & sync fields
  late int version;
  late bool isDeleted;

  // Relationships
  final country = IsarLink<Country>();
  final tags = IsarLinks<Tag>();
  final photos = IsarLinks<Photo>();
  final notesHistory = IsarLinks<Note>();
  final visits = IsarLinks<Visit>();
}
```

---

### 2.3 Tag Collection (`Tag`)
A highly reusable classification label. Tags maintain a many-to-many relationship with places.

```dart
@collection
class Tag {
  Id? id;

  @Index(unique: true, replace: true)
  late String uuid;

  @Index(unique: true)
  late String name; // e.g., "Beach", "Historic", "Hiking"
  
  late String colorHex; // Hex representation (e.g., "#008080")
  late String iconName; // Lucide icon identifier (e.g., "mountain")

  late DateTime createdDate;
  
  // Relationships
  @Backlink(to: 'tags')
  final places = IsarLinks<Place>();
}
```

---

### 2.4 Photo Collection (`Photo`)
Maps user-attached images directly to their respective places.

```dart
@collection
class Photo {
  Id? id;

  @Index(unique: true, replace: true)
  late String uuid;

  late String placeUuid; // Foreign Key mapping to Place.uuid
  late String localPath; // Absolute local file system path to cached/compressed photo
  
  String? caption;
  late DateTime dateAdded;
  late int displayOrder; // Order identifier for sliding galleries

  // Relationships
  final place = IsarLink<Place>();
}
```

---

### 2.5 Note Collection (`Note`)
Holds a versioned, historical archive of markdown journal entries for rich place logging.

```dart
@collection
class Note {
  Id? id;

  @Index(unique: true, replace: true)
  late String uuid;

  late String placeUuid;
  late String markdownText; // Deep markdown logs
  
  late DateTime createdDate;
  late DateTime updatedDate;

  final place = IsarLink<Place>();
}
```

---

### 2.6 Visit Collection (`Visit`)
Allows users to record multiple historic trips to a single place over time.

```dart
@collection
class Visit {
  Id? id;

  @Index(unique: true, replace: true)
  late String uuid;

  late String placeUuid;
  late DateTime visitDate;
  
  List<String>? companions; // List of people present
  double? cost; // Total money spent
  late int durationDays; // Visit duration
  
  String? weatherCondition; // e.g., "Sunny", "Rainy"
  String? tripNotes; // Trip-specific highlight notes

  final place = IsarLink<Place>();
}
```

---

### 2.7 Settings Collection (`Settings`)
A single-document local state container holding active theme modes and sync configurations.

```dart
@collection
class Settings {
  Id id = 1; // Enforced single-record constraint

  late String themeMode; // ENUM: "system", "light", "dark"
  late bool amoledMode; // Absolute true black #000000 toggle
  late String accentColor; // Selected theme color (e.g., "sage", "blue")
  late String languageCode; // UI Localization code (e.g., "en", "ja")
  late String unitsSystem; // ENUM: "metric", "imperial"

  // Cloud Sync configurations (future-proofing)
  late bool cloudSyncEnabled;
  String? userAccountUuid;
}
```

---

## 3. Entity Relationship Diagram (ERD)

```
       +--------------------+
       |      Country       |
       +--------------------+
       | id (PK)            |
       | uuid (Unique Index)| <------+
       | countryName        |        |
       | isoCode (Index)    |        | (1 to Many)
       +--------------------+        |
                 |                   |
                 | (1 to Many)       |
                 v                   |
       +--------------------+        |
       |       Place        |--------+
       +--------------------+
       | id (PK)            | <------+-----------------+----------------+
       | uuid (Unique Index)|        |                 |                |
       | countryUuid (FK)   |        | (1 to Many)     | (1 to Many)    | (1 to Many)
       | name               |        |                 |                |
       +--------------------+        v                 v                v
          |           |          +-------+         +-------+        +-------+
          |           |          | Photo |         | Note  |        | Visit |
          | (Many     | (Many    +-------+         +-------+        +-------+
          |  to       |  to      | id    |         | id    |        | id    |
          |  Many)    |  Many)   | uuid  |         | uuid  |        | uuid  |
          v           v          | path  |         | text  |        | date  |
       +-------+   +-------+     +-------+         +-------+        +-------+
       |  Tag  |   | Place |
       +-------+   +-------+
       | id    |   | tag   |
       | uuid  |   | place |
       | name  |   +-------+
       +-------+
```

### Relationship Classifications:
1.  **Country to Place (One-to-Many):** One Country holds multiple saved Places. Deleting a place does not impact the parent Country record.
2.  **Place to Tag (Many-to-Many):** A Place can have multiple classification tags (e.g., `#historic`, `#nature`), and a Tag can group many different places globally.
3.  **Place to Photo (One-to-Many):** A Place has an array of associated Photos. Deleting a Place cascades to delete associated Photo database rows and local asset file paths.
4.  **Place to Note (One-to-Many):** Keeps a rolling historical index of text-based journals associated with a Place.
5.  **Place to Visit (One-to-Many):** Each Place can have a history of separate visits, enabling users to log multiple memories at the same geographic coordinate.

---

## 4. Schema Migrations Strategy

As GlobeTrail scales through production phases (V1.0 MVP to V2.0 Cloud Sync), schema alterations will happen.

### Schema Versioning Rules:
1.  **Isar Schema Tracking:** Isar manages schemas natively. We define an explicit `schemaVersion` inside Isar database initialization configs.
2.  **Non-Destructive Modifications:** Avoid deleting columns. Instead, deprecate old fields, make them nullable, and assign default values for new additions.
3.  **Migration Registry:** Maintain an explicit migration routine triggered on database startup:

```dart
Future<void> runMigrations(Isar isar, int oldVersion, int newVersion) async {
  if (oldVersion < 2) {
    // Phase 4 to Phase 7: Migrating Place collection to add 'rating' and 'colorMarker'
    await isar.writeTxn(() async {
      final places = await isar.places.where().findAll();
      for (var place in places) {
        place.rating = 5.0; // Default fallback rating
        place.colorMarker = "#8E8E93"; // Default Steel Gray accent
        await isar.places.put(place);
      }
    });
  }
}
```

---

## 5. Backup & Data Portability Strategy

To remain completely offline-first, users must have absolute control over importing and exporting their records.

### 5.1 Export Protocol (JSON Serialization)
*   **Encapsulation:** The system compiles the complete database state across collections (Countries, Places, Tags, Visits) into a single, unified JSON payload.
*   **Media Packaging:** Local photos referenced in paths are compressed and compiled into a single `.gtbackup` zip file containing the JSON schema alongside a `/media` subdirectory.
*   **Transmission:** Uses native sharing sheets (`share_plus`) to export the archive cleanly to files, email, or local storage.

### 5.2 Import Protocol & Conflict Resolution
*   **Validation Check:** Before parsing the payload, the backup manager validates the JSON file schema version and checks keys for malformation.
*   **Upsert Resolution:** The backup system uses unique UUID indices to resolve conflicts:
    *   **Record Exists:** If a UUID matches an existing record, the system compares `updatedDate` timestamps. The record with the newer timestamp is written, while the older version is discarded.
    *   **New Record:** If the UUID does not exist locally, the system appends the record as a new row.

---

## 6. Cloud-Synchronization Architectures (Future Proofing)

While GlobeTrail launches as a fully local-first application, the database schema is deliberately built to support high-fidelity, real-time cloud sync in the future.

### 6.1 Sync Metadata Fields
Every synchronized collection implements these core properties:
*   `uuid`: Universal string identifier, avoiding integer conflicts across multiple client devices.
*   `version`: A monotonic incremental counter tracking edits.
*   `isDeleted` (Soft-Deletes): Deleting a place in-app sets `isDeleted = true` instead of immediately deleting the row. This informs remote clients to sync the deletion rather than re-creating the item.
*   `updatedDate`: High-precision timestamp resolving the *Last-Write-Wins* conflict logic.

### 6.2 Conflict Resolution (Local vs. Cloud)
When reconciling state differences between local client caches and central remote databases, the sync engine executes these rules:
1.  **Last-Write-Wins (LWW):** Compare `updatedDate` properties. The latest timestamp wins and overrides the other.
2.  **Incremental Version Verification:** If version counts conflict, local edits with higher version counters are prioritized.
3.  **Safe Merge:** Notes and text logs are merged using localized diff strings if conflicts occur during simultaneous multi-device edits.

---

## 7. Performance & Optimization Guide

### 7.1 Indexing Matrix
To maintain an ultra-fast interface with thousands of saved places, indexes are assigned to frequently queried fields:
*   **Compound Indexes:**
    *   `Place: [status, priority]` - Speeds up complex filters on the Home Accordion list.
    *   `Place: [isFavorite, status]` - Optimizes Globe pin groupings and quick metrics.
*   **Single Indexes:**
    *   `Country: isoCode` - Quick lookups during coordinate-to-country resolutions.
    *   `Place: countryUuid` - Optimizes lazy-loading parent country containers.

### 7.2 Lazy Loading & Resource Optimization
*   **Asynchronous Links:** Relations inside Isar use `IsarLinks` which lazy-load child objects on-demand, preventing memory leaks when reading deep country objects.
*   **Thumbnail Processing:** Photo paths stored in database records are rendered via localized scaling pipelines. Images are automatically resized down to compressed thumbnails on creation, preventing UI stuttering during scrolling.
