---
title: "Asset Loading System"
---

# Asset Loading System

## Overview

The Hytale server uses an asset-driven architecture for loading and managing game content. Assets include items, blocks, sounds, particles, models, and more.

---

## Core Components

### AssetStore<K, T, M>

Manages the lifecycle of a specific asset type.

**Type Parameters:**

- `K` - Key type (usually String)
- `T` - Asset type (e.g., Item, BlockType)
- `M` - AssetMap implementation

**Key Fields:**

- `path` - Directory path for assets (e.g., `"Item/Items"`)
- `extension` - File extension (default: `".json"`)
- `codec` - AssetCodec for encoding/decoding
- `keyFunction` - Function to extract key from asset
- `loadsAfter` - Set of asset classes this store depends on
- `loadsBefore` - Set of asset classes that depend on this
- `assetMap` - The storage map
- `childAssetsMap` - Maps parent keys to child asset keys
- `replaceOnRemove` - Optional function to replace removed assets

**Key Methods:**

- `loadAssetsFromDirectory(packKey, path)` - Loads all assets from a directory
- `loadAssetsFromPaths(packKey, paths)` - Loads assets from specific paths
- `removeAssets(packKey, all, keys, query)` - Removes assets by key
- `removeAssetPack(name)` - Removes entire asset pack
- `decode(packKey, key, document)` - Decodes BSON document to asset
- `getAssetMap()` - Returns the asset map

### AssetRegistry

Global registry singleton managing all AssetStores.

**Static Fields:**

- `ASSET_LOCK` - ReentrantReadWriteLock for thread-safe access
- `storeMap` - Map of asset class to AssetStore
- `TAG_MAP` - String to tag index mapping
- `TAG_NOT_FOUND` - Sentinel value (Integer.MIN_VALUE)

**Key Methods:**

- `getStoreMap()` - Returns unmodifiable map of all stores
- `getAssetStore(Class<T>)` - Retrieves store for asset class
- `register(AssetStore)` - Registers a new store
- `unregister(AssetStore)` - Unregisters a store
- `getTagIndex(tag)` - Gets index for existing tag
- `getOrCreateTagIndex(tag)` - Gets or creates tag index
- `registerClientTag(tag)` - Registers client-visible tag

### AssetPack

Container for a collection of assets.

**Fields:**

- `name` - Pack identifier
- `root` - Root directory path
- `fileSystem` - Optional custom filesystem (for ZIP/JAR)
- `isImmutable` - Whether pack can be modified
- `manifest` - Optional PluginManifest

---

## AssetMap Types

| Map Type                | Description                                                                                          |
| ----------------------- | ---------------------------------------------------------------------------------------------------- |
| **DefaultAssetMap**     | General purpose, uses StampedLock for optimistic reads. Supports asset layering from multiple packs. |
| **AssetMapWithIndexes** | Extends DefaultAssetMap with integer-based indexing. Forces replacement strategy on removal.         |
| **IndexedAssetMap**     | Auto-assigns indices to assets. Uses atomic counter for runtime indexing.                            |
| **LookupTableAssetMap** | Array-backed O(1) lookup by index. Requires external index provider.                                 |
| **BlockTypeAssetMap**   | Specialized for block types with groups. Supports sub-keys within block groups.                      |

### DefaultAssetMap Internal Structure

- `assetMap` - Main asset storage
- `assetChainMap` - Chain of assets per pack (for multi-pack overlays)
- `packAssetKeys` - Tracks which keys belong to which pack
- `pathToKeyMap` - Reverse mapping from file paths to keys
- `assetChildren` - Parent-child relationships
- `tagStorage` - Tag-based asset lookup

---

## Codec System

### AssetCodec<K, T>

Interface for encoding/decoding assets.

**Key Methods:**

- `getKeyCodec()` - Returns KeyedCodec for asset keys
- `getParentCodec()` - Returns KeyedCodec for parent references
- `getData(asset)` - Extracts AssetExtraInfo.Data from asset
- `decodeJsonAsset(reader, info)` - Decodes new asset from JSON
- `decodeAndInheritJsonAsset(reader, parent, info)` - Decodes with inheritance

### Contained Asset Modes

