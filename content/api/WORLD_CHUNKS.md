---
title: "World and Chunk System"
---

# Hytale Server API - World and Chunk System

## World

Location: `com/hypixel/hytale/server/core/universe/world/World.java`

```java
public class World extends TickingThread implements Executor, ChunkAccessor<WorldChunk>, IWorldChunks, IMessageReceiver
```

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| name | String | World identifier |
| savePath | Path | Disk storage path |
| worldConfig | WorldConfig | World configuration |
| chunkStore | ChunkStore | Chunk storage manager |
| entityStore | EntityStore | Entity storage manager |
| chunkLighting | ChunkLightingManager | Lighting system |
| worldMapManager | WorldMapManager | World map manager |
| worldPathConfig | WorldPathConfig | Path configuration |
| taskQueue | Deque<Runnable> | Task execution queue |
| alive | AtomicBoolean | World alive state |
| eventRegistry | EventRegistry | Event system |
| isTicking | boolean | Whether world updates |
| isPaused | boolean | Whether world is paused |
| tick | long | Current tick counter |
| random | Random | Random generator |
| entitySeed | AtomicInteger | Entity RNG seed |
| players | Map<UUID, PlayerRef> | Connected players |

**Constants:**

- `SAVE_INTERVAL = 10.0f`
- `DEFAULT = "default"`

**Key Methods:**

```java
CompletableFuture<World> init()
CompletableFuture<PlayerRef> addPlayer(PlayerRef, Transform, Boolean, Boolean)
CompletableFuture<Void> drainPlayersTo(World)
WorldChunk loadChunkIfInMemory(long index)
WorldChunk getChunkIfLoaded(long index)
WorldChunk getChunkIfInMemory(long index)
WorldChunk getChunkIfNonTicking(long index)
CompletableFuture<WorldChunk> getChunkAsync(long index)
void sendMessage(Message)
void consumeTaskQueue()
void setPaused(boolean)
void setTicking(boolean)
GameplayConfig getGameplayConfig()
DeathConfig getDeathConfig()
int getPlayerCount()
Collection<PlayerRef> getPlayerRefs()
```

---

## Universe

Location: `com/hypixel/hytale/server/core/universe/Universe.java`

```java
public class Universe extends JavaPlugin implements IMessageReceiver, MetricProvider
```

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| path | Path | Universe root directory |
| players | Map<UUID, PlayerRef> | All connected players |
| worlds | Map<String, World> | Worlds by name |
| worldsByUuid | Map<UUID, World> | Worlds by UUID |
| playerStorage | PlayerStorage | Player data storage |
| worldConfigProvider | WorldConfigProvider | Config loader |
| universeReady | CompletableFuture<Void> | Ready signal |

**Key Methods:**

```java
static Universe get()
CompletableFuture<World> addWorld(String name)
CompletableFuture<World> makeWorld(String name, Path savePath, WorldConfig config, boolean start)
CompletableFuture<World> loadWorld(String name)
World getWorld(String worldName)
World getWorld(UUID uuid)
World getDefaultWorld()
boolean removeWorld(String name)
void removeWorldExceptionally(String name)
List<PlayerRef> getPlayers()
PlayerRef getPlayer(UUID uuid)
PlayerRef getPlayer(String value, NameMatching matching)
CompletableFuture<PlayerRef> addPlayer(Channel, String, ProtocolVersion, UUID, String, PlayerAuthentication, int, PlayerSkin)
void removePlayer(PlayerRef)
CompletableFuture<void> runBackup()
```

---

## WorldChunk

Location: `com/hypixel/hytale/server/core/universe/world/chunk/WorldChunk.java`

