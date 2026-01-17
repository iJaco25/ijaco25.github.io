---
title: "Plugin System"
---

# Hytale Server API - Plugin System

## PluginBase

Location: `com/hypixel/hytale/server/core/plugin/PluginBase.java`

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| logger | HytaleLogger | Plugin logger |
| identifier | PluginIdentifier | Unique identifier (group:name) |
| manifest | PluginManifest | Plugin manifest |
| dataDirectory | Path | Data directory path |
| configs | List<Config<?>> | Configuration files |
| state | PluginState | Current lifecycle state |
| shutdownTasks | CopyOnWriteArrayList<BooleanConsumer> | Shutdown callbacks |
| basePermission | String | Base permission node |

**Registries:**
| Field | Type | Description |
|-------|------|-------------|
| clientFeatureRegistry | ClientFeatureRegistry | Client features |
| commandRegistry | CommandRegistry | Commands |
| eventRegistry | EventRegistry | Event listeners |
| blockStateRegistry | BlockStateRegistry | Block states |
| entityRegistry | EntityRegistry | Entity types |
| taskRegistry | TaskRegistry | Scheduled tasks |
| entityStoreRegistry | ComponentRegistryProxy<EntityStore> | Entity components |
| chunkStoreRegistry | ComponentRegistryProxy<ChunkStore> | Chunk components |
| assetRegistry | AssetRegistry | Asset stores |
| codecMapRegistries | Map<Codec<?>, IRegistry> | Codec registries |

**Lifecycle Methods:**

```java
protected void setup();      // Override for setup logic
protected void start();      // Override for start logic
protected void shutdown();   // Override for cleanup
```

**Configuration Methods:**

```java
<T> Config<T> withConfig(BuilderCodec<T> configCodec)
<T> Config<T> withConfig(String name, BuilderCodec<T> configCodec)
CompletableFuture<Void> preLoad()
```

**Getter Methods:**

```java
HytaleLogger getLogger()
PluginIdentifier getIdentifier()
PluginManifest getManifest()
Path getDataDirectory()
PluginState getState()
boolean isEnabled()
boolean isDisabled()
```

---

## JavaPlugin

Location: `com/hypixel/hytale/server/core/plugin/JavaPlugin.java`

Extends `PluginBase` for JAR-based plugins.

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| file | Path | JAR file path |
| classLoader | PluginClassLoader | Plugin class loader |

**Methods:**

```java
Path getFile()
PluginClassLoader getClassLoader()
PluginType getType()  // Returns PluginType.PLUGIN
```

---

## PluginState

Location: `com/hypixel/hytale/server/core/plugin/PluginState.java`

| State    | Description              |
| -------- | ------------------------ |
| NONE     | Initial state            |
| SETUP    | Setup phase executing    |
| START    | Start phase executing    |
| ENABLED  | Fully operational        |
| SHUTDOWN | Shutdown phase executing |
| DISABLED | Stopped/disabled         |

**Lifecycle Flow:**

```
NONE → SETUP → START → ENABLED → SHUTDOWN → DISABLED
```

---

## PluginManifest

Location: `com/hypixel/hytale/common/plugin/PluginManifest.java`

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| group | String | Plugin group/namespace |
| name | String | Plugin name |
| version | Semver | Semantic version |
| description | String | Plugin description |
| authors | List<AuthorInfo> | Author information |
| website | String | Plugin website URL |
| main | String | Main class (fully qualified) |
| serverVersion | SemverRange | Required server version |
| dependencies | Map<PluginIdentifier, SemverRange> | Required dependencies |
| optionalDependencies | Map<PluginIdentifier, SemverRange> | Optional dependencies |
| loadBefore | Map<PluginIdentifier, SemverRange> | Load ordering |
| subPlugins | List<PluginManifest> | Sub-plugin definitions |
| disabledByDefault | boolean | Disabled by default |
| includesAssetPack | boolean | Contains asset pack |

**Constants:**

- `CORE_GROUP = "Hytale"`
- `CORE_VERSION` - Server version

**JSON Format:**