| Mode                    | Description                                              |
| ----------------------- | -------------------------------------------------------- |
| `NONE`                  | Not a contained asset                                    |
| `GENERATE_ID`           | Generate unique ID (e.g., `"*parent_0"`)                 |
| `INHERIT_ID`            | Use parent asset's key                                   |
| `INHERIT_ID_AND_PARENT` | Use parent key, inherit parent's parent if not specified |
| `INJECT_PARENT`         | Auto-set parent if not explicitly provided               |

---

## Loading Pipeline

### 1. Registration Phase

```
AssetRegistry.register(assetStore)
    → Fires RegisterAssetStoreEvent
    → Stores ordered by loadsAfter dependencies
```

### 2. File Discovery

```
Walk directory tree
    → Collect files matching extension
    → Convert paths to RawAsset<K> with keys from filenames
```

### 3. Dependency Resolution

```
Load child assets (contained in other files)
    → Build full dependency graph
```

### 4. Parallel Decode

```
CompletableFuture for each asset
    → executeAssetDecode() per RawAsset
    → Decode documents in parallel
```

### 5. Lock & Register

```
Acquire ASSET_LOCK.writeLock()
    → Fire GenerateAssetsEvent (allows plugins to add dynamic assets)
    → Process event results
```

### 6. Handle Failures

```
Identify failed keys/paths
    → Remove failed assets and children
    → Replace with fallback via replaceOnRemove (if configured)
```

### 7. Storage

```
assetMap.putAll()
    → Build path-to-key mappings
    → Register asset tags
```

### 8. Contained Assets

```
Extract contained assets from decoded assets
    → Recursively load contained asset types
    → Build child asset references
```

### 9. Events

```
Fire LoadedAssetsEvent (with loaded assets)
Fire RemovedAssetsEvent (for failures/removals)
```

### 10. Return Result

```
AssetLoadResult:
    - loadedAssets
    - loadedKeyToPathMap
    - failedToLoadKeys
    - failedToLoadPaths
    - childAssetResults
```

---

## Events

| Event                     | When Fired            | Purpose                        |
| ------------------------- | --------------------- | ------------------------------ |
| `RegisterAssetStoreEvent` | Store registered      | Notify of new asset type       |
| `GenerateAssetsEvent`     | Before assets stored  | Allow dynamic asset generation |
| `LoadedAssetsEvent`       | After assets stored   | Post-load processing           |
| `RemovedAssetsEvent`      | Assets removed/failed | Cleanup notifications          |
| `RemoveAssetStoreEvent`   | Store unregistered    | Cleanup                        |

### GenerateAssetsEvent Methods

- `addChildAsset(childKey, asset, parent)`
- `addChildAsset(childKey, asset, parents...)`
- `addChildAssetWithReference(childKey, asset, parentClass, parentKey)`
- `addChildAssetWithReferences(childKey, asset, ParentReference...)`

---

## Directory Structure

```
pack_root/
├── Server/
│   ├── Item/
│   │   └── Items/
│   │       ├── Deco/
│   │       │   └── *.json
│   │       └── Tool/
│   │           └── *.json
│   ├── Block/
│   │   └── ...
│   ├── Audio/
│   │   ├── SoundEvents/
│   │   └── SoundSets/
│   └── ...
└── manifest.json (optional)
```

**Key Points:**

- Assets stored under `Server/{path}/`
- Keys decoded from filenames (extension removed)
- Multiple packs can overlay (same key from different packs via chain)

---

## RawAsset

Intermediate representation before decoding.

**Fields:**

- `key` - Decoded asset key
- `path` - File path (if file-based)
- `buffer` - Char array of JSON/BSON content
- `parentPath` - Parent file for contained assets
- `parentKey` - Key of parent asset (for inheritance)
- `lineOffset` - Line number in parent file
- `containerData` - Metadata about container asset
- `containedAssetMode` - How to handle this contained asset

---

## Tag System

Tags provide categorization and querying of assets.

**Structure:**

- Tags are strings converted to integer indices
- Hierarchical: `"category"`, `"category=value"`, `"value"`
- Registry-wide indexing via `AssetRegistry.getOrCreateTagIndex(tag)`

**Usage:**

- `assetMap.getKeysForTag(tagIndex)` - Query assets by tag
- `AssetExtraInfo.Data.tagStorage` - Per-asset tag indices

---

## Thread Safety

- `AssetRegistry.ASSET_LOCK` - ReentrantReadWriteLock for registry operations
- `StampedLock` - Used in DefaultAssetMap for optimistic reads
- `CompletableFuture.allOf()` - Parallel asset decoding
- Write lock held during asset installation