```java
public class WorldChunk implements BlockAccessor, Component<ChunkStore>
```

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| world | World | Parent world |
| flagsLock | StampedLock | Flag synchronization |
| flags | Flags<ChunkFlag> | Chunk state flags |
| reference | Ref<ChunkStore> | Component reference |
| blockChunk | BlockChunk | Block data storage |
| blockComponentChunk | BlockComponentChunk | Block entity storage |
| entityChunk | EntityChunk | Entity storage |
| keepAlive | int | Keep-alive counter (default 15) |
| activeTimer | int | Activity timer (default 15) |
| needsSaving | boolean | Needs save flag |
| isSaving | boolean | Currently saving |
| keepLoaded | boolean | Force loaded |
| lightingUpdatesEnabled | boolean | Lighting updates |
| chunkLightTiming | AtomicLong | Lighting metrics |

**Constants:**

- `KEEP_ALIVE_DEFAULT = 15`

**Key Methods:**

```java
boolean is(ChunkFlag flag)
boolean not(ChunkFlag flag)
void setFlag(ChunkFlag flag, boolean value)
boolean toggleFlag(ChunkFlag flag)
void initFlags()
BlockChunk getBlockChunk()
BlockComponentChunk getBlockComponentChunk()
EntityChunk getEntityChunk()
int getBlock(int x, int y, int z)
boolean setBlock(int x, int y, int z, int id, BlockType, int rotation, int filler, int settings)
BlockState getState(int x, int y, int z)
void setState(int x, int y, int z, BlockState state, boolean notify)
int getFiller(int x, int y, int z)
int getRotationIndex(int x, int y, int z)
boolean setTicking(int x, int y, int z, boolean ticking)
boolean isTicking(int x, int y, int z)
short getHeight(int x, int z)
int getTint(int x, int z)
boolean getNeedsSaving()
boolean consumeNeedsSaving()
int getX()
int getZ()
long getIndex()
```

---

## ChunkFlag

Location: `com/hypixel/hytale/server/core/universe/world/chunk/ChunkFlag.java`

| Flag            | Description            |
| --------------- | ---------------------- |
| START_INIT      | Initialization started |
| INIT            | Fully initialized      |
| NEWLY_GENERATED | Procedurally generated |
| ON_DISK         | Saved to disk          |
| TICKING         | Actively ticking       |

---

## ChunkStore

Location: `com/hypixel/hytale/server/core/universe/world/storage/ChunkStore.java`

```java
public class ChunkStore implements WorldProvider
```

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| world | World | Parent world |
| store | Store<ChunkStore> | Component store |
| loader | IChunkLoader | Chunk I/O loader |
| saver | IChunkSaver | Chunk I/O saver |
| generator | IWorldGen | World generator |
| chunks | Long2ObjectConcurrentHashMap<ChunkLoadState> | Chunk cache |
| generatorLoaded | CompletableFuture<Void> | Generator ready |
| totalGeneratedChunksCount | AtomicInteger | Generated count |
| totalLoadedChunksCount | AtomicInteger | Loaded count |

**Constants:**

- `MAX_FAILURE_BACKOFF_NANOS` - 10 seconds
- `FAILURE_BACKOFF_NANOS` - 1 millisecond

**Key Methods:**

```java
World getWorld()
Store<ChunkStore> getStore()
IChunkLoader getLoader()
IChunkSaver getSaver()
IWorldGen getGenerator()
void setGenerator(IWorldGen)
LongSet getChunkIndexes()
int getLoadedChunksCount()
int getTotalGeneratedChunksCount()
int getTotalLoadedChunksCount()
void start(IResourceStorage)
void shutdown()
Ref<ChunkStore> getChunkReference(long index)
Ref<ChunkStore> getChunkSectionReference(int x, int y, int z)
CompletableFuture<Ref<ChunkStore>> getChunkReferenceAsync(long index)
CompletableFuture<Ref<ChunkStore>> getChunkReferenceAsync(long index, int flags)
boolean isChunkOnBackoff(long index, long maxFailureBackoffNanos)
void waitForLoadingChunks()
void remove(Ref<ChunkStore> reference, RemoveReason)
```

**ChunkLoadState Inner Class:**
| Field | Type |
|-------|------|
| lock | StampedLock |
| flags | int |
| future | CompletableFuture<Ref<ChunkStore>> |
| reference | Ref<ChunkStore> |
| throwable | Throwable |
| failedWhen | long |
| failedCounter | int |

