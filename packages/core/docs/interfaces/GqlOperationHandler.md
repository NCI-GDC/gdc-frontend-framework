[@gff/core](../README.md) / [Exports](../modules.md) / GqlOperationHandler

# Interface: GqlOperationHandler<T\>

## Type parameters

| Name |
| :------ |
| `T` |

## Table of contents

### Methods

- [handleEquals](GqlOperationHandler.md#handleequals)
- [handleExcludes](GqlOperationHandler.md#handleexcludes)
- [handleExcludesIfAny](GqlOperationHandler.md#handleexcludesifany)
- [handleExists](GqlOperationHandler.md#handleexists)
- [handleGreaterThan](GqlOperationHandler.md#handlegreaterthan)
- [handleGreaterThanOrEquals](GqlOperationHandler.md#handlegreaterthanorequals)
- [handleIncludes](GqlOperationHandler.md#handleincludes)
- [handleIntersection](GqlOperationHandler.md#handleintersection)
- [handleLessThan](GqlOperationHandler.md#handlelessthan)
- [handleLessThanOrEquals](GqlOperationHandler.md#handlelessthanorequals)
- [handleMissing](GqlOperationHandler.md#handlemissing)
- [handleNotEquals](GqlOperationHandler.md#handlenotequals)
- [handleUnion](GqlOperationHandler.md#handleunion)

## Methods

### handleEquals

▸ **handleEquals**(`op`): `T`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`GqlEquals`](GqlEquals.md) |

#### Returns

`T`

#### Defined in

[packages/core/src/features/gdcapi/filters.ts:259](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/filters.ts#L259)

___

### handleExcludes

▸ **handleExcludes**(`op`): `T`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`GqlExcludes`](GqlExcludes.md) |

#### Returns

`T`

#### Defined in

[packages/core/src/features/gdcapi/filters.ts:268](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/filters.ts#L268)

___

### handleExcludesIfAny

▸ **handleExcludesIfAny**(`op`): `T`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`GqlExcludesIfAny`](GqlExcludesIfAny.md) |

#### Returns

`T`

#### Defined in

[packages/core/src/features/gdcapi/filters.ts:269](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/filters.ts#L269)

___

### handleExists

▸ **handleExists**(`op`): `T`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`GqlExists`](GqlExists.md) |

#### Returns

`T`

#### Defined in

[packages/core/src/features/gdcapi/filters.ts:266](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/filters.ts#L266)

___

### handleGreaterThan

▸ **handleGreaterThan**(`op`): `T`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`GqlGreaterThan`](GqlGreaterThan.md) |

#### Returns

`T`

#### Defined in

[packages/core/src/features/gdcapi/filters.ts:263](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/filters.ts#L263)

___

### handleGreaterThanOrEquals

▸ **handleGreaterThanOrEquals**(`op`): `T`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`GqlGreaterThanOrEquals`](GqlGreaterThanOrEquals.md) |

#### Returns

`T`

#### Defined in

[packages/core/src/features/gdcapi/filters.ts:264](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/filters.ts#L264)

___

### handleIncludes

▸ **handleIncludes**(`op`): `T`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`GqlIncludes`](GqlIncludes.md) |

#### Returns

`T`

#### Defined in

[packages/core/src/features/gdcapi/filters.ts:267](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/filters.ts#L267)

___

### handleIntersection

▸ **handleIntersection**(`op`): `T`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`GqlIntersection`](GqlIntersection.md) |

#### Returns

`T`

#### Defined in

[packages/core/src/features/gdcapi/filters.ts:270](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/filters.ts#L270)

___

### handleLessThan

▸ **handleLessThan**(`op`): `T`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`GqlLessThan`](GqlLessThan.md) |

#### Returns

`T`

#### Defined in

[packages/core/src/features/gdcapi/filters.ts:261](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/filters.ts#L261)

___

### handleLessThanOrEquals

▸ **handleLessThanOrEquals**(`op`): `T`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`GqlLessThanOrEquals`](GqlLessThanOrEquals.md) |

#### Returns

`T`

#### Defined in

[packages/core/src/features/gdcapi/filters.ts:262](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/filters.ts#L262)

___

### handleMissing

▸ **handleMissing**(`op`): `T`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`GqlMissing`](GqlMissing.md) |

#### Returns

`T`

#### Defined in

[packages/core/src/features/gdcapi/filters.ts:265](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/filters.ts#L265)

___

### handleNotEquals

▸ **handleNotEquals**(`op`): `T`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`GqlNotEquals`](GqlNotEquals.md) |

#### Returns

`T`

#### Defined in

[packages/core/src/features/gdcapi/filters.ts:260](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/filters.ts#L260)

___

### handleUnion

▸ **handleUnion**(`op`): `T`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`GqlUnion`](GqlUnion.md) |

#### Returns

`T`

#### Defined in

[packages/core/src/features/gdcapi/filters.ts:271](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/filters.ts#L271)