```json
{
    "Group": "namespace",
    "Name": "pluginname",
    "Version": "1.0.0",
    "Description": "Plugin description",
    "Authors": [{ "Name": "Author", "Email": "email", "Url": "website" }],
    "Website": "https://example.com",
    "Main": "com.example.plugin.MainClass",
    "ServerVersion": "*",
    "Dependencies": { "group:plugin": "1.0.0" },
    "OptionalDependencies": { "group:optional": "*" },
    "LoadBefore": { "group:other": "*" },
    "SubPlugins": [],
    "DisabledByDefault": false,
    "IncludesAssetPack": true
}
```

---

## AuthorInfo

Location: `com/hypixel/hytale/common/plugin/AuthorInfo.java`

**Fields:**
| Field | Type |
|-------|------|
| name | String |
| email | String |
| url | String |

---

## PluginIdentifier

Location: `com/hypixel/hytale/common/plugin/PluginIdentifier.java`

**Fields:**
| Field | Type |
|-------|------|
| group | String |
| name | String |

**Methods:**

```java
String toString()  // Returns "group:name"
static PluginIdentifier fromString(String str)  // Parse "group:name"
```

---

## PluginManager

Location: `com/hypixel/hytale/server/core/plugin/PluginManager.java`

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| MODS_PATH | Path | Mods directory path |
| instance | PluginManager | Singleton instance |
| loadOrder | List<PendingLoadPlugin> | Plugin load order |
| loading | Map<PluginIdentifier, PluginBase> | Plugins loading |
| corePluginClassLoader | PluginClassLoader | Core class loader |
| corePlugins | List<PendingLoadPlugin> | Core plugins |
| bridgeClassLoader | PluginBridgeClassLoader | Bridge class loader |
| lock | ReentrantReadWriteLock | Thread-safe access |
| plugins | Map<PluginIdentifier, PluginBase> | Loaded plugins |
| classLoaders | Map<Path, PluginClassLoader> | Class loaders |
| loadExternalPlugins | boolean | Load external plugins |
| state | PluginState | Manager state |
| availablePlugins | Map<PluginIdentifier, PluginManifest> | Available plugins |

**Core Methods:**

```java
static PluginManager get()
void registerCorePlugin(PluginManifest builder)
void setup() throws URISyntaxException, IOException
void start()
void shutdown()
```

**Plugin Access:**

```java
List<PluginBase> getPlugins()
PluginBase getPlugin(PluginIdentifier identifier)
boolean hasPlugin(PluginIdentifier identifier, SemverRange range)
Map<PluginIdentifier, PluginManifest> getAvailablePlugins()
```

**Plugin Loading:**

```java
boolean load(PluginIdentifier identifier)
boolean load(PendingLoadPlugin pendingLoadPlugin)
boolean findAndLoadPlugin(PluginIdentifier identifier)
static PluginManifest loadManifest(Path file)
```

**Plugin Control:**

```java
boolean reload(PluginIdentifier identifier)
boolean unload(PluginIdentifier identifier)
void unloadJavaPlugin(JavaPlugin plugin)
```

**Dependency Validation:**

```java
void validatePluginDeps(PendingLoadPlugin plugin, Map<PluginIdentifier, PendingLoadPlugin> pending)
boolean dependenciesMatchState(PluginBase plugin, PluginState requiredState, PluginState stage)
```

---

## PluginClassLoader

Location: `com/hypixel/hytale/server/core/plugin/PluginClassLoader.java`

Extends `URLClassLoader`.

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| THIRD_PARTY_LOADER_NAME | String | "ThirdPartyPlugin" |
| pluginManager | PluginManager | Manager reference |
| inServerClassPath | boolean | Is builtin plugin |
| plugin | JavaPlugin | Associated plugin |

**Methods:**

```java
boolean isInServerClassPath()
void setPlugin(JavaPlugin plugin)
Class<?> loadClass(String name, boolean resolve)
Class<?> loadClass0(String name, boolean useBridge)
Class<?> loadLocalClass(String name)
URL getResource(String name)
Enumeration<URL> getResources(String name)
static boolean isFromThirdPartyPlugin(Throwable throwable)
```

**Class Resolution Order:**

1. Server classpath
2. Plugin's own JAR
3. Bridge classloader (dependencies)

---

## PluginBridgeClassLoader

Inner class of PluginManager.

Extends `ClassLoader` to enable inter-plugin class access with dependency respect.

**Methods:**