---

## ChunkUtil

Location: `com/hypixel/hytale/math/util/ChunkUtil.java`

**Constants:**
| Constant | Value | Description |
|----------|-------|-------------|
| BITS | 5 | Bits per coordinate |
| SIZE | 32 | Chunk size |
| SIZE_2 | 1024 | SIZE^2 |
| SIZE_MINUS_1 | 31 | SIZE - 1 |
| SIZE_MASK | 31 | Bitmask |
| SIZE_COLUMNS | 1024 | Blocks per chunk |
| SIZE_COLUMNS_MASK | 1023 | Column mask |
| SIZE_BLOCKS | 32768 | Blocks per chunk (32^3) |
| BITS2 | 10 | 2D encoding bits |
| HEIGHT_SECTIONS | 10 | Vertical sections |
| HEIGHT | 320 | World height |
| HEIGHT_MINUS_1 | 319 | HEIGHT - 1 |
| MIN_Y | 0 | Minimum block Y |
| MIN_ENTITY_Y | -32 | Minimum entity Y |
| NOT_FOUND | indexChunk(INT_MIN, INT_MIN) | Invalid marker |

**Coordinate Methods:**

```java
long indexChunk(int x, int z)
int xOfChunkIndex(long index)
int zOfChunkIndex(long index)
long indexChunkFromBlock(int blockX, int blockZ)
long indexChunkFromBlock(double blockX, double blockZ)
int chunkCoordinate(int block)
int chunkCoordinate(double block)
int minBlock(int chunkCoord)
int maxBlock(int chunkCoord)
boolean isWithinLocalChunk(int x, int z)
boolean isSameChunk(int x0, int z0, int x1, int z1)
boolean isSameChunkSection(int x0, int y0, int z0, int x1, int y1, int z1)
```

**Block Indexing:**

```java
int indexBlock(int x, int y, int z)
int indexBlockInColumn(int x, int y, int z)
int xFromBlockInColumn(int index)
int yFromBlockInColumn(int index)
int zFromBlockInColumn(int index)
int localCoordinate(long v)
```

**Encoding:**

- Block index: `((y & 31) << 10) | ((z & 31) << 5) | (x & 31)`
- Chunk index: `(chunkX << 32) | chunkZ`

---

## BlockChunk

Location: `com/hypixel/hytale/server/core/universe/world/chunk/BlockChunk.java`

```java
public class BlockChunk implements Component<ChunkStore>
```

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| index | long | Chunk index |
| x | int | Chunk X |
| z | int | Chunk Z |
| height | ShortBytePalette | Heightmap (32x32) |
| tint | IntBytePalette | Color tints (32x32) |
| chunkSections | BlockSection[] | 10 vertical sections |
| environments | EnvironmentChunk | Environment data |
| needsPhysics | boolean | Physics recalc flag |
| needsSaving | boolean | Save needed flag |

**Constants:**

- `VERSION = 3`
- `SEND_LOCAL_LIGHTING_DATA = true`
- `SEND_GLOBAL_LIGHTING_DATA = false`

**Key Methods:**

```java
void load(int x, int z)
BlockSection getSectionAtBlockY(int y)
BlockSection getSectionAtIndex(int index)
BlockSection[] getChunkSections()
int getBlock(int x, int y, int z)
boolean setBlock(int x, int y, int z, int blockId, int rotation, int filler)
short getHeight(int x, int z)
short getHeight(int index)
void setHeight(int x, int z, short height)
short updateHeight(int x, int z)
short updateHeight(int x, int z, short startY)
int getTint(int x, int z)
void setTint(int x, int z, int tint)
int getEnvironment(int x, int y, int z)
void setEnvironment(int x, int y, int z, int environment)
byte getSkyLight(int x, int y, int z)
byte getRedBlockLight(int x, int y, int z)
byte getGreenBlockLight(int x, int y, int z)
byte getBlueBlockLight(int x, int y, int z)
short getBlockLight(int x, int y, int z)
boolean setTicking(int x, int y, int z, boolean ticking)
boolean isTicking(int x, int y, int z)
int getTickingBlocksCount()
Int2IntMap blockCounts()
IntSet blocks()
boolean getNeedsSaving()
boolean consumeNeedsSaving()
boolean consumeNeedsPhysics()
void markNeedsSaving()
void markNeedsPhysics()
```

