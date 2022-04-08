[@gff/core](../README.md) / [Exports](../modules.md) / GdcApiData

# Interface: GdcApiData<H\>

## Type parameters

| Name |
| :------ |
| `H` |

## Table of contents

### Properties

- [aggregations](GdcApiData.md#aggregations)
- [hits](GdcApiData.md#hits)
- [pagination](GdcApiData.md#pagination)

## Properties

### aggregations

• `Optional` `Readonly` **aggregations**: `Record`<`string`, [`Buckets`](Buckets.md) \| [`Stats`](Stats.md)\>

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:22](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/gdcapi/gdcapi.ts#L22)

___

### hits

• `Readonly` **hits**: readonly `H`[]

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:21](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/gdcapi/gdcapi.ts#L21)

___

### pagination

• `Readonly` **pagination**: [`Pagination`](Pagination.md)

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:23](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/gdcapi/gdcapi.ts#L23)
