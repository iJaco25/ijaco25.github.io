---
title: "Hytale Server API Documentation"
---

# Hytale Server API Documentation

Technical reference for the Hytale server API.

## Getting Started

**New to mod development?** Start with the [Mod Development Guide](MOD_DEVELOPMENT_GUIDE.md) for a complete example with best practices.

## Documentation Index

### Guides

| Document                                          | Description                                                   |
| ------------------------------------------------- | ------------------------------------------------------------- |
| [Mod Development Guide](MOD_DEVELOPMENT_GUIDE.md) | Complete example mod with clean code, security, API isolation |
| [JSON Systems](HYTALE_JSON_SYSTEMS_REVIEW.md)     | Item/Block JSON, localization, particles                      |

### API Reference

| Document                                        | Description                                                  |
| ----------------------------------------------- | ------------------------------------------------------------ |
| [Asset Loading](ASSET_LOADING.md)               | AssetStore, AssetRegistry, AssetMap types, loading pipeline  |
| [Items & Blocks](ITEMS_BLOCKS.md)               | ItemBase, BlockType, specializations, enums                  |
| [Events & Interactions](EVENTS_INTERACTIONS.md) | EventBus, InteractionType, RootInteraction, InteractionChain |
| [GUI & Windows](GUI_WINDOWS.md)                 | Window hierarchy, WindowManager, WindowAction types          |
| [Networking & Packets](NETWORKING_PACKETS.md)   | Packet protocol, framing, VarInt, compression                |
| [Plugin System](PLUGIN_SYSTEM.md)               | PluginBase, JavaPlugin, lifecycle, registries                |
| [Entity & Player](ENTITY_PLAYER.md)             | ECS architecture, Entity hierarchy, Inventory                |
| [World & Chunks](WORLD_CHUNKS.md)               | World, ChunkStore, coordinate systems                        |

## Quick Reference

### Creating a Plugin

```java
public class MyPlugin extends JavaPlugin {
    public MyPlugin(JavaPluginInit init) {
        super(init);
    }

    @Override
    protected void setup() {
        getEventRegistry().registerGlobal(
            PlayerInteractEvent.class,
            this::onInteract
        );

        getCommandRegistry().registerCommand(new MyCommand());
    }

    @Override
    protected void shutdown() {
        // Cleanup
    }
}
```

### Manifest (manifest.json)

```json
{
    "Group": "mygroup",
    "Name": "myplugin",
    "Version": "1.0.0",
    "Main": "com.example.MyPlugin",
    "ServerVersion": "*",
    "IncludesAssetPack": true
}
```

### Handling Events

```java
public void onInteract(PlayerInteractEvent event) {
    if (event.isCancelled()) return;

    Player player = event.getPlayer();
    // Handle interaction
    event.setCancelled(true);
}
```

### Event Registration with Priority

```java
getEventRegistry().register(
    EventPriority.EARLY,
    PlayerInteractEvent.class,
    this::onInteract
);
```

### Opening a Window

```java
MyWindow window = new MyWindow();
OpenWindow packet = player.getWindowManager().openWindow(window);
player.getPlayerRef().getPacketHandler().write(packet);
```

### Accessing World Blocks

```java
World world = player.getWorld();

// Via world (absolute coordinates)
int blockId = world.getBlock(x, y, z);

// Via chunk (local coordinates)
long chunkIndex = ChunkUtil.indexChunkFromBlock(x, z);
WorldChunk chunk = world.getChunkIfLoaded(chunkIndex);
int localX = x & 31;
int localZ = z & 31;
int blockId = chunk.getBlock(localX, y, localZ);
```

### Player Inventory

```java
Inventory inv = player.getInventory();
ItemStack item = inv.getItemInHand();

// Inventory sections (IDs)
// HOTBAR = -1
// STORAGE = -2
// ARMOR = -3
// UTILITY = -5
// TOOLS = -8
// BACKPACK = -9
```

## Key Constants

### Chunk System

| Constant        | Value | Description           |
| --------------- | ----- | --------------------- |
| SIZE            | 32    | Blocks per chunk side |
| HEIGHT          | 320   | Total world height    |
| HEIGHT_SECTIONS | 10    | Vertical sections     |
| SIZE_BLOCKS     | 32768 | Blocks per section    |
| MIN_Y           | 0     | Minimum block Y       |
| MIN_ENTITY_Y    | -32   | Minimum entity Y      |

### Event Priority Values

| Priority | Value  |
| -------- | ------ |
| FIRST    | -21844 |
| EARLY    | -10922 |
| NORMAL   | 0      |
| LATE     | 10922  |
| LAST     | 21844  |

### Protocol

| Constant        | Value               |
| --------------- | ------------------- |
| Max packet size | 1,677,721,600 bytes |
| Frame header    | 8 bytes             |
| Max packet ID   | 512                 |

## Coordinate Encoding

### Chunk Index

```java
// Encode
long index = (chunkX << 32) | (chunkZ & 0xFFFFFFFFL)

// Decode
int chunkX = ChunkUtil.xOfChunkIndex(index)
int chunkZ = ChunkUtil.zOfChunkIndex(index)
```

### Block Index (within section)

```java
// Encode
int index = ((y & 31) << 10) | ((z & 31) << 5) | (x & 31)

// Decode
int x = index & 31
int z = (index >> 5) & 31
int y = (index >> 10) & 31
```

### Block to Chunk

```java
int chunkCoord = blockCoord >> 5    // blockCoord / 32
int localCoord = blockCoord & 31    // blockCoord % 32
```

## Plugin Lifecycle

```
NONE → SETUP → START → ENABLED → SHUTDOWN → DISABLED
```

## File Locations

| Type      | Path                              |
| --------- | --------------------------------- |
| Items     | `Server/Item/Items/**/*.json`     |
| Blocks    | `Server/Item/Blocks/**/*.json`    |
| Sounds    | `Server/Audio/SoundEvents/*.json` |
| Models    | `Server/Models/**/*.blockymodel`  |
| Languages | `Server/Languages/{lang}/*.lang`  |

## Localization

Files use properties format in `Server/Languages/en-US/`:

```properties
# server/items.lang
server.items.my_item.name = My Item
server.items.my_item.description = Item description
```

Key prefix derived from file path.