---

## EntityStore

Location: `com/hypixel/hytale/server/core/universe/world/storage/EntityStore.java`

```java
public class EntityStore implements WorldProvider
```

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| world | World | Parent world |
| store | Store<EntityStore> | Component store |
| networkIdCounter | AtomicInteger | Network ID allocator |
| entitiesByUuid | Map<UUID, Ref<EntityStore>> | Entities by UUID |
| networkIdToRef | Int2ObjectMap<Ref<EntityStore>> | By network ID |

**Key Methods:**

```java
World getWorld()
Store<EntityStore> getStore()
void start(IResourceStorage)
void shutdown()
Ref<EntityStore> getRefFromUUID(UUID)
Ref<EntityStore> getRefFromNetworkId(int networkId)
int takeNextNetworkId()
```

---

## IWorldGen

Location: `com/hypixel/hytale/server/core/universe/world/worldgen/IWorldGen.java`

```java
public interface IWorldGen
```

**Methods:**

```java
WorldGenTimingsCollector getTimings()
CompletableFuture<GeneratedChunk> generate(int seed, long chunkIndex, int chunkX, int chunkZ, LongPredicate shouldContinue)
Transform[] getSpawnPoints(int seed)  // Deprecated
ISpawnProvider getDefaultSpawnProvider(int seed)
void shutdown()
```

---

## Coordinate Systems

### Chunk Encoding

```java
// Encode chunk coordinates to 64-bit long
long index = (chunkX << 32) | (chunkZ & 0xFFFFFFFFL)

// Decode
int chunkX = ChunkUtil.xOfChunkIndex(index)
int chunkZ = ChunkUtil.zOfChunkIndex(index)
```

### Block to Chunk

```java
// Block coordinate to chunk coordinate
int chunkCoord = blockCoord >> 5  // blockCoord / 32

// Local coordinate within chunk
int localCoord = blockCoord & 31  // blockCoord % 32

// Get chunk from block position
long chunkIndex = ChunkUtil.indexChunkFromBlock(blockX, blockZ)
```

### Block Indexing

```java
// Within section (32x32x32)
int blockIndex = ((y & 31) << 10) | ((z & 31) << 5) | (x & 31)

// Decode
int x = blockIndex & 31
int z = (blockIndex >> 5) & 31
int y = (blockIndex >> 10) & 31
```

### Vertical Sections

```java
// 10 sections of 32 blocks each = 320 total height
int sectionIndex = y >> 5  // y / 32
int localY = y & 31        // y % 32
```

---

## SetBlock Settings Flags

| Bit | Effect                     |
| --- | -------------------------- |
| 1   | Don't notify state update  |
| 2   | Skip block entity creation |
| 4   | Skip particle effects      |
| 8   | Skip filler placement      |
| 64  | Invalidate lighting        |
| 256 | Perform block update       |
| 512 | Skip height map update     |

---

## Data Flow

1. **World Loading:**
    - Universe loads WorldConfig
    - Creates World instance
    - Initializes ChunkStore and EntityStore
    - ChunkStore loads/generates on demand

2. **Chunk Loading:**
    - `ChunkStore.getChunkReferenceAsync()` initiates
    - Load from disk or generate
    - Runs pre-load processing
    - Marks TICKING when in player range

3. **Block Access:**
    - `WorldChunk.setBlock()` modifies blocks
    - Updates heightmap, lighting, physics
    - Marks chunk for save
    - Notifies clients

4. **Entity Storage:**
    - EntityStore manages all entities
    - Tracks by UUID and network ID
    - Notifies systems on changes
