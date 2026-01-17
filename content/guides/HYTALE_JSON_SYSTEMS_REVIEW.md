---
title: "Hytale JSON Asset Guide"
---

# Hytale JSON Asset Guide

Guide for creating items, blocks, particles, and interactions via JSON.

---

## Table of Contents

1. [Naming & Localization](#1-naming--localization)
2. [Items](#2-items)
3. [Blocks](#3-blocks)
4. [Particles & Effects](#4-particles--effects)
5. [Components](#5-components)
6. [Interactions](#6-interactions)
7. [Inheritance](#7-inheritance)
8. [Templates](#8-templates)

---

## 1. Naming & Localization

### Item IDs

Item IDs are derived from filenames: `My_Custom_Sword.json` → ID = `My_Custom_Sword`

### Localization System

**Location:** `Server/Languages/{language-code}/`

**Default language:** `en-US` (hyphen, not underscore)

**File format:** `.lang` files (properties format)

### .lang File Format

```properties
# Comments start with #
server.items.My_Custom_Sword.name = Custom Sword
server.items.My_Custom_Sword.description = A finely crafted blade

# Multiline values use backslash
server.items.Long_Description.description = This is a very \
    long description that spans \
    multiple lines
```

### Directory Structure

```
Server/
└── Languages/
    ├── en-US/
    │   ├── items.lang           → keys prefixed with "items."
    │   ├── server/
    │   │   └── items.lang       → keys prefixed with "server.items."
    │   └── voidstorage.lang     → keys prefixed with "voidstorage."
    └── fallback.lang            → language fallback mappings
```

### Key Prefix Rules

File path determines key prefix:

- `Server/Languages/en-US/items.lang` → prefix `items.`
- `Server/Languages/en-US/server/items.lang` → prefix `server.items.`

In the file:

```properties
# In Server/Languages/en-US/server/items.lang
My_Custom_Sword.name = Custom Sword
```

Creates full key `server.items.My_Custom_Sword.name`.

### TranslationProperties JSON

**Option A: Auto-generated (recommended)**

Omit `TranslationProperties`. System generates `server.items.{filename}.name`.

```json
{
    "Icon": "Icons/ItemsGenerated/My_Custom_Sword.png"
}
```

**Option B: Explicit**

```json
{
    "TranslationProperties": {
        "Name": "server.items.My_Custom_Sword.name",
        "Description": "server.items.My_Custom_Sword.description"
    }
}
```

### Common Mistakes

| Wrong                        | Correct                   |
| ---------------------------- | ------------------------- |
| `Common/Language/en_US.json` | `Server/Languages/en-US/` |
| JSON format                  | `.lang` properties format |
| `en_US` (underscore)         | `en-US` (hyphen)          |

---

## 2. Items

### File Location

`Server/Item/Items/{Category}/{ItemName}.json`

Categories: `Tool/`, `Weapon/`, `Armor/`, `Block/`, `Consumable/`, `Misc/`

### Core Schema

```json
{
    // === INHERITANCE ===
    "Parent": "Base_Item_Id",

    // === LOCALIZATION ===
    "TranslationProperties": {
        "Name": "server.items.{ItemId}.name",
        "Description": "server.items.{ItemId}.description"
    },

    // === VISUALS ===
    "Icon": "Icons/ItemsGenerated/{ItemId}.png",
    "IconProperties": {
        "Scale": 0.5,
        "Rotation": [22.5, 45.0, 22.5],
        "Translation": [0.0, -13.5]
    },
    "Model": "Items/{Category}/{Model}.blockymodel",
    "Texture": "Items/{Category}/{Texture}.png",
    "Animation": "animation_id",
    "Scale": 1.0,

    // === LIGHT ===
    "Light": {
        "R": 255,
        "G": 200,
        "B": 100,
        "A": 255,
        "Intensity": 1.0,
        "Range": 5.0
    },

    // === INVENTORY ===
    "MaxStack": 100,
    "Quality": "Common",
    "ItemLevel": 1,

    // === CATEGORIZATION ===
    "Categories": ["Items.Tools"],
    "Set": "Set_Name",

    // === AUDIO ===
    "ItemSoundSetId": "ISS_Default",
    "SoundEventId": "sound_event",

    // === PLAYER ANIMATION ===
    "PlayerAnimationsId": "Default",
    "UsePlayerAnimations": true,
    "DroppedItemAnimation": "dropped_idle",

    // === BEHAVIOR ===
    "DropOnDeath": true,
    "Consumable": false,
    "Variant": false,

    // === DURABILITY ===
    "MaxDurability": 100.0,
    "DurabilityLossOnHit": 1.0,
    "FuelQuality": 1.0,

    // === RENDERING ===
    "ClipsGeometry": false,
    "RenderDeployablePreview": false
}
```

### Default Values

| Field               | Default              |
| ------------------- | -------------------- |
| MaxStack            | -1 (auto-calculated) |
| Scale               | 1.0                  |
| UsePlayerAnimations | false                |
| Consumable          | false                |
| Variant             | false                |
| FuelQuality         | 1.0                  |
| ClipsGeometry       | false                |

### PlayerAnimationsId Values

| Value   | Use Case          |
| ------- | ----------------- |
| Default | Generic items     |
| Block   | Placeable blocks  |
| Staff   | Wands, staves     |
| Sword   | One-handed swords |
| Pickaxe | Mining tools      |
| Axe     | Axes              |
| Bow     | Bows              |
| Shield  | Shields           |

---

## 3. Blocks

Blocks are defined using the `BlockType` field in items.

### Block Item Template

```json
{
    "Categories": ["Blocks.{Category}"],
    "PlayerAnimationsId": "Block",
    "MaxStack": 100,
    "Icon": "Icons/ItemsGenerated/{BlockId}.png",
    "ItemSoundSetId": "ISS_Blocks_Stone",

    "BlockType": {
        // Block definition
    }
}
```

### BlockType Schema

```json
{
    "BlockType": {
        // === CORE ===
        "Material": "Solid",
        "DrawType": "Cube",
        "Group": "Stone",

        // === CUBE TEXTURES ===
        "Textures": [
            {
                "Weight": 1,
                "All": "BlockTextures/{Texture}.png"
            }
        ],

        // === PER-FACE TEXTURES ===
        "Textures": [
            {
                "Weight": 1,
                "Sides": "BlockTextures/{Side}.png",
                "UpDown": "BlockTextures/{TopBottom}.png",
                "Up": "BlockTextures/{Top}.png",
                "Down": "BlockTextures/{Bottom}.png",
                "North": "BlockTextures/{North}.png",
                "South": "BlockTextures/{South}.png",
                "East": "BlockTextures/{East}.png",
                "West": "BlockTextures/{West}.png"
            }
        ],

        // === CUSTOM MODEL ===
        "CustomModel": "Blocks/{Model}.blockymodel",
        "CustomModelTexture": [{ "Slot": 0, "Texture": "BlockTextures/{Texture}.png" }],
        "CustomModelScale": 1.0,
        "CustomModelAnimation": "idle",

        // === SHADING ===
        "CubeShadingMode": "Standard",
        "Opacity": "Solid",
        "RequiresAlphaBlending": false,

        // === ROTATION ===
        "RandomRotation": "None",
        "VariantRotation": "None",
        "RotationYawPlacementOffset": "None",

        // === LIGHT ===
        "Light": {
            "R": 255,
            "G": 200,
            "B": 100,
            "Intensity": 1.0,
            "Range": 8.0
        },

        // === GATHERING ===
        "Gathering": {
            "Breaking": {
                "GatherType": "Rocks",
                "ItemId": "{DropItemId}",
                "DropList": "{DropListId}"
            },
            "Tools": [{ "GatherType": "Rocks", "Efficiency": 1.0 }],
            "UseDefaultDropWhenPlaced": true
        },

        // === AUDIO ===
        "BlockSoundSetId": "Stone",

        // === PARTICLES ===
        "BlockParticleSetId": "Stone",
        "ParticleColor": "#808080",

        // === TRANSITIONS ===
        "TransitionTexture": "BlockTextures/Transition_{Group}.png",
        "TransitionToGroups": ["Dirt", "Sand"],
        "TransitionToTag": "Natural",

        // === FLAGS ===
        "Flags": {
            "Climbable": false,
            "Flammable": false
        }
    }
}
```

### DrawType Enum

| Value         | Index | Description     |
| ------------- | ----- | --------------- |
| Empty         | 0     | No rendering    |
| GizmoCube     | 1     | Debug cube      |
| Cube          | 2     | Standard cube   |
| Model         | 3     | Custom 3D model |
| CubeWithModel | 4     | Cube + model    |

### BlockMaterial Enum

| Value | Index |
| ----- | ----- |
| Empty | 0     |
| Solid | 1     |

### Opacity Enum

| Value           | Index | Description          |
| --------------- | ----- | -------------------- |
| Solid           | 0     | Fully opaque         |
| Semitransparent | 1     | Partial transparency |
| Cutout          | 2     | Binary transparency  |
| Transparent     | 3     | Full transparency    |

### ShadingMode Enum

| Value      | Index |
| ---------- | ----- |
| Standard   | 0     |
| Flat       | 1     |
| Fullbright | 2     |
| Reflective | 3     |

### RandomRotation Enum

| Value             | Index | Description      |
| ----------------- | ----- | ---------------- |
| None              | 0     | No rotation      |
| YawPitchRollStep1 | 1     | All axes, step 1 |
| YawStep1          | 2     | Yaw only, step 1 |
| YawStep1XZ        | 3     | Yaw step 1 on XZ |
| YawStep90         | 4     | 90° increments   |

### VariantRotation Enum

| Value      | Index | Description         |
| ---------- | ----- | ------------------- |
| None       | 0     | No rotation         |
| Wall       | 1     | Wall-mounted        |
| UpDown     | 2     | Up/down orientation |
| Pipe       | 3     | Pipe connection     |
| DoublePipe | 4     | Double pipe         |
| NESW       | 5     | Cardinal directions |
| UpDownNESW | 6     | Vertical + cardinal |
| All        | 7     | All orientations    |

---

## 4. Particles & Effects

### Item Particles

```json
{
    "Particles": [
        {
            "SystemId": "particle_system_id",
            "TargetEntityPart": "Self",
            "TargetNodeName": "node_name",
            "Scale": 1.0,
            "Color": { "R": 255, "G": 255, "B": 255, "A": 255 },
            "PositionOffset": [0.0, 0.0, 0.0],
            "RotationOffset": { "Pitch": 0, "Yaw": 0, "Roll": 0 },
            "DetachedFromModel": false
        }
    ]
}
```

### First-Person Particles

```json
{
    "FirstPersonParticles": [
        {
            "SystemId": "glow_effect",
            "TargetEntityPart": "Self",
            "Scale": 0.5
        }
    ]
}
```

### Trails

```json
{
    "Trails": [
        {
            "TrailId": "trail_system_id",
            "TargetEntityPart": "Self",
            "TargetNodeName": "trail_point",
            "PositionOffset": [0.0, 0.0, 0.0],
            "RotationOffset": { "Pitch": 0, "Yaw": 0, "Roll": 0 },
            "FixedRotation": false
        }
    ]
}
```

### Block Particles

```json
{
    "BlockType": {
        "BlockParticleSetId": "Stone",
        "ParticleColor": "#808080",
        "Particles": [
            {
                "SystemId": "ambient_effect",
                "TargetEntityPart": "Self",
                "Scale": 1.0,
                "PositionOffset": [0.5, 1.0, 0.5],
                "DetachedFromModel": true
            }
        ]
    }
}
```

### TargetEntityPart Values

| Value     | Location          |
| --------- | ----------------- |
| Self      | Item/block center |
| Root      | Entity root       |
| RightHand | Right hand        |
| LeftHand  | Left hand         |
| Head      | Head              |
| Body      | Torso             |

---

## 5. Components

### Tool

```json
{
    "Tool": {
        "Specs": [
            { "GatherType": "Rocks", "Efficiency": 2.0 },
            { "GatherType": "Wood", "Efficiency": 1.5 }
        ],
        "Speed": 1.5,
        "HitSoundLayer": "tool_hit",
        "IncorrectMaterialSoundLayer": "wrong_material",
        "DurabilityLossBlockTypes": []
    }
}
```

**GatherType values:** `Rocks`, `Wood`, `Dirt`, `Sand`, `Ore`, `Plants`, `SoftBlocks`, `Machine`

### Weapon

```json
{
    "Weapon": {
        "StatModifiers": {
            "Damage": [{ "Target": "Max", "CalculationType": "Additive", "Amount": 10.0 }],
            "AttackSpeed": [{ "Target": "Max", "CalculationType": "Multiplicative", "Amount": 1.2 }]
        },
        "EntityStatsToClear": [],
        "RenderDualWielded": false
    }
}
```

### Armor

```json
{
    "Armor": {
        "ArmorSlot": "Chest",
        "BaseDamageResistance": 0.1,
        "DamageResistance": {
            "Physical": [{ "Target": "Max", "CalculationType": "Additive", "Amount": 0.15 }]
        },
        "DamageEnhancement": {},
        "DamageClassEnhancement": {},
        "KnockbackResistances": {},
        "StatModifiers": {},
        "CosmeticsToHide": []
    }
}
```

### ItemArmorSlot Enum

| Value | Index |
| ----- | ----- |
| Head  | 0     |
| Chest | 1     |
| Hands | 2     |
| Legs  | 3     |

### Modifier Structure

```json
{
    "Target": "Max",
    "CalculationType": "Additive",
    "Amount": 10.0
}
```

**ModifierTarget:** `Min` (0), `Max` (1)

**CalculationType:** `Additive` (0), `Multiplicative` (1)

### Container

```json
{
    "Container": {
        "Capacity": 27
    }
}
```

### Glider

```json
{
    "Glider": {
        "GlideSpeed": 1.0,
        "FallSpeed": 0.5
    }
}
```

### Utility

```json
{
    "Utility": {}
}
```

### Component Combination

```json
{
    "Tool": {
        "Specs": [{ "GatherType": "Rocks", "Efficiency": 2.0 }]
    },
    "Weapon": {
        "StatModifiers": { "Damage": [{ "Target": "Max", "CalculationType": "Additive", "Amount": 5.0 }] }
    },
    "Container": {
        "Capacity": 9
    }
}
```

---

## 6. Interactions

### Item Interactions

```json
{
    "Interactions": {
        "Primary": "Attack_Interaction",
        "Secondary": "Use_Interaction",
        "Use": "Activate_Interaction",
        "SwapTo": "Equip_Interaction",
        "SwapFrom": "Unequip_Interaction"
    },
    "InteractionVars": {
        "CustomVar": "value"
    },
    "InteractionConfig": {}
}
```

### InteractionType Enum

| Type              | Index | Trigger      |
| ----------------- | ----- | ------------ |
| Primary           | 0     | Left click   |
| Secondary         | 1     | Right click  |
| Use               | 2     | Use key      |
| Pick              | 3     | Mining       |
| Pickup            | 4     | Touch        |
| Ability1          | 5     | Ability 1    |
| Ability2          | 6     | Ability 2    |
| Ability3          | 7     | Ability 3    |
| SwapTo            | 8     | Equip        |
| SwapFrom          | 9     | Unequip      |
| ChargeStart       | 10    | Hold begin   |
| ChargeEnd         | 11    | Hold release |
| ProjectileSpawn   | 12    | Shoot        |
| ProjectileHit     | 13    | Hit target   |
| ProjectileMiss    | 14    | Miss         |
| Drop              | 15    | Drop key     |
| (continues to 24) |       |              |

### Block Interactions

```json
{
    "BlockType": {
        "Interactions": {
            "Primary": "Block_Break",
            "Secondary": "Block_Use"
        }
    }
}
```

### RootInteraction Definition

Location: `Server/Interaction/{InteractionId}.json`

```json
{
    "Interactions": ["Interaction_Chain_Step"],
    "Cooldown": {
        "Id": "cooldown_id",
        "Cooldown": 0.5,
        "Charges": [0.0, 0.5, 1.0],
        "SkipCooldownReset": false,
        "InterruptRecharge": false,
        "ClickBypass": false
    }
}
```

---

## 7. Inheritance

### Parent Reference

```json
{
    "Parent": "Base_Item_Id"
}
```

### Inheritance Rules

1. Child loads parent properties first
2. Child properties override parent
3. Nested objects merge
4. Arrays replace entirely

### Example

**Parent:** `Weapon_Sword_Base.json`

```json
{
    "Model": "Items/Weapons/Sword/Base.blockymodel",
    "PlayerAnimationsId": "Sword",
    "MaxStack": 1,
    "Weapon": {
        "StatModifiers": {
            "Damage": [{ "Target": "Max", "CalculationType": "Additive", "Amount": 5.0 }]
        }
    }
}
```

**Child:** `Weapon_Sword_Iron.json`

```json
{
    "Parent": "Weapon_Sword_Base",
    "Texture": "Items/Weapons/Sword/Iron.png",
    "Quality": "Uncommon",
    "Weapon": {
        "StatModifiers": {
            "Damage": [{ "Target": "Max", "CalculationType": "Additive", "Amount": 12.0 }]
        }
    }
}
```

---

## 8. Templates

### Basic Handheld Item

```json
{
    "Categories": ["Items.Tools"],
    "Icon": "Icons/ItemsGenerated/{ItemId}.png",
    "Model": "Items/Tools/{Model}.blockymodel",
    "Texture": "Items/Tools/{Texture}.png",
    "MaxStack": 1,
    "PlayerAnimationsId": "Default",
    "ItemSoundSetId": "ISS_Default"
}
```

### Basic Block

```json
{
    "Categories": ["Blocks.Building"],
    "Icon": "Icons/ItemsGenerated/{BlockId}.png",
    "MaxStack": 100,
    "PlayerAnimationsId": "Block",
    "ItemSoundSetId": "ISS_Blocks_Stone",

    "BlockType": {
        "Material": "Solid",
        "DrawType": "Cube",
        "Group": "Stone",
        "Textures": [{ "Weight": 1, "All": "BlockTextures/{Texture}.png" }],
        "Gathering": {
            "Breaking": { "GatherType": "Rocks" }
        },
        "BlockSoundSetId": "Stone",
        "BlockParticleSetId": "Stone"
    }
}
```

### Weapon

```json
{
    "Categories": ["Items.Weapons"],
    "Icon": "Icons/ItemsGenerated/{WeaponId}.png",
    "Model": "Items/Weapons/{Model}.blockymodel",
    "Texture": "Items/Weapons/{Texture}.png",
    "MaxStack": 1,
    "Quality": "Common",
    "PlayerAnimationsId": "Sword",
    "ItemSoundSetId": "ISS_Weapons_Metal",

    "MaxDurability": 100.0,
    "DurabilityLossOnHit": 1.0,

    "Weapon": {
        "StatModifiers": {
            "Damage": [{ "Target": "Max", "CalculationType": "Additive", "Amount": 10.0 }]
        },
        "RenderDualWielded": false
    }
}
```

### Tool

```json
{
    "Categories": ["Items.Tools"],
    "Icon": "Icons/ItemsGenerated/{ToolId}.png",
    "Model": "Items/Tools/{Model}.blockymodel",
    "Texture": "Items/Tools/{Texture}.png",
    "MaxStack": 1,
    "PlayerAnimationsId": "Pickaxe",
    "ItemSoundSetId": "ISS_Weapons_Metal",

    "MaxDurability": 200.0,

    "Tool": {
        "Specs": [{ "GatherType": "Rocks", "Efficiency": 2.0 }],
        "Speed": 1.0
    }
}
```

### Armor Piece

```json
{
    "Categories": ["Items.Armor"],
    "Icon": "Icons/ItemsGenerated/{ArmorId}.png",
    "Model": "Items/Armor/{Model}.blockymodel",
    "Texture": "Items/Armor/{Texture}.png",
    "MaxStack": 1,
    "Quality": "Common",
    "PlayerAnimationsId": "Default",
    "ItemSoundSetId": "ISS_Items_Cloth",

    "Armor": {
        "ArmorSlot": "Chest",
        "BaseDamageResistance": 0.1
    }
}
```

### Glowing Block with Particles

```json
{
    "Categories": ["Blocks.Decorative"],
    "Icon": "Icons/ItemsGenerated/{BlockId}.png",
    "MaxStack": 100,
    "PlayerAnimationsId": "Block",
    "ItemSoundSetId": "ISS_Blocks_Crystal",

    "BlockType": {
        "Material": "Solid",
        "DrawType": "Cube",
        "Group": "Crystal",
        "Textures": [{ "Weight": 1, "All": "BlockTextures/{Texture}.png" }],
        "Light": { "R": 200, "G": 150, "B": 255, "Intensity": 1.0, "Range": 8.0 },
        "Gathering": {
            "Breaking": { "GatherType": "Rocks" }
        },
        "BlockSoundSetId": "Crystal",
        "BlockParticleSetId": "Crystal",
        "ParticleColor": "#c896ff",
        "Particles": [
            {
                "SystemId": "ambient_sparkle",
                "TargetEntityPart": "Self",
                "PositionOffset": [0.5, 1.0, 0.5],
                "DetachedFromModel": true
            }
        ]
    }
}
```

### Custom Model Block

```json
{
    "Categories": ["Blocks.Decorative"],
    "Icon": "Icons/ItemsGenerated/{BlockId}.png",
    "MaxStack": 64,
    "PlayerAnimationsId": "Block",
    "ItemSoundSetId": "ISS_Blocks_Wood",

    "BlockType": {
        "Material": "Solid",
        "DrawType": "Model",
        "Group": "Furniture",
        "CustomModel": "Blocks/Furniture/{Model}.blockymodel",
        "CustomModelTexture": [{ "Slot": 0, "Texture": "BlockTextures/{Texture}.png" }],
        "CustomModelScale": 1.0,
        "CustomModelAnimation": "idle",
        "Gathering": {
            "Breaking": { "GatherType": "Wood" }
        },
        "BlockSoundSetId": "Wood"
    }
}
```

---

## Quick Reference

### File Locations

| Asset Type       | Location                                 |
| ---------------- | ---------------------------------------- |
| Items            | `Server/Item/Items/{Category}/{Id}.json` |
| Localization     | `Server/Languages/en-US/{prefix}.lang`   |
| Particle Systems | `Server/ParticleSystem/{Id}.json`        |
| Interactions     | `Server/Interaction/{Id}.json`           |
| Icons            | `Icons/ItemsGenerated/{Id}.png`          |
| Models           | `Items/{Category}/{Name}.blockymodel`    |
| Block Textures   | `BlockTextures/{Name}.png`               |

### Naming Conventions

| Element         | Convention                  | Example                        |
| --------------- | --------------------------- | ------------------------------ |
| Item ID         | PascalCase with underscores | `Iron_Sword`                   |
| Translation Key | Dot-separated path          | `server.items.Iron_Sword.name` |
| Category        | Dot-separated               | `Items.Weapons`                |
| Sound Set       | Prefix_Category_Material    | `ISS_Weapons_Metal`            |
