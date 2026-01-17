---
title: "Networking and Packet System"
---

# Hytale Server API - Networking & Packet System

## Packet Interface

Location: `com/hypixel/hytale/protocol/Packet.java`

```java
public interface Packet {
    int getId();
    void serialize(@Nonnull ByteBuf byteBuf);
    int computeSize();
}
```

## Frame Format

```
[4 bytes: LE payload length]
[4 bytes: LE packet ID]
[N bytes: payload (compressed or uncompressed)]
```

**Constants:**

- Frame header: 8 bytes minimum
- Maximum payload size: 1,677,721,600 bytes (1.6 GB)
- All integers: Little-Endian byte order

---

## PacketRegistry

Location: `com/hypixel/hytale/protocol/PacketRegistry.java`

### PacketInfo Structure

```java
public static final class PacketInfo extends Record {
    int id;
    String name;
    Class<? extends Packet> type;
    int fixedBlockSize;
    int maxSize;
    boolean compressed;
    BiFunction<ByteBuf, Integer, ValidationResult> validate;
    BiFunction<ByteBuf, Integer, Packet> deserialize;
}
```

### Key Methods

| Method          | Description                |
| --------------- | -------------------------- |
| getById(int id) | Lookup packet by ID        |
| getId(Class)    | Lookup ID by packet type   |
| all()           | Get all registered packets |

---

## Packet Categories

### Connection Control (0-3)

| ID  | Packet     | Compressed | Fixed Size | Max Size   |
| --- | ---------- | ---------- | ---------- | ---------- |
| 0   | Connect    | No         | 82         | 38,161     |
| 1   | Disconnect | No         | 2          | 16,384,007 |
| 2   | Ping       | No         | 29         | 29         |
| 3   | Pong       | No         | 20         | 20         |

### Authentication (10-18)

| ID  | Packet           | Compressed | Description             |
| --- | ---------------- | ---------- | ----------------------- |
| 10  | Status           | No         | Server status           |
| 11  | AuthGrant        | No         | Auth grant (max 49,171) |
| 12  | AuthToken        | No         | Client auth token       |
| 13  | ServerAuthToken  | No         | Server auth token       |
| 14  | ConnectAccept    | No         | Connection accepted     |
| 15  | PasswordResponse | No         | Password response       |
| 16  | PasswordAccepted | No         | Password valid          |
| 17  | PasswordRejected | No         | Password invalid        |
| 18  | ClientReferral   | No         | Referral data           |

### World Setup (20-34)

| ID    | Packet                      | Compressed | Description         |
| ----- | --------------------------- | ---------- | ------------------- |
| 20    | WorldSettings               | Yes        | World configuration |
| 21    | WorldLoadProgress           | No         | Loading progress    |
| 22    | WorldLoadFinished           | No         | Loading complete    |
| 23    | RequestAssets               | Yes        | Asset request       |
| 24    | InitializeAssets            | Yes        | Asset init          |
| 25    | AssetPart                   | Yes        | Asset chunk         |
| 26    | FinalizeAssets              | Yes        | Asset complete      |
| 27-28 | Asset management            | -          | -                   |
| 29-34 | Update rate, time, features | -          | -                   |

### Asset Updates (40-85)

| ID    | Packet                  | Description            |
| ----- | ----------------------- | ---------------------- |
| 40    | UpdateBlockTypes        | Block type definitions |
| 41    | UpdateBlockHitboxes     | Block collision data   |
| 42    | UpdateBlockSoundSets    | Block sounds           |
| 43    | UpdateItemSoundSets     | Item sounds            |
| 44    | UpdateBlockParticleSets | Block particles        |
| 45-85 | Various asset updates   | All compressed         |

### Player & Movement (100-130)

| ID  | Packet                    | Compressed | Fixed Size | Description          |
| --- | ------------------------- | ---------- | ---------- | -------------------- |
| 100 | SetClientId               | No         | 4          | Assign client ID     |
| 101 | SetGameMode               | No         | -          | Game mode change     |
| 102 | SetMovementStates         | No         | -          | Movement state flags |
| 103 | SetBlockPlacementOverride | No         | -          | Placement override   |
| 104 | JoinWorld                 | No         | 18         | World entry          |
| 105 | ClientReady               | No         | -          | Client ready signal  |
| 106 | LoadHotbar                | No         | -          | Load hotbar          |
| 107 | SaveHotbar                | No         | -          | Save hotbar          |
| 108 | ClientMovement            | No         | 153        | Position/velocity    |
| 109 | ClientTeleport            | No         | 52         | Teleport             |
| 110 | UpdateMovementSettings    | No         | 252        | Movement config      |
| 111 | MouseInteraction          | No         | -          | Mouse input          |

