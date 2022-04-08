[@gff/core](../README.md) / [Exports](../modules.md) / GdcApiResponse

# Interface: GdcApiResponse<H\>

The response for a call the GDC Rest API

**`field`** data - json data returned

**`field`** warnings - any warning messages from the API call. Is used to determine if the a fetch is successful

**`memberof`** API

## Type parameters

| Name | Type |
| :------ | :------ |
| `H` | [`UnknownJson`](../modules.md#unknownjson) |

## Table of contents

### Properties

- [data](GdcApiResponse.md#data)
- [warnings](GdcApiResponse.md#warnings)

## Properties

### data

• `Readonly` **data**: [`GdcApiData`](GdcApiData.md)<`H`\>

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:16](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/gdcapi/gdcapi.ts#L16)

___

### warnings

• `Readonly` **warnings**: `Record`<`string`, `string`\>

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:17](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/gdcapi/gdcapi.ts#L17)
