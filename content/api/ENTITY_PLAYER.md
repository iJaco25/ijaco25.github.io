---
title: "Entity and Player System"
---

# Entity and Player System

## Entity Class Hierarchy

```
Entity (abstract)
├── LivingEntity (abstract)
│   └── Player
└── BlockEntity
```

### Entity

Base class for all entities. Implements `Component<EntityStore>`.

**Fields:**

- `networkId` - Unique network identifier
- `legacyUuid` - UUID for persistence
- `world` - Parent world reference
- `reference` - `Ref<EntityStore>` reference
- `wasRemoved` - AtomicBoolean removal flag

**Key Methods:**

- `remove()` - Removes entity from world
- `loadIntoWorld(World)` - Adds entity to world
- `unloadFromWorld()` - Removes from world without events
- `setReference(Ref)` - Sets ECS reference
- `toHolder()` - Converts to component holder
- `isCollidable()` - Collision check

### LivingEntity

Entities that can have inventory, take damage, and fall.

**Fields:**

- `statModifiersManager` - Stat modifications (armor, buffs)
- `inventory` - Inventory system
- `currentFallDistance` - Fall damage accumulator

**Key Methods:**

- `getInventory()` / `setInventory()`
- `canBreathe()` - Check breathing in current block
- `moveTo()` - Movement with fall damage
- `decreaseItemStackDurability()` - Durability damage
- `invalidateEquipmentNetwork()` - Flag equipment for update

### Player

Player-specific functionality. Implements `CommandSender`, `PermissionHolder`, `MetricProvider`.

**Fields:**

- `gameMode` - Survival, Creative, Adventure
- `playerRef` - Connection/session link
- `data` - PlayerConfigData (persistent)
- `worldMapTracker` - Minimap tracking
- `windowManager` - GUI windows
- `pageManager` - Page navigation
- `hudManager` - HUD elements
- `hotbarManager` - 10 saved hotbar configurations
- `clientViewRadius` - View distance
- `velocitySamples` / `velocitySampleIndex` - Movement velocity
- `overrideBlockPlacementRestrictions` - Creative mode override
- `mountEntityId` - Mounted entity ID
- `lastSpawnTimeNanos` - Respawn invulnerability timestamp

**Key Methods:**

- `getGameMode()` / `setGameMode()` - With events
- `moveToLocation()` - With collision and velocity
- `hasSpawnProtection()` - 3-second post-spawn invulnerability
- `isHiddenFromLivingEntity()` - Hidden player check
- `getRespawnPosition()` - Safe respawn with collision checks
- `canDecreaseItemStackDurability()` - Creative mode immunity

---

## Component System (ECS)

### Component Interface

```java
interface Component<ECS_TYPE> extends Cloneable {
    Component<ECS_TYPE> clone();
    Component<ECS_TYPE> cloneSerializable();
}
```

### Core ECS Classes

| Class                         | Purpose                                                               |
| ----------------------------- | --------------------------------------------------------------------- |
| `Store<ECS_TYPE>`             | Core store managing entities and components. Uses archetype chunks.   |
| `Archetype<ECS_TYPE>`         | Blueprint of component composition for entity groups.                 |
| `Holder<ECS_TYPE>`            | Temporary container for component data during creation/serialization. |
| `Ref<ECS_TYPE>`               | Reference to entity in store. Becomes invalid on removal.             |
| `ComponentType<ECS_TYPE, T>`  | Type metadata for component class.                                    |
| `ComponentRegistry<ECS_TYPE>` | Registry of all component and system types.                           |

### Store Methods

- `getComponent(ref, componentType)` - Get component from entity
- `putComponent(ref, component)` - Set component on entity
- `addEntity(holder, reason)` - Add entity to store
- `removeEntity(ref, reason)` - Remove entity from store

### Ref Lifecycle

```
Valid Ref                    Invalid Ref
    │                            │
    ▼                            ▼
ref.isValid() = true         ref.isValid() = false
ref.getIndex() = N           ref.getIndex() = Integer.MIN_VALUE
```

---

## Inventory System

### Section IDs

| Section  | ID  | Default Slots               |
| -------- | --- | --------------------------- |
| Hotbar   | -1  | 9                           |
| Storage  | -2  | 36 (4x9)                    |
| Armor    | -3  | ItemArmorSlot.VALUES.length |
| Utility  | -5  | 4                           |
| Tools    | -8  | 23 (deprecated)             |
| Backpack | -9  | variable                    |

### Container Types

| Type                    | Description                    |
| ----------------------- | ------------------------------ |
| `SimpleItemContainer`   | Basic slot storage             |
| `CombinedItemContainer` | Logical grouping of containers |
| `BlockWindow`           | Window for block containers    |
| `ItemContainerWindow`   | Window for inventory UI        |

### Combined Containers

- `combinedHotbarFirst` - Hotbar + Storage
- `combinedStorageFirst` - Storage + Hotbar
- `combinedArmorHotbarUtilityStorage` - Armor + Hotbar + Utility + Storage
- `combinedEverything` - All sections

### ItemStack

**Fields:**

- `itemId` - Item type ID
- `quantity` - Stack count
- `durability` / `maxDurability` - Durability values
- `metadata` - BsonDocument for extra data

