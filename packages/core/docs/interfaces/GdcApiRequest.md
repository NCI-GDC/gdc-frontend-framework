[@gff/core](../README.md) / [Exports](../modules.md) / GdcApiRequest

# Interface: GdcApiRequest

Defines the parameters of a GDC API search/retrieval. All parameters
are optional

**`property`** filters - specifies the search terms for the query

**`property`** fields - specifies the which data elements should be returned in the response, if available

**`property`** expand - Returns multiple related fields

**`property`** format - Specifies the API response format: JSON, XML, or TSV

**`property`** size - Specifies the number of results to return

**`property`** from - 	Specifies the first record to return from a set of search results

**`property`** sortBy - Specifies sorting for the search results ("asc" | "desc")

**`property`** facets - Provides all existing values for a given field and the number of records having this value

## Table of contents

### Properties

- [expand](GdcApiRequest.md#expand)
- [facets](GdcApiRequest.md#facets)
- [fields](GdcApiRequest.md#fields)
- [filters](GdcApiRequest.md#filters)
- [format](GdcApiRequest.md#format)
- [from](GdcApiRequest.md#from)
- [size](GdcApiRequest.md#size)
- [sortBy](GdcApiRequest.md#sortby)

## Properties

### expand

• `Optional` `Readonly` **expand**: readonly `string`[]

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:114](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/gdcapi/gdcapi.ts#L114)

___

### facets

• `Optional` `Readonly` **facets**: readonly `string`[]

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:120](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/gdcapi/gdcapi.ts#L120)

___

### fields

• `Optional` `Readonly` **fields**: readonly `string`[]

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:113](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/gdcapi/gdcapi.ts#L113)

___

### filters

• `Optional` `Readonly` **filters**: [`GqlOperation`](../modules.md#gqloperation)

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:112](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/gdcapi/gdcapi.ts#L112)

___

### format

• `Optional` `Readonly` **format**: ``"JSON"`` \| ``"TSV"`` \| ``"XML"``

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:115](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/gdcapi/gdcapi.ts#L115)

___

### from

• `Optional` `Readonly` **from**: `number`

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:118](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/gdcapi/gdcapi.ts#L118)

___

### size

• `Optional` `Readonly` **size**: `number`

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:117](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/gdcapi/gdcapi.ts#L117)

___

### sortBy

• `Optional` `Readonly` **sortBy**: readonly [`SortBy`](SortBy.md)[]

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:119](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/gdcapi/gdcapi.ts#L119)
