---
title: "Item and Block System"
---

# Hytale Server API - Item and Block System

## Item System

### ItemBase

The protocol class for all items. Location: `com/hypixel/hytale/protocol/ItemBase.java`

**Identity & Display Fields:**
| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique identifier |
| name | String | Display name |
| model | String | Model reference |
| texture | String | Texture reference |
| icon | String | Icon reference |
| iconProperties | AssetIconProperties | Icon display properties |
| translationProperties | ItemTranslationProperties | Localization config |
| scale | float | Item scale multiplier |

**Stack & Durability Fields:**
| Field | Type | Description |
|-------|------|-------------|
| maxStack | int | Maximum stack size |
| durability | double | Item durability value |
| consumable | boolean | Whether item is consumable |
| variant | boolean | Whether item is a variant |

**Item Level & Quality:**
| Field | Type | Description |
|-------|------|-------------|
| itemLevel | int | Item level/tier |
| qualityIndex | int | Quality tier index |
| resourceTypes | ItemResourceType[] | Resource/crafting materials |
| set | String | Item set identifier |
| categories | String[] | Category tags |
| tagIndexes | int[] | Tag indices array |

**Animation & Visuals:**
| Field | Type | Description |
|-------|------|-------------|
| animation | String | Animation reference |
| playerAnimationsId | String | Player animation set ID |
| usePlayerAnimations | boolean | Use player animations |
| droppedItemAnimation | String | Animation for dropped items |
| particles | ModelParticle[] | Particle effects |
| firstPersonParticles | ModelParticle[] | First-person particles |
| trails | ModelTrail[] | Visual trails |
| light | ColorLight | Light emission |
| reticleIndex | int | Reticle configuration |
| clipsGeometry | boolean | Clips through geometry |
| renderDeployablePreview | boolean | Show deployment preview |

**Interactions:**
| Field | Type | Description |
|-------|------|-------------|
| interactions | Map<InteractionType, Integer> | Interaction type mappings |
| interactionVars | Map<String, Integer> | Interaction variables |
| interactionConfig | InteractionConfiguration | Interaction configuration |
| pullbackConfig | ItemPullbackConfiguration | Charge/pullback config |

**Specialization Fields:**
| Field | Type | Description |
|-------|------|-------------|
| blockId | int | Associated block ID |
| tool | ItemTool | Tool specialization |
| weapon | ItemWeapon | Weapon specialization |
| armor | ItemArmor | Armor specialization |
| gliderConfig | ItemGlider | Glider configuration |
| utility | ItemUtility | Utility properties |
| blockSelectorTool | BlockSelectorToolData | Block selector data |
| builderToolData | ItemBuilderToolData | Builder tool config |
| itemEntity | ItemEntityConfig | Entity display config |

**Sound & HUD:**
| Field | Type | Description |
|-------|------|-------------|
| soundEventIndex | int | Sound event index |
| itemSoundSetIndex | int | Sound set index |
| displayEntityStatsHUD | int[] | Stats displayed in HUD |
| itemAppearanceConditions | Map<Integer, ItemAppearanceCondition[]> | Appearance by variant |

---

### ItemTool

Tool specialization data.

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| specs | ItemToolSpec[] | Tool specifications |
| speed | float | Mining speed multiplier |

**ItemToolSpec Fields:**
| Field | Type | Description |
|-------|------|-------------|
| gatherType | String | Resource type (e.g., "wood", "stone") |
| power | float | Gathering power |
| quality | int | Tool quality level |

---

### ItemWeapon

Weapon specialization data.

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| statModifiers | Map<Integer, Modifier[]> | Stat modifiers by type |
| entityStatsToClear | int[] | Stats cleared on use |
| renderDualWielded | boolean | Dual-wield rendering |

---

### ItemArmor

Armor specialization data.

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| armorSlot | ItemArmorSlot | Equipment slot |
| baseDamageResistance | double | Base resistance value |
| damageResistance | Map<String, Modifier[]> | Resistance by damage type |
| damageEnhancement | Map<String, Modifier[]> | Damage enhancement |
| damageClassEnhancement | Map<String, Modifier[]> | Class-based enhancement |
| statModifiers | Map<Integer, Modifier[]> | Stat modifiers |
| cosmeticsToHide | Cosmetic[] | Hidden cosmetics |

**ItemArmorSlot Enum:**
| Value | Index |
|-------|-------|
| Head | 0 |
| Chest | 1 |
| Hands | 2 |
| Legs | 3 |

---

### Modifier

Stat modification data.

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| target | ModifierTarget | Min or Max target |
| calculationType | CalculationType | How to apply |
| amount | float | Modifier value |

**ModifierTarget Enum:**
| Value | Index |
|-------|-------|
| Min | 0 |
| Max | 1 |

**CalculationType Enum:**
| Value | Index |
|-------|-------|
| Additive | 0 |
| Multiplicative | 1 |

