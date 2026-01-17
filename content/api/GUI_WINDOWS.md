---
title: "GUI and Window System"
---

# GUI and Window System

## Window Class Hierarchy

```
Window (abstract)
├── ContainerWindow (implements ItemContainerWindow)
├── BlockWindow (abstract, implements ValidatedWindow)
│   └── ContainerBlockWindow (implements ItemContainerWindow)
└── ItemStackContainerWindow (implements ItemContainerWindow)
```

### Window Base Class

Abstract base for all windows.

**Abstract Methods:**

- `getData()` - Returns JsonObject with window configuration
- `onOpen0()` - Called when opening (return false to cancel)
- `onClose0()` - Called when closing

**Key Features:**

- Window ID management (assigned by WindowManager)
- Window type classification
- Dirty state tracking for updates
- Close event registration with priority support
- Action handling via `handleAction(Ref, Store, WindowAction)`
- Static registry: `CLIENT_REQUESTABLE_WINDOW_TYPES`

### Window Implementations

| Class                      | Description                                        |
| -------------------------- | -------------------------------------------------- |
| `ContainerWindow`          | Basic container with ItemContainer                 |
| `BlockWindow`              | Abstract, tied to world blocks, validates distance |
| `ContainerBlockWindow`     | Block-based container (chests), handles sorting    |
| `ItemStackContainerWindow` | Container for item stacks, auto-closes on invalid  |

---

## WindowManager

Manages all open windows for a player.

**Fields:**

- Window map: `Int2ObjectConcurrentHashMap<Window>`
- ID counter starting from 1

**Window ID Scheme:**

- ID -1: Invalid (throws exception)
- ID 0: Client-opened window (special, replaceable)
- ID 1+: Server-opened windows

### Core Methods

| Method                     | Returns               | Description                           |
| -------------------------- | --------------------- | ------------------------------------- |
| `openWindow(Window)`       | `OpenWindow` packet   | Opens server window, assigns ID       |
| `clientOpenWindow(Window)` | `UpdateWindow` packet | Opens client-requested window at ID 0 |
| `closeWindow(int id)`      | `CloseWindow` packet  | Closes and removes window             |
| `updateWindow(Window)`     | `UpdateWindow` packet | Sends updated window data             |
| `updateWindows()`          | void                  | Updates all dirty windows             |
| `validateWindows()`        | void                  | Closes invalid `ValidatedWindow`s     |
| `getWindow(int id)`        | `Window`              | Retrieves window by ID                |

---

## WindowType Enum

```java
enum WindowType {
    Container(0),           // Generic container/inventory
    PocketCrafting(1),      // Pocket/portable crafting
    BasicCrafting(2),       // Basic crafting bench
    DiagramCrafting(3),     // Diagram-based crafting
    StructuralCrafting(4),  // Building/structural crafting
    Processing(5),          // Processing/cooking bench
    Memories(6);            // Memories/lore interface
}
```

---

## Window Interfaces

### ItemContainerWindow

```java
interface ItemContainerWindow {
    ItemContainer getItemContainer();
}
```

Windows implementing this include inventory data in packets.

### ValidatedWindow

```java
interface ValidatedWindow {
    boolean validate();
}
```

Called each tick. Auto-closes if validation fails.

Example: `BlockWindow` validates player distance (max 7.0 blocks) and block existence.

### MaterialContainerWindow

```java
interface MaterialContainerWindow {
    MaterialExtraResourcesSection getExtraResourcesSection();
    void invalidateExtraResources();
    boolean isValid();
}
```

For windows with material/resource tracking (crafting, processing).

---

## Window Lifecycle

### Opening

```
1. WindowManager.openWindow(window)
2. Manager assigns ID
3. window.init(PlayerRef, manager)
4. window.onOpen() → onOpen0()
5. If open fails, window closed immediately
6. OpenWindow packet sent
7. For ItemContainerWindow: change listener registered
```

### Updating

```
1. window.invalidate() marks dirty
2. window.setNeedRebuild() flags GUI rebuild
3. WindowManager.updateWindows() iterates windows
4. UpdateWindow packet sent for dirty windows
5. consumeIsDirty() and consumeNeedRebuild() reset flags
```

### Closing

