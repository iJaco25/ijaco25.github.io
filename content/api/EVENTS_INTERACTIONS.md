---
title: "Event and Interaction System"
---

# Event and Interaction System

## Event System Architecture

### Core Interfaces

| Interface                                 | Description                   |
| ----------------------------------------- | ----------------------------- |
| `IBaseEvent<KeyType>`                     | Root interface for all events |
| `IEvent<KeyType>`                         | Synchronous events            |
| `IAsyncEvent<KeyType>`                    | Asynchronous events           |
| `ICancellable`                            | Cancellation support          |
| `IEventDispatcher<EventType, ReturnType>` | Event dispatching             |

### ICancellable Interface

```java
interface ICancellable {
    boolean isCancelled();
    void setCancelled(boolean cancelled);
}
```

---

## Event Priorities

```java
enum EventPriority {
    FIRST(-21844),    // Highest priority - validation
    EARLY(-10922),    // Setup/preparation
    NORMAL(0),        // Default processing
    LATE(10922),      // Post-processing
    LAST(21844);      // Lowest priority - cleanup/logging
}
```

Execution order: FIRST → EARLY → NORMAL → LATE → LAST

---

## EventBus and Registry

### IEventBus Interface

Extends `IEventRegistry`. Key methods:

- `dispatchFor(Class, KeyType)` - Get dispatcher for sync events
- `dispatchForAsync(Class, KeyType)` - Get dispatcher for async events

### Registration Methods

```java
// Basic
register(EventClass, Consumer)
register(EventPriority, EventClass, Consumer)
register(short priority, EventClass, Consumer)

// Keyed
register(EventClass, Key, Consumer)
register(EventPriority, EventClass, Key, Consumer)

// Global (all keys)
registerGlobal(EventClass, Consumer)
registerGlobal(EventPriority, EventClass, Consumer)

// Unhandled (catch-all)
registerUnhandled(EventClass, Consumer)

// Async
registerAsync(EventClass, Function<CompletableFuture<E>, CompletableFuture<E>>)
registerAsyncGlobal(...)
registerAsyncUnhandled(...)
```

### EventRegistration

Returned from registration methods:

- Stores event class and enablement state
- Provides unregister callback
- Can combine multiple registrations with `combine()`

---

## InteractionType Enum (25 Types)

| Type               | Value | Description             |
| ------------------ | ----- | ----------------------- |
| `Primary`          | 0     | Left click              |
| `Secondary`        | 1     | Right click             |
| `Ability1`         | 2     | Ability key 1           |
| `Ability2`         | 3     | Ability key 2           |
| `Ability3`         | 4     | Ability key 3           |
| `Use`              | 5     | Use action              |
| `Pick`             | 6     | Pick block              |
| `Pickup`           | 7     | Pickup item             |
| `CollisionEnter`   | 8     | Entity enters collision |
| `CollisionLeave`   | 9     | Entity leaves collision |
| `Collision`        | 10    | Collision event         |
| `EntityStatEffect` | 11    | Entity stat effect      |
| `SwapTo`           | 12    | Swap to item            |
| `SwapFrom`         | 13    | Swap from item          |
| `Death`            | 14    | Entity death            |
| `Wielding`         | 15    | Item wielding           |
| `ProjectileSpawn`  | 16    | Projectile spawned      |
| `ProjectileHit`    | 17    | Projectile hit          |
| `ProjectileMiss`   | 18    | Projectile missed       |
| `ProjectileBounce` | 19    | Projectile bounced      |
| `Held`             | 20    | Item held in main hand  |
| `HeldOffhand`      | 21    | Item held in offhand    |
| `Equipped`         | 22    | Item equipped           |
| `Dodge`            | 23    | Dodge action            |
| `GameModeSwap`     | 24    | Gamemode changed        |

---

## Interaction System

### RootInteraction

Entry point for interaction chains. Defined as JSON assets.

**Fields:**

- `id` - Asset ID
- `interactionIds` - Array of interaction IDs to execute in sequence
- `cooldown` - InteractionCooldown config
- `rules` - InteractionRules (conditions)
- `settings` - Map<GameMode, RootInteractionSettings>
- `requireNewClick` - Force new click for same root type
- `clickQueuingTimeout` - Queue timeout in seconds
- `operations` - Compiled Operation array

### InteractionCooldown

```java
InteractionCooldown {
    cooldownId: String        // Shared cooldown identifier
    cooldown: float           // Duration in seconds
    charges: float[]          // Charge time array
    skipCooldownReset: boolean
    interruptRecharge: boolean
    clickBypass: boolean
}
```

### Interaction

Base class for interaction steps.

**Fields:**

- `id` - Asset ID
- `runTime` - Duration in seconds
- `effects` - InteractionEffects (animation/particles)
- `horizontalSpeedMultiplier` - Movement speed modifier
- `cancelOnItemChange` - Cancel if held item changes
- `viewDistance` - Network visibility (default: 96.0)
- `camera` - InteractionCameraSettings
- `settings` - Map<GameMode, InteractionSettings>
- `rules` - InteractionRules

**Methods:**

- `tick()` - Main execution tick
- `simulateTick()` - Simulation tick
- `handle()` - Network synchronization
- `compile(OperationsBuilder)` - Add to operation chain

### InteractionState

| State         | Description            |
| ------------- | ---------------------- |
| `NotFinished` | Still executing        |
| `Finished`    | Completed successfully |
| `Failed`      | Cancelled or failed    |
| `Skip`        | Skipped to next        |
| `ItemChanged` | Held item changed      |

---

## Interaction Execution

### InteractionManager

Component managing active chains per entity.

**Fields:**