---

### ItemResourceType

Crafting resource definition.

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| id | String | Resource identifier |
| quantity | int | Required quantity (default: 1) |

---

## Block System

### BlockType

The protocol class for all blocks. Location: `com/hypixel/hytale/protocol/BlockType.java`

**Identity Fields:**
| Field | Type | Description |
|-------|------|-------------|
| item | String | Associated item ID |
| name | String | Display name |
| group | int | Block group index |
| tagIndexes | int[] | Tag indices |

**Rendering Fields:**
| Field | Type | Description |
|-------|------|-------------|
| drawType | DrawType | Rendering method |
| material | BlockMaterial | Material type |
| opacity | Opacity | Transparency level |
| shaderEffect | ShaderType[] | Shader effects |
| requiresAlphaBlending | boolean | Alpha blending required |

**Model Fields:**
| Field | Type | Description |
|-------|------|-------------|
| model | String | 3D model reference |
| modelTexture | ModelTexture[] | Model textures |
| modelScale | float | Model scale |
| modelAnimation | String | Model animation |
| looping | boolean | Animation loops |

**Cube Textures:**
| Field | Type | Description |
|-------|------|-------------|
| cubeTextures | BlockTextures[] | Cube-mapped textures |
| cubeSideMaskTexture | String | Side mask texture |
| cubeShadingMode | ShadingMode | Shading technique |

**Rotation:**
| Field | Type | Description |
|-------|------|-------------|
| randomRotation | RandomRotation | Random rotation mode |
| variantRotation | VariantRotation | Variant rotation mode |
| rotationYawPlacementOffset | Rotation | Placement rotation |

**Collision & Interaction:**
| Field | Type | Description |
|-------|------|-------------|
| hitbox | int | Collision hitbox index |
| interactionHitbox | int | Interaction hitbox index |
| interactionHint | String | Interaction hint text |
| interactions | Map<InteractionType, Integer> | Interaction mappings |

**Support System:**
| Field | Type | Description |
|-------|------|-------------|
| maxSupportDistance | int | Support propagation distance |
| blockSupportsRequiredFor | BlockSupportsRequiredForType | Requirement type |
| support | Map<BlockNeighbor, RequiredBlockFaceSupport[]> | Required supports |
| supporting | Map<BlockNeighbor, BlockFaceSupport[]> | Provides support |
| ignoreSupportWhenPlaced | boolean | Skip support check |

**Visual Effects:**
| Field | Type | Description |
|-------|------|-------------|
| particles | ModelParticle[] | Particle effects |
| blockParticleSetId | String | Particle set ID |
| blockBreakingDecalId | String | Breaking decal ID |
| particleColor | Color | Particle color |
| light | ColorLight | Light emission |
| tint | Tint | Color tint |
| biomeTint | Tint | Biome-based tint |

**Sound:**
| Field | Type | Description |
|-------|------|-------------|
| blockSoundSetIndex | int | Sound set reference |
| ambientSoundEventIndex | int | Ambient sound index |

**States & Transitions:**
| Field | Type | Description |
|-------|------|-------------|
| states | Map<String, Integer> | Block state mappings |
| transitionTexture | String | Transition texture |
| transitionToGroups | int[] | Transition target groups |
| transitionToTag | int | Transition tag index |

**Specialized:**
| Field | Type | Description |
|-------|------|-------------|
| movementSettings | BlockMovementSettings | Movement properties |
| flags | BlockFlags | Block flags |
| gathering | BlockGathering | Gathering configuration |
| placementSettings | BlockPlacementSettings | Placement rules |
| display | ModelDisplay | Display properties |
| rail | RailConfig | Rail configuration |
| bench | Bench | Crafting bench properties |
| connectedBlockRuleSet | ConnectedBlockRuleSet | Connected block rules |

---

### DrawType Enum

| Value         | Index | Description             |
| ------------- | ----- | ----------------------- |
| Empty         | 0     | No rendering            |
| GizmoCube     | 1     | Debug gizmo cube        |
| Cube          | 2     | Standard cube           |
| Model         | 3     | Custom 3D model         |
| CubeWithModel | 4     | Cube with model overlay |

---

### BlockMaterial Enum

| Value | Index |
| ----- | ----- |
| Empty | 0     |
| Solid | 1     |

---

### Opacity Enum

| Value           | Index | Description           |
| --------------- | ----- | --------------------- |
| Solid           | 0     | Fully opaque          |
| Semitransparent | 1     | Partially transparent |
| Cutout          | 2     | Binary transparency   |
| Transparent     | 3     | Full transparency     |

---

### ShadingMode Enum

| Value      | Index |
| ---------- | ----- |
| Standard   | 0     |
| Flat       | 1     |
| Fullbright | 2     |
| Reflective | 3     |

---

### RandomRotation Enum