### World/Chunk Management (131-159)

| ID  | Packet               | Compressed | Fixed Size | Description      |
| --- | -------------------- | ---------- | ---------- | ---------------- |
| 131 | SetChunk             | Yes        | 13         | Chunk data       |
| 132 | SetChunkHeightmap    | Yes        | -          | Heightmap data   |
| 133 | SetChunkTintmap      | Yes        | -          | Tint data        |
| 134 | SetChunkEnvironments | Yes        | -          | Environment data |
| 135 | UnloadChunk          | No         | 8          | Unload chunk     |
| 136 | SetFluids            | Yes        | 13         | Fluid data       |
| 137 | ServerSetBlock       | No         | 19         | Single block     |
| 141 | ServerSetBlocks      | No         | -          | Multiple blocks  |
| 142 | ServerSetFluid       | No         | -          | Single fluid     |
| 143 | ServerSetFluids      | No         | -          | Multiple fluids  |

### Time & Weather (145-152)

| ID  | Packet                      | Compressed | Fixed Size |
| --- | --------------------------- | ---------- | ---------- |
| 145 | UpdateTimeSettings          | No         | 10         |
| 146 | UpdateTime                  | No         | 13         |
| 147 | UpdateEditorTimeOverride    | No         | 14         |
| 148 | ClearEditorTimeOverride     | No         | -          |
| 149 | UpdateWeather               | No         | 8          |
| 150 | UpdateEditorWeatherOverride | No         | -          |

### Entity Updates (160-168)

| ID  | Packet              | Compressed | Fixed Size | Description          |
| --- | ------------------- | ---------- | ---------- | -------------------- |
| 160 | SetEntitySeed       | No         | 4          | Entity seed          |
| 161 | EntityUpdates       | Yes        | -          | Batch entity updates |
| 162 | PlayAnimation       | No         | -          | Animation playback   |
| 163 | ChangeVelocity      | No         | 35         | Velocity change      |
| 164 | ApplyKnockback      | No         | 38         | Knockback effect     |
| 165 | SpawnModelParticles | No         | -          | Model particles      |
| 166 | MountMovement       | No         | 59         | Mount movement       |
| 167 | MountNPC            | No         | 16         | Mount entity         |
| 168 | DismountNPC         | No         | 0          | Dismount entity      |

### Inventory (167-179)

| ID  | Packet                | Compressed | Fixed Size | Description        |
| --- | --------------------- | ---------- | ---------- | ------------------ |
| 167 | UpdatePlayerInventory | Yes        | -          | Inventory update   |
| 171 | SetCreativeItem       | No         | -          | Creative mode item |
| 172 | DropCreativeItem      | No         | -          | Drop creative item |
| 173 | SmartGiveCreativeItem | No         | -          | Smart give item    |
| 174 | DropItemStack         | No         | 12         | Drop item          |
| 175 | MoveItemStack         | No         | 20         | Move item          |
| 176 | SmartMoveItemStack    | No         | 13         | Smart move item    |
| 177 | SetActiveSlot         | No         | 8          | Active slot        |
| 178 | SwitchHotbarBlockSet  | No         | -          | Hotbar set         |
| 179 | InventoryAction       | No         | 6          | Inventory action   |

### Windows/UI (200-221)

| ID  | Packet             | Compressed | Fixed Size | Description    |
| --- | ------------------ | ---------- | ---------- | -------------- |
| 200 | OpenWindow         | Yes        | -          | Open window    |
| 201 | UpdateWindow       | Yes        | -          | Update window  |
| 202 | CloseWindow        | No         | 4          | Close window   |
| 203 | SendWindowAction   | No         | -          | Window action  |
| 204 | ClientOpenWindow   | No         | -          | Client open    |
| 210 | ServerMessage      | No         | -          | Server message |
| 211 | ChatMessage        | No         | -          | Chat message   |
| 212 | Notification       | No         | -          | Notification   |
| 213 | KillFeedMessage    | No         | -          | Kill feed      |
| 214 | ShowEventTitle     | No         | -          | Event title    |
| 215 | HideEventTitle     | No         | 4          | Hide title     |
| 216 | SetPage            | No         | 2          | Set page       |
| 217 | CustomHud          | Yes        | -          | Custom HUD     |
| 218 | CustomPage         | Yes        | -          | Custom page    |
| 219 | CustomPageEvent    | No         | -          | Page event     |
| 220 | EditorBlocksChange | Yes        | -          | Editor blocks  |
| 221 | ServerInfo         | No         | -          | Server info    |