```
1. window.close() or WindowManager.closeWindow(id)
2. CloseWindow packet sent
3. window.onClose() → onClose0()
4. Close event handlers fired
5. For ItemContainerWindow: change listener unregistered
```

### Validation

```
1. WindowManager.validateWindows() called each tick
2. For each ValidatedWindow: validate()
3. If false: window auto-closes
```

---

## Network Packets

### Server → Client

| Packet         | ID  | Compressed | Purpose            |
| -------------- | --- | ---------- | ------------------ |
| `OpenWindow`   | 200 | Yes        | Open new window    |
| `UpdateWindow` | 201 | Yes        | Update window data |
| `CloseWindow`  | 202 | No         | Close window       |

### Client → Server

| Packet             | ID  | Compressed | Purpose                 |
| ------------------ | --- | ---------- | ----------------------- |
| `SendWindowAction` | 203 | No         | Player action in window |
| `ClientOpenWindow` | 204 | No         | Request to open window  |

### OpenWindow Fields

- `int id` - Window ID
- `WindowType windowType` - Type of window
- `String windowData` - JSON window configuration (nullable, max 4MB)
- `InventorySection inventory` - Item container data (nullable)
- `ExtraResources extraResources` - Material/resource data (nullable)

### UpdateWindow Fields

- `int id` - Window ID
- `String windowData` - Updated JSON data (nullable)
- `InventorySection inventory` - Updated inventory (nullable)
- `ExtraResources extraResources` - Updated resources (nullable)

---

## WindowAction Types

| TypeID | Action                 | Fields                     | Description             |
| ------ | ---------------------- | -------------------------- | ----------------------- |
| 0      | `CraftRecipeAction`    | `recipeId`, `quantity`     | Craft by recipe         |
| 1      | `TierUpgradeAction`    | (none)                     | Upgrade tier            |
| 2      | `SelectSlotAction`     | `slot`                     | Select inventory slot   |
| 3      | `ChangeBlockAction`    | `down`                     | Block rotation change   |
| 4      | `SetActiveAction`      | `state`                    | Toggle active state     |
| 5      | `CraftItemAction`      | (none)                     | Quick craft single item |
| 6      | `UpdateCategoryAction` | `category`, `itemCategory` | Filter by category      |
| 7      | `CancelCraftingAction` | (none)                     | Cancel active crafting  |
| 8      | `SortItemsAction`      | `sortType`                 | Sort inventory          |

### Action Processing

```java
@Override
public void handleAction(Ref<EntityStore> ref, Store<EntityStore> store,
                         WindowAction action) {
    if (action instanceof SortItemsAction sort) {
        itemContainer.sortItems(SortType.fromPacket(sort.sortType));
        invalidate();
    }
}
```

---

## BlockWindow Validation

`BlockWindow` validates:

1. Player distance to block (max 7.0 blocks)
2. Block still exists at position
3. Block type matches original

Fields:

- `x`, `y`, `z` - Block coordinates
- `rotationIndex` - Block rotation
- `blockType` - Expected BlockType
- `maxDistance` - Maximum valid distance (default 7.0)

---

## Data Flow

```
Client Opens Window
    ↓
ClientOpenWindow packet → server
    ↓
WindowManager.clientOpenWindow(window)
    ↓
window.onOpen() - initialization
    ↓
OpenWindow packet → client
  (Window ID, WindowType, JSON data, inventory, resources)
    ↓
Client renders window
    ↓
Client action → SendWindowAction packet
    ↓
window.handleAction(action)
    ↓
window.invalidate() - mark dirty
    ↓
WindowManager.updateWindows()
    ↓
UpdateWindow packet → client
    ↓
Client closes / server closes
    ↓
WindowManager.closeWindow(id)
    ↓
window.onClose() - cleanup
    ↓
CloseWindow packet → client
```

---

## Best Practices

**Do:**

- Call `invalidate()` after state changes
- Use `setNeedRebuild()` for GUI structure changes
- Implement `ValidatedWindow` for block-based windows
- Register close events for cleanup
- Use `ItemContainer` for all slot operations

**Don't:**

- Manually set window ID (WindowManager assigns it)
- Use ID -1 or 0 for server-opened windows
- Call `onOpen0()`/`onClose0()` directly
- Forget to send packets after opening windows