| Value             | Index | Description        |
| ----------------- | ----- | ------------------ |
| None              | 0     | No random rotation |
| YawPitchRollStep1 | 1     | All axes, step 1   |
| YawStep1          | 2     | Yaw only, step 1   |
| YawStep1XZ        | 3     | Yaw step 1 on XZ   |
| YawStep90         | 4     | Yaw 90° increments |

---

### VariantRotation Enum

| Value      | Index | Description              |
| ---------- | ----- | ------------------------ |
| None       | 0     | No variant rotation      |
| Wall       | 1     | Wall-mounted orientation |
| UpDown     | 2     | Up/down orientation      |
| Pipe       | 3     | Pipe connection          |
| DoublePipe | 4     | Double pipe connection   |
| NESW       | 5     | Cardinal directions      |
| UpDownNESW | 6     | Vertical + cardinal      |
| All        | 7     | All orientations         |

---

### Rotation Enum

| Value      | Index |
| ---------- | ----- |
| None       | 0     |
| Ninety     | 1     |
| OneEighty  | 2     |
| TwoSeventy | 3     |

---

### BlockNeighbor Enum

All 26 neighboring directions:

**Cardinal (6):**
Up(0), Down(1), North(2), East(3), South(4), West(5)

**Edge (12):**
UpNorth(6), UpSouth(7), UpEast(8), UpWest(9),
DownNorth(10), DownSouth(11), DownEast(12), DownWest(13),
NorthEast(14), SouthEast(15), SouthWest(16), NorthWest(17)

**Corner (8):**
UpNorthEast(18), UpSouthEast(19), UpSouthWest(20), UpNorthWest(21),
DownNorthEast(22), DownSouthEast(23), DownSouthWest(24), DownNorthWest(25)

---

### BlockSupportsRequiredForType Enum

| Value | Index | Description           |
| ----- | ----- | --------------------- |
| Any   | 0     | Any support satisfies |
| All   | 1     | All supports required |

---

### SupportMatch Enum

| Value      | Index | Description            |
| ---------- | ----- | ---------------------- |
| Ignored    | 0     | Support not checked    |
| Required   | 1     | Support must exist     |
| Disallowed | 2     | Support must not exist |

---

## Block Sound System

### BlockSoundSet

Sound configuration per block.

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| id | String | Sound set identifier |
| soundEventIndices | Map<BlockSoundEvent, Integer> | Sound event mappings |
| moveInRepeatRange | FloatRange | Movement sound repeat |

### BlockSoundEvent Enum

| Value   | Index |
| ------- | ----- |
| Walk    | 0     |
| Land    | 1     |
| MoveIn  | 2     |
| MoveOut | 3     |
| Hit     | 4     |
| Break   | 5     |
| Build   | 6     |
| Clone   | 7     |
| Harvest | 8     |

---

## Block Particle System

### BlockParticleSet

Particle configuration per block.

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| id | String | Particle set identifier |
| color | Color | Particle color |
| scale | float | Particle scale |
| positionOffset | Vector3f | Position offset |
| rotationOffset | Direction | Rotation offset |
| particleSystemIds | Map<BlockParticleEvent, String> | Particle system mappings |

### BlockParticleEvent Enum

| Value    | Index |
| -------- | ----- |
| Walk     | 0     |
| Run      | 1     |
| Sprint   | 2     |
| SoftLand | 3     |
| HardLand | 4     |
| MoveOut  | 5     |
| Hit      | 6     |
| Break    | 7     |
| Build    | 8     |
| Physics  | 9     |

---

## Block Support System

### RequiredBlockFaceSupport

Defines required adjacent block support.

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| faceType | String | Face type requirement |
| selfFaceType | String | Self face type |
| blockSetId | String | Block set identifier |
| blockTypeId | int | Block type index |
| tagIndex | int | Tag index |
| fluidId | int | Fluid identifier |
| support | SupportMatch | Support requirement |
| matchSelf | SupportMatch | Self-match requirement |
| allowSupportPropagation | boolean | Allow propagation |
| rotate | boolean | Rotate with block |
| filler | Vector3i[] | Filler positions |

### BlockFaceSupport

Defines support this block provides.

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| faceType | String | Face type provided |
| filler | Vector3i[] | Filler positions |

---

## Block Gathering

### BlockGathering

Gathering/harvesting configuration.

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| breaking | BlockBreaking | Breaking configuration |
| harvest | Harvesting | Harvest configuration |
| soft | SoftBlock | Soft block properties |

---

## Summary

### Item System

- 49 fields in ItemBase
- 4 specialization types: Tool, Weapon, Armor, Glider
- Modifier system with additive/multiplicative calculations

### Block System

- 53 fields in BlockType
- 5 draw types, 4 opacity levels, 4 shading modes
- 26 neighbor directions for support system
- 9 sound events, 10 particle events