### Camera (258-261)

| ID  | Packet               | Compressed | Fixed Size |
| --- | -------------------- | ---------- | ---------- |
| 258 | SetServerCamera      | No         | 157        |
| 259 | CameraShakeEffect    | No         | 9          |
| 260 | RequestFlyCameraMode | No         | 1          |
| 261 | SetFlyCameraMode     | No         | 1          |

### Interactions (264-268)

| ID  | Packet                 | Compressed | Fixed Size | Description      |
| --- | ---------------------- | ---------- | ---------- | ---------------- |
| 264 | SyncInteractionChains  | No         | -          | Sync chains      |
| 265 | CancelInteractionChain | No         | -          | Cancel chain     |
| 266 | PlayInteractionFor     | No         | -          | Play interaction |
| 267 | MountNPC               | No         | 16         | Mount NPC        |
| 268 | DismountNPC            | No         | 0          | Dismount         |

### Asset Editor (300+)

| ID   | Packet         | Compressed | Description       |
| ---- | -------------- | ---------- | ----------------- |
| 300  | FailureReply   | No         | Operation failed  |
| 301  | SuccessReply   | No         | Operation success |
| 302+ | Editor packets | Yes        | Asset editor      |

---

## Netty Pipeline

### PacketEncoder

Location: `com/hypixel/hytale/protocol/io/netty/PacketEncoder.java`

```java
@ChannelHandler.Sharable
public class PacketEncoder extends MessageToByteEncoder<Packet>
```

Handles:

- CachedPacket detection and reuse
- PacketStatsRecorder lookup
- Frame writing via PacketIO

### PacketDecoder

Location: `com/hypixel/hytale/protocol/io/netty/PacketDecoder.java`

```java
public class PacketDecoder extends ByteToMessageDecoder
```

**Constants:**

- LENGTH_PREFIX_SIZE = 4
- PACKET_ID_SIZE = 4
- MIN_FRAME_SIZE = 8

Process:

1. Wait for minimum 8 bytes
2. Read 4-byte LE payload length
3. Validate length <= 1,677,721,600
4. Read 4-byte LE packet ID
5. Lookup PacketInfo
6. Wait for complete frame
7. Decompress if needed
8. Deserialize packet

---

## Compression (ZStd)

- Library: `com.github.luben.zstd`
- Level: `-Dhytale.protocol.compressionLevel` (default: Zstd.defaultCompressionLevel())
- Applied to packets marked `compressed=true` in PacketRegistry

---

## Serialization Helpers

### VarInt Encoding

Location: `com/hypixel/hytale/protocol/io/VarInt.java`

7 bits per byte with continuation bit:

| Range                   | Bytes |
| ----------------------- | ----- |
| 0 - 127                 | 1     |
| 128 - 16,383            | 2     |
| 16,384 - 2,097,151      | 3     |
| 2,097,152 - 268,435,455 | 4     |
| 268,435,456+            | 5     |

**Methods:**

```java
void write(ByteBuf buf, int value)
int read(ByteBuf buf)
int peek(ByteBuf buf, int index)
int length(ByteBuf buf, int index)
int size(int value)
```

### String Encoding

**Fixed-length (null-padded):**

```java
readFixedString(ByteBuf, int offset, int length)
readFixedAsciiString(ByteBuf, int offset, int length)
writeFixedString(ByteBuf, String, int length)
writeFixedAsciiString(ByteBuf, String, int length)
```

**Variable-length (VarInt-prefixed):**

```java
readVarString(ByteBuf, int offset)
readVarAsciiString(ByteBuf, int offset)
writeVarString(ByteBuf, String, int maxLength)
writeVarAsciiString(ByteBuf, String, int maxLength)
```

### Other Types

