[@gff/core](../README.md) / [Exports](../modules.md) / OperationHandler

# Interface: OperationHandler<T\>

## Type parameters

| Name |
| :------ |
| `T` |

## Implemented by

- [`ToGqlOperationHandler`](../classes/ToGqlOperationHandler.md)
- [`ValueExtractorHandler`](../classes/ValueExtractorHandler.md)

## Table of contents

### Methods

- [handleEquals](OperationHandler.md#handleequals)
- [handleExcludes](OperationHandler.md#handleexcludes)
- [handleExcludesIfAny](OperationHandler.md#handleexcludesifany)
- [handleExists](OperationHandler.md#handleexists)
- [handleGreaterThan](OperationHandler.md#handlegreaterthan)
- [handleGreaterThanOrEquals](OperationHandler.md#handlegreaterthanorequals)
- [handleIncludes](OperationHandler.md#handleincludes)
- [handleIntersection](OperationHandler.md#handleintersection)
- [handleLessThan](OperationHandler.md#handlelessthan)
- [handleLessThanOrEquals](OperationHandler.md#handlelessthanorequals)
- [handleMissing](OperationHandler.md#handlemissing)
- [handleNotEquals](OperationHandler.md#handlenotequals)
- [handleUnion](OperationHandler.md#handleunion)

## Methods

### handleEquals

▸ **handleEquals**(`op`): `T`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`Equals`](Equals.md) |

#### Returns

`T`

#### Defined in

[packages/core/src/features/gdcapi/filters.ts:91](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/gdcapi/filters.ts#L91)

___

### handleExcludes

▸ **handleExcludes**(`op`): `T`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`Excludes`](Excludes.md) |

#### Returns

`T`

#### Defined in

[packages/core/src/features/gdcapi/filters.ts:100](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/gdcapi/filters.ts#L100)

___

### handleExcludesIfAny

▸ **handleExcludesIfAny**(`op`): `T`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`ExcludesIfAny`](ExcludesIfAny.md) |

#### Returns

`T`

#### Defined in

[packages/core/src/features/gdcapi/filters.ts:101](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/gdcapi/filters.ts#L101)

___

### handleExists

▸ **handleExists**(`op`): `T`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`Exists`](Exists.md) |

#### Returns

`T`

#### Defined in

[packages/core/src/features/gdcapi/filters.ts:98](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/gdcapi/filters.ts#L98)

___

### handleGreaterThan

▸ **handleGreaterThan**(`op`): `T`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`GreaterThan`](GreaterThan.md) |

#### Returns

`T`

#### Defined in

[packages/core/src/features/gdcapi/filters.ts:95](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/gdcapi/filters.ts#L95)

___

### handleGreaterThanOrEquals

▸ **handleGreaterThanOrEquals**(`op`): `T`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`GreaterThanOrEquals`](GreaterThanOrEquals.md) |

#### Returns

`T`

#### Defined in

[packages/core/src/features/gdcapi/filters.ts:96](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/gdcapi/filters.ts#L96)

___

### handleIncludes

▸ **handleIncludes**(`op`): `T`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`Includes`](Includes.md) |

#### Returns

`T`

#### Defined in

[packages/core/src/features/gdcapi/filters.ts:99](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/gdcapi/filters.ts#L99)

___

### handleIntersection

▸ **handleIntersection**(`op`): `T`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`Intersection`](Intersection.md) |

#### Returns

`T`

#### Defined in

[packages/core/src/features/gdcapi/filters.ts:102](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/gdcapi/filters.ts#L102)

___

### handleLessThan

▸ **handleLessThan**(`op`): `T`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`LessThan`](LessThan.md) |

#### Returns

`T`

#### Defined in

[packages/core/src/features/gdcapi/filters.ts:93](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/gdcapi/filters.ts#L93)

___

### handleLessThanOrEquals

▸ **handleLessThanOrEquals**(`op`): `T`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`LessThanOrEquals`](LessThanOrEquals.md) |

#### Returns

`T`

#### Defined in

[packages/core/src/features/gdcapi/filters.ts:94](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/gdcapi/filters.ts#L94)

___

### handleMissing

▸ **handleMissing**(`op`): `T`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`Missing`](Missing.md) |

#### Returns

`T`

#### Defined in

[packages/core/src/features/gdcapi/filters.ts:97](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/gdcapi/filters.ts#L97)

___

### handleNotEquals

▸ **handleNotEquals**(`op`): `T`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`NotEquals`](NotEquals.md) |

#### Returns

`T`

#### Defined in

[packages/core/src/features/gdcapi/filters.ts:92](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/gdcapi/filters.ts#L92)

___

### handleUnion

▸ **handleUnion**(`op`): `T`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`Union`](Union.md) |

#### Returns

`T`

#### Defined in

[packages/core/src/features/gdcapi/filters.ts:103](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/gdcapi/filters.ts#L103)