```java
Class<?> loadClass0(String name, PluginClassLoader pluginClassLoader)
Class<?> loadClass0(String name, PluginClassLoader pluginClassLoader, PluginManifest manifest)
URL getResource0(String name, PluginClassLoader pluginClassLoader)
Enumeration<URL> getResources0(String name, PluginClassLoader pluginClassLoader)
```

---

## PluginInit

Location: `com/hypixel/hytale/server/core/plugin/PluginInit.java`

**Fields:**
| Field | Type |
|-------|------|
| pluginManifest | PluginManifest |
| dataDirectory | Path |

**Methods:**

```java
PluginManifest getPluginManifest()
Path getDataDirectory()
boolean isInServerClassPath()  // Returns true
```

---

## JavaPluginInit

Location: `com/hypixel/hytale/server/core/plugin/JavaPluginInit.java`

Extends `PluginInit`.

**Fields:**
| Field | Type |
|-------|------|
| file | Path |
| classLoader | PluginClassLoader |

**Methods:**

```java
Path getFile()
PluginClassLoader getClassLoader()
boolean isInServerClassPath()  // Delegates to classLoader
```

---

## EventRegistry

Location: `com/hypixel/hytale/event/EventRegistry.java`

Extends `Registry<EventRegistration<?, ?>>` and implements `IEventRegistry`.

**Registration Methods:**

```java
// Simple registration
<EventType extends IBaseEvent<Void>> EventRegistration<Void, EventType> register(
    Class<? super EventType> eventClass,
    Consumer<EventType> consumer
)

// With priority
<EventType extends IBaseEvent<Void>> EventRegistration<Void, EventType> register(
    EventPriority priority,
    Class<? super EventType> eventClass,
    Consumer<EventType> consumer
)

// With key
<KeyType, EventType extends IBaseEvent<KeyType>> EventRegistration<KeyType, EventType> register(
    Class<? super EventType> eventClass,
    KeyType key,
    Consumer<EventType> consumer
)

// Global (all events of type)
<KeyType, EventType extends IBaseEvent<KeyType>> EventRegistration<KeyType, EventType> registerGlobal(...)

// Async variants
<EventType extends IAsyncEvent<Void>> EventRegistration<Void, EventType> registerAsync(...)
<KeyType, EventType extends IAsyncEvent<KeyType>> EventRegistration<KeyType, EventType> registerAsyncGlobal(...)

// Unhandled (fallback)
<KeyType, EventType extends IBaseEvent<KeyType>> EventRegistration<KeyType, EventType> registerUnhandled(...)
```

---

## EventPriority

Location: `com/hypixel/hytale/event/EventPriority.java`

| Priority | Value  | Description      |
| -------- | ------ | ---------------- |
| FIRST    | -21844 | Highest priority |
| EARLY    | -10922 | Early            |
| NORMAL   | 0      | Default          |
| LATE     | 10922  | Late             |
| LAST     | 21844  | Lowest priority  |

---

## CommandRegistry

Location: `com/hypixel/hytale/server/core/command/system/CommandRegistry.java`

Extends `Registry<CommandRegistration>`.

**Methods:**

```java
CommandRegistration registerCommand(AbstractCommand command)
```

---

## TaskRegistry

Location: `com/hypixel/hytale/server/core/task/TaskRegistry.java`

Extends `Registry<TaskRegistration>`.

**Methods:**

```java
TaskRegistration registerTask(CompletableFuture<Void> task)
TaskRegistration registerTask(ScheduledFuture<Void> task)
```

**Scheduled Task Example (using HytaleServer.SCHEDULED_EXECUTOR):**

```java
import com.hypixel.hytale.server.core.HytaleServer;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

private ScheduledFuture<?> tickTask;

@Override
protected void start() {
    // Schedule a recurring task every 500ms
    tickTask = HytaleServer.SCHEDULED_EXECUTOR.scheduleAtFixedRate(
        this::onTick,
        1000,  // initial delay
        500,   // period
        TimeUnit.MILLISECONDS
    );
}

@Override
protected void shutdown() {
    if (tickTask != null) {
        tickTask.cancel(false);
    }
}

private void onTick() {
    // Task logic here
}
```

---

## EntityRegistry

Location: `com/hypixel/hytale/server/core/modules/entity/EntityRegistry.java`