```java
// Byte arrays
readBytes(ByteBuf, int offset, int length)
readByteArray(ByteBuf, int offset, int length)
writeFixedBytes(ByteBuf, byte[], int length)

// Numeric arrays
readShortArrayLE(ByteBuf, int offset, int length)
readFloatArrayLE(ByteBuf, int offset, int length)

// IEEE 16-bit float
readHalfLE(ByteBuf, int index)
writeHalfLE(ByteBuf, float value)

// UUID (16 bytes)
readUUID(ByteBuf, int offset)
writeUUID(ByteBuf, UUID)
```

---

## PacketHandler

Location: `com/hypixel/hytale/server/core/io/PacketHandler.java`

```java
public abstract class PacketHandler implements IPacketReceiver {
    public static final int MAX_PACKET_ID = 512;
}
```

**Abstract Methods:**

```java
String getIdentifier();
void accept(Packet packet);
```

**Packet Sending:**

```java
void write(Packet... packets)
void write(Packet packet)
void writeNoCache(Packet packet)
void writePacket(Packet packet, boolean cache)
```

**Queuing:**

```java
void setQueuePackets(boolean queuePackets)
void tryFlush()
```

**Connection:**

```java
void disconnect(String message)
void registered(PacketHandler oldHandler)
void unregistered(PacketHandler newHandler)
void closed(ChannelHandlerContext ctx)
```

**Ping:**

```java
void tickPing(float dt)
void sendPing()
void handlePong(Pong packet)
PingInfo getPingInfo(PongType pongType)
```

### PingInfo

```java
public static class PingInfo {
    public static final TimeUnit TIME_UNIT = TimeUnit.MICROSECONDS;
    public static final TimeUnit PING_FREQUENCY_UNIT = TimeUnit.SECONDS;
    public static final int PING_HISTORY_LENGTH = 15;
}
```

---

## CachedPacket

Location: `com/hypixel/hytale/protocol/CachedPacket.java`

Wraps packets to cache serialized ByteBuf:

```java
CachedPacket<T> cache(T packet)
Class<T> getPacketType()
int getCachedSize()
```

---

## Packet Statistics

Location: `com/hypixel/hytale/protocol/io/PacketStatsRecorder.java`

```java
public interface PacketStatsRecorder {
    AttributeKey<PacketStatsRecorder> CHANNEL_KEY;
    PacketStatsRecorder NOOP;

    void recordSend(int packetId, int uncompressedSize, int compressedSize);
    void recordReceive(int packetId, int uncompressedSize, int compressedSize);
    PacketStatsEntry getEntry(int packetId);
}
```

Tracks:

- Send/receive counts
- Uncompressed/compressed sizes (min, max, avg, total)
- Recent statistics (last 30 seconds)

---

## Protocol Utilities

Location: `com/hypixel/hytale/protocol/io/netty/ProtocolUtil.java`

**Application Error Codes:**
| Code | Constant |
|------|----------|
| 0 | APPLICATION_NO_ERROR |
| 1 | APPLICATION_RATE_LIMITED |
| 2 | APPLICATION_AUTH_FAILED |
| 3 | APPLICATION_INVALID_VERSION |

**Methods:**

```java
void closeConnection(Channel channel)
void closeConnection(Channel channel, QuicTransportError error)
void closeApplicationConnection(Channel channel)
void closeApplicationConnection(Channel channel, int errorCode)
```

Supports both QuicChannel and QuicStreamChannel.

---

## Connect Packet Example

**ID:** 0
**Compressed:** No
**Fixed Size:** 82 bytes

**Fields:**
| Field | Type | Size | Description |
|-------|------|------|-------------|
| protocolHash | String | 64 bytes | Fixed ASCII |
| clientType | ClientType | 1 byte | Enum |
| uuid | UUID | 16 bytes | Player UUID |
| language | String | Variable | Optional ASCII |
| identityToken | String | Variable | Optional UTF-8 |
| username | String | Variable | ASCII (max 16) |
| referralData | byte[] | Variable | Optional |
| referralSource | HostAddress | Variable | Optional |

**Layout:**

```
[0-1]     Nullable bit field
[1-65]    protocolHash (64 bytes)
[65]      clientType (1 byte)
[66-81]   uuid (16 bytes)
[82-85]   language offset
[86-89]   identityToken offset
[90-93]   username offset
[94-97]   referralData offset
[98-101]  referralSource offset
[102+]    Variable field data
```