- `chains` - Int2ObjectMap<InteractionChain>
- `cooldownHandler` - CooldownHandler
- `lastServerChainId` / `lastClientChainId`

**Methods:**

- `startChain()` - Begin new interaction chain
- `tick()` - Process active chains
- `synchronize()` - Network sync

### InteractionChain

Represents active interaction execution.

**Fields:**

- `type` - InteractionType triggering this
- `context` - InteractionContext
- `chainData` - InteractionChainData
- `operationCounter` - Current operation index
- `callStack` - List<CallState> for nested calls
- `interactions` - List<InteractionEntry>
- `forkedChains` - Long2ObjectMap<InteractionChain>

### InteractionContext

Execution context for interactions.

**Fields:**

- `owningEntity` - Entity performing interaction
- `runningForEntity` - Entity being affected
- `entity` - Cached LivingEntity component
- `chain` - Active InteractionChain
- `metaStore` - DynamicMetaStore for metadata
- `heldItem` - Item in hand
- `originalItemType` - Original item type

**Metadata Keys:**

- `TARGET_ENTITY` - Target entity reference
- `HIT_LOCATION` - Vector4d of hit point
- `HIT_DETAIL` - String detail
- `TARGET_BLOCK` - Block position
- `TARGET_BLOCK_RAW` - Raw block position
- `TARGET_SLOT` - Inventory slot
- `TIME_SHIFT` - Time offset
- `DAMAGE` - Damage value

---

## Player Events

| Event                    | Description                     | Cancellable |
| ------------------------ | ------------------------------- | ----------- |
| `PlayerInteractEvent`    | Player interaction (deprecated) | Yes         |
| `PlayerMouseButtonEvent` | Mouse button input              | Yes         |
| `PlayerMouseMotionEvent` | Mouse movement                  | Yes         |
| `PlayerConnectEvent`     | Player connects                 | No          |
| `PlayerDisconnectEvent`  | Player disconnects              | No          |
| `PlayerChatEvent`        | Chat message                    | Yes         |
| `PlayerReadyEvent`       | Player fully loaded             | No          |

---

## Block Events

| Event                | Description      | Cancellable |
| -------------------- | ---------------- | ----------- |
| `PlaceBlockEvent`    | Block placed     | Yes         |
| `BreakBlockEvent`    | Block broken     | Yes         |
| `DamageBlockEvent`   | Block damaged    | Yes         |
| `UseBlockEvent.Pre`  | Before block use | Yes         |
| `UseBlockEvent.Post` | After block use  | No          |

### PlaceBlockEvent Fields

- `itemInHand` - ItemStack used
- `targetBlock` - Vector3i (modifiable)
- `rotation` - RotationTuple (modifiable)

### BreakBlockEvent Fields

- `itemInHand` - ItemStack used
- `targetBlock` - Vector3i
- `blockType` - BlockType

### DamageBlockEvent Fields

- `itemInHand` - ItemStack used
- `targetBlock` - Vector3i
- `blockType` - BlockType
- `currentDamage` - Current damage
- `damage` - Damage to apply (modifiable)

---

## Event Flow

```
Player Input (Mouse/Key)
    ↓
InteractionType determined
    ↓
PlayerMouseButtonEvent fired
    ↓
InteractionManager.startChain(RootInteraction)
    ↓
InteractionChain created with InteractionContext
    ↓
RootInteraction resolves → Interaction array
    ↓
OperationsBuilder compiles → Operation[]
    ↓
InteractionChain.tick() executes operations
    ↓
Interaction.tick() processes step
    ↓
InteractionContext metadata updated
    ↓
Block/Entity events fired
    ↓
If cancelled → InteractionState.Failed
    ↓
Effects applied (animations, particles)
    ↓
Network packets sent
    ↓
InteractionState → Finished/Failed
    ↓
Completion callback invoked
```

---

## Network Synchronization

| Packet                   | Direction     | Purpose             |
| ------------------------ | ------------- | ------------------- |
| `SyncInteractionChain`   | Server→Client | Initial sync        |
| `PlayInteractionFor`     | Server→Client | Per-operation sync  |
| `CancelInteractionChain` | Server→Client | Cancellation        |
| `WorldInteraction`       | Client→Server | Action confirmation |

---

## Operation Types

### Control Operations

| Operation              | Description           |
| ---------------------- | --------------------- |
| `ConditionInteraction` | Conditional branching |
| `SerialInteraction`    | Sequential execution  |
| `ParallelInteraction`  | Parallel execution    |
| `RepeatInteraction`    | Loop execution        |
| `ReplaceInteraction`   | Replace current chain |

### Client-Side Operations

| Operation                 | Description       |
| ------------------------- | ----------------- |
| `BreakBlockInteraction`   | Block breaking    |
| `PlaceBlockInteraction`   | Block placement   |
| `DestroyBlockInteraction` | Block destruction |
| `ChargingInteraction`     | Charge-up action  |
| `ChainingInteraction`     | Chain to next     |

### Server-Side Operations

| Operation                | Description         |
| ------------------------ | ------------------- |
| `ChangeStatInteraction`  | Modify entity stats |
| `EquipItemInteraction`   | Equip item          |
| `OpenPageInteraction`    | Open UI page        |
| `SpawnPrefabInteraction` | Spawn prefab        |

---

## Asset Storage

Interactions stored as JSON assets:

- `AssetStore<String, RootInteraction, IndexedLookupTableAssetMap>`
- `AssetStore<String, Interaction, IndexedLookupTableAssetMap>`

Events:

- `LoadedAssetsEvent` - Fired when interactions loaded
- `RemovedAssetsEvent` - Fired when interactions removed