Extends `Registry<EntityRegistration>`.

**Methods:**

```java
<T extends Entity> EntityRegistration registerEntity(
    String key,
    Class<T> clazz,
    Function<World, T> constructor,
    DirectDecodeCodec<T> codec
)
```

---

## AssetRegistry

Location: `com/hypixel/hytale/server/core/plugin/registry/AssetRegistry.java`

**Methods:**

```java
<K, T extends JsonAssetWithMap<K, M>, M extends AssetMap<K, T>, S extends AssetStore<K, T, M>>
AssetRegistry register(S assetStore)
```

---

## CodecMapRegistry

Location: `com/hypixel/hytale/server/core/plugin/registry/CodecMapRegistry.java`

Implements `IRegistry`.

**Methods:**

```java
CodecMapRegistry<T, C> register(String id, Class<? extends T> aClass, C codec)
CodecMapRegistry<T, C> register(Priority priority, String id, Class<? extends T> aClass, C codec)
```

**Inner Class Assets:**

```java
Assets<T, C> register(String id, Class<? extends T> aClass, BuilderCodec<? extends T> codec)
Assets<T, C> register(Priority priority, String id, Class<? extends T> aClass, BuilderCodec<? extends T> codec)
```

---

## PendingLoadPlugin

Location: `com/hypixel/hytale/server/core/plugin/pending/PendingLoadPlugin.java`

**Fields:**
| Field | Type |
|-------|------|
| identifier | PluginIdentifier |
| manifest | PluginManifest |
| path | Path |

**Abstract Methods:**

```java
PendingLoadPlugin createSubPendingLoadPlugin(PluginManifest pluginManifest)
PluginBase load()
boolean isInServerClassPath()
```

**Static Methods:**

```java
static List<PendingLoadPlugin> calculateLoadOrder(Map<PluginIdentifier, PendingLoadPlugin> pending)
```

---

## PendingLoadJavaPlugin

Location: `com/hypixel/hytale/server/core/plugin/pending/PendingLoadJavaPlugin.java`

Extends `PendingLoadPlugin`.

**Fields:**
| Field | Type |
|-------|------|
| urlClassLoader | PluginClassLoader |

**Methods:**

```java
JavaPlugin load()  // Instantiates main class with JavaPluginInit
```

---

## Plugin Events

### PluginEvent

Location: `com/hypixel/hytale/server/core/plugin/event/PluginEvent.java`

Implements `IEvent<Class<? extends PluginBase>>`.

**Fields:**
| Field | Type |
|-------|------|
| plugin | PluginBase |

### PluginSetupEvent

Location: `com/hypixel/hytale/server/core/plugin/event/PluginSetupEvent.java`

Extends `PluginEvent`. Fired during plugin setup phase.

---

## PluginType

Location: `com/hypixel/hytale/server/core/plugin/PluginType.java`

| Value  | Display Name |
| ------ | ------------ |
| PLUGIN | "Plugin"     |

---

## Complete Example

**manifest.json:**

```json
{
    "Group": "momo",
    "Name": "voidstorage",
    "Version": "1.0.0",
    "Description": "Void storage mod",
    "Main": "net.momo.voidstorage.VoidStoragePlugin",
    "ServerVersion": "*",
    "IncludesAssetPack": true
}
```

**Plugin Class:**

```java
import java.util.logging.Level;

public class VoidStoragePlugin extends JavaPlugin {
    private static VoidStoragePlugin instance;

    public VoidStoragePlugin(JavaPluginInit init) {
        super(init);
        instance = this;
    }

    @Override
    protected void setup() {
        // Register global event listener (receives all events of this type)
        getEventRegistry().registerGlobal(
            PlayerConnectEvent.class,
            event -> getLogger().at(Level.INFO).log("Player connected: %s", event.getPlayerRef().getUsername())
        );

        // Register command
        getCommandRegistry().registerCommand(new VoidStatusCommand());
    }

    @Override
    protected void start() {
        getLogger().at(Level.INFO).log("Plugin started");
    }

    @Override
    protected void shutdown() {
        getLogger().at(Level.INFO).log("Plugin shutting down");
    }

    public static VoidStoragePlugin getInstance() {
        return instance;
    }
}
```
