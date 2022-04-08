[@gff/core](../README.md) / [Exports](../modules.md) / CreateGdcAppOptions

# Interface: CreateGdcAppOptions

## Hierarchy

- [`CreateGDCAppStore`](CreateGDCAppStore.md)

  ↳ **`CreateGdcAppOptions`**

## Table of contents

### Properties

- [App](CreateGdcAppOptions.md#app)
- [name](CreateGdcAppOptions.md#name)
- [reducer](CreateGdcAppOptions.md#reducer)
- [requiredEntityTypes](CreateGdcAppOptions.md#requiredentitytypes)
- [version](CreateGdcAppOptions.md#version)

## Properties

### App

• `Readonly` **App**: `ComponentType`<{}\>

#### Defined in

[packages/core/src/features/gdcapps/GdcApp.tsx:34](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/gdcapps/GdcApp.tsx#L34)

___

### name

• `Readonly` **name**: `string`

#### Overrides

[CreateGDCAppStore](CreateGDCAppStore.md).[name](CreateGDCAppStore.md#name)

#### Defined in

[packages/core/src/features/gdcapps/GdcApp.tsx:31](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/gdcapps/GdcApp.tsx#L31)

___

### reducer

• `Optional` `Readonly` **reducer**: `ReducersMapObject`<`any`, `AnyAction`\>

#### Overrides

[CreateGDCAppStore](CreateGDCAppStore.md).[reducer](CreateGDCAppStore.md#reducer)

#### Defined in

[packages/core/src/features/gdcapps/GdcApp.tsx:35](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/gdcapps/GdcApp.tsx#L35)

___

### requiredEntityTypes

• `Readonly` **requiredEntityTypes**: readonly [`EntityType`](../modules.md#entitytype)[]

#### Defined in

[packages/core/src/features/gdcapps/GdcApp.tsx:33](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/gdcapps/GdcApp.tsx#L33)

___

### version

• `Readonly` **version**: `string`

#### Overrides

[CreateGDCAppStore](CreateGDCAppStore.md).[version](CreateGDCAppStore.md#version)

#### Defined in

[packages/core/src/features/gdcapps/GdcApp.tsx:32](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/gdcapps/GdcApp.tsx#L32)