**Methods:**

- `isUnbreakable()` - Check unbreakable flag
- `isBroken()` - Durability depleted
- `isEmpty()` - Zero quantity
- `getItem()` - Get Item asset

### Active Slots

- `activeHotbarSlot` - Current hotbar slot (byte)
- `activeUtilitySlot` - Current utility slot (byte)
- `activeToolsSlot` - Current tool slot (byte)

---

## Entity Lifecycle

### Spawning

```
1. Entity created: new Entity(world)
2. Network ID assigned: world.getEntityStore().takeNextNetworkId()
3. Load into world: entity.loadIntoWorld(world)
4. Components assembled into Holder<EntityStore>
5. Entity added: store.addEntity(holder, AddReason.SPAWN)
6. Reference set: entity.setReference(ref)
7. Systems triggered: onEntityAdded()
```

### Removal

```
1. entity.remove() called
2. wasRemoved flag set (atomic)
3. EntityRemoveEvent dispatched
4. store.removeEntity(ref, RemoveReason.REMOVE)
5. Player cleanup: ChunkTracker cleared, connection dropped
6. Systems triggered: onEntityRemove()
```

### Add/Remove Reasons

| AddReason | Description         |
| --------- | ------------------- |
| `SPAWN`   | Normal spawn        |
| `LOAD`    | Loaded from storage |

| RemoveReason | Description        |
| ------------ | ------------------ |
| `REMOVE`     | Explicit removal   |
| `UNLOAD`     | Chunk/world unload |

---

## System Types

| Type                  | Description                                 |
| --------------------- | ------------------------------------------- |
| `System<ECS_TYPE>`    | Base system class                           |
| `ISystem<ECS_TYPE>`   | System interface with lifecycle hooks       |
| `QuerySystem`         | Processes entities matching component query |
| `TickingSystem`       | Runs every tick                             |
| `EntityTickingSystem` | Tick per matching entity                    |
| `RefSystem`           | Listens to entity add/remove events         |
| `EventSystem`         | Dispatches ECS events                       |

### System Lifecycle

```java
interface ISystem<ECS_TYPE> {
    void onSystemRegistered();
    void onSystemUnregistered();
    Set<Dependency> getDependencies();
    Group getGroup();
}
```

### RefSystem Callbacks

```java
void onEntityAdded(Ref ref, AddReason reason, Store store, CommandBuffer buffer);
void onEntityRemove(Ref ref, RemoveReason reason, Store store, CommandBuffer buffer);
```

---

## Player Managers

| Manager           | Purpose                            |
| ----------------- | ---------------------------------- |
| `WindowManager`   | GUI windows (inventory, crafting)  |
| `PageManager`     | UI pages                           |
| `HudManager`      | HUD display and custom UI          |
| `HotbarManager`   | 10 saved hotbar configurations     |
| `MovementManager` | Movement settings, flying          |
| `CameraManager`   | Camera position and rotation       |
| `ChunkTracker`    | Tracks loaded chunks around player |

---

## Events

### Entity Events

| Event                          | Description                            |
| ------------------------------ | -------------------------------------- |
| `EntityRemoveEvent`            | Entity removed from world              |
| `ChangeGameModeEvent`          | Player changes game mode (cancellable) |
| `SwitchActiveSlotEvent`        | Player switches inventory slot         |
| `DropItemEvent`                | Player drops item                      |
| `InteractivelyPickupItemEvent` | Player picks up item                   |
| `CraftRecipeEvent`             | Player crafts recipe                   |
| `PlaceBlockEvent`              | Player places block                    |
| `BreakBlockEvent`              | Player breaks block                    |
| `DamageBlockEvent`             | Player damages block                   |
| `UseBlockEvent`                | Block interaction                      |
| `DiscoverZoneEvent`            | Player discovers zone                  |

### Inventory Events

| Event                              | Description       |
| ---------------------------------- | ----------------- |
| `LivingEntityInventoryChangeEvent` | Inventory changed |

---

## Network Packets

| Packet                      | Purpose                     |
| --------------------------- | --------------------------- |
| `SetMovementStates`         | Sync movement states        |
| `SetGameMode`               | Change game mode            |
| `SetBlockPlacementOverride` | Block placement permissions |
| `UpdatePlayerInventory`     | Send inventory state        |
| `ClientReady`               | Client signals ready        |
| `ClientMovement`            | Player movement input       |
| `MouseInteraction`          | Mouse aim/click             |
| `ClientPlaceBlock`          | Block placement request     |
| `ClientTeleport`            | Teleport request            |

---

## Design Patterns

1. **Entity Component System (ECS)** - Data-driven architecture
2. **Archetype Chunking** - Cache-efficient entity grouping
3. **Reference Pattern** - `Ref<ECS_TYPE>` with invalidation tracking
4. **Manager Pattern** - Players use composable managers
5. **Transaction Pattern** - Inventory operations return Transactions
6. **Event System** - Traditional and ECS events
7. **Composition over Inheritance** - Functionality via components
8. **System Dependency Injection** - Automatic dependency resolution
9. **Thread-Safe Design** - Atomic flags, concurrent maps, stamped locks
10. **Holder Pattern** - Temporary containers for serialization
