[@gff/core](../README.md) / [Exports](../modules.md) / ToGqlOperationHandler

# Class: ToGqlOperationHandler

## Implements

- [`OperationHandler`](../interfaces/OperationHandler.md)<[`GqlOperation`](../modules.md#gqloperation)\>

## Table of contents

### Constructors

- [constructor](ToGqlOperationHandler.md#constructor)

### Methods

- [handleEquals](ToGqlOperationHandler.md#handleequals)
- [handleExcludes](ToGqlOperationHandler.md#handleexcludes)
- [handleExcludesIfAny](ToGqlOperationHandler.md#handleexcludesifany)
- [handleExists](ToGqlOperationHandler.md#handleexists)
- [handleGreaterThan](ToGqlOperationHandler.md#handlegreaterthan)
- [handleGreaterThanOrEquals](ToGqlOperationHandler.md#handlegreaterthanorequals)
- [handleIncludes](ToGqlOperationHandler.md#handleincludes)
- [handleIntersection](ToGqlOperationHandler.md#handleintersection)
- [handleLessThan](ToGqlOperationHandler.md#handlelessthan)
- [handleLessThanOrEquals](ToGqlOperationHandler.md#handlelessthanorequals)
- [handleMissing](ToGqlOperationHandler.md#handlemissing)
- [handleNotEquals](ToGqlOperationHandler.md#handlenotequals)
- [handleUnion](ToGqlOperationHandler.md#handleunion)

## Constructors

### constructor

• **new ToGqlOperationHandler**()

## Methods

### handleEquals

▸ **handleEquals**(`op`): [`GqlEquals`](../interfaces/GqlEquals.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`Equals`](../interfaces/Equals.md) |

#### Returns

[`GqlEquals`](../interfaces/GqlEquals.md)

#### Implementation of

[OperationHandler](../interfaces/OperationHandler.md).[handleEquals](../interfaces/OperationHandler.md#handleequals)

#### Defined in

[packages/core/src/features/gdcapi/filters.ts:311](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/filters.ts#L311)

___

### handleExcludes

▸ **handleExcludes**(`op`): [`GqlExcludes`](../interfaces/GqlExcludes.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`Excludes`](../interfaces/Excludes.md) |

#### Returns

[`GqlExcludes`](../interfaces/GqlExcludes.md)

#### Implementation of

[OperationHandler](../interfaces/OperationHandler.md).[handleExcludes](../interfaces/OperationHandler.md#handleexcludes)

#### Defined in

[packages/core/src/features/gdcapi/filters.ts:374](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/filters.ts#L374)

___

### handleExcludesIfAny

▸ **handleExcludesIfAny**(`op`): [`GqlExcludesIfAny`](../interfaces/GqlExcludesIfAny.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`ExcludesIfAny`](../interfaces/ExcludesIfAny.md) |

#### Returns

[`GqlExcludesIfAny`](../interfaces/GqlExcludesIfAny.md)

#### Implementation of

[OperationHandler](../interfaces/OperationHandler.md).[handleExcludesIfAny](../interfaces/OperationHandler.md#handleexcludesifany)

#### Defined in

[packages/core/src/features/gdcapi/filters.ts:381](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/filters.ts#L381)

___

### handleExists

▸ **handleExists**(`op`): [`GqlExists`](../interfaces/GqlExists.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`Exists`](../interfaces/Exists.md) |

#### Returns

[`GqlExists`](../interfaces/GqlExists.md)

#### Implementation of

[OperationHandler](../interfaces/OperationHandler.md).[handleExists](../interfaces/OperationHandler.md#handleexists)

#### Defined in

[packages/core/src/features/gdcapi/filters.ts:361](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/filters.ts#L361)

___

### handleGreaterThan

▸ **handleGreaterThan**(`op`): [`GqlGreaterThan`](../interfaces/GqlGreaterThan.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`GreaterThan`](../interfaces/GreaterThan.md) |

#### Returns

[`GqlGreaterThan`](../interfaces/GqlGreaterThan.md)

#### Implementation of

[OperationHandler](../interfaces/OperationHandler.md).[handleGreaterThan](../interfaces/OperationHandler.md#handlegreaterthan)

#### Defined in

[packages/core/src/features/gdcapi/filters.ts:339](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/filters.ts#L339)

___

### handleGreaterThanOrEquals

▸ **handleGreaterThanOrEquals**(`op`): [`GqlGreaterThanOrEquals`](../interfaces/GqlGreaterThanOrEquals.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`GreaterThanOrEquals`](../interfaces/GreaterThanOrEquals.md) |

#### Returns

[`GqlGreaterThanOrEquals`](../interfaces/GqlGreaterThanOrEquals.md)

#### Implementation of

[OperationHandler](../interfaces/OperationHandler.md).[handleGreaterThanOrEquals](../interfaces/OperationHandler.md#handlegreaterthanorequals)

#### Defined in

[packages/core/src/features/gdcapi/filters.ts:346](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/filters.ts#L346)

___

### handleIncludes

▸ **handleIncludes**(`op`): [`GqlIncludes`](../interfaces/GqlIncludes.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`Includes`](../interfaces/Includes.md) |

#### Returns

[`GqlIncludes`](../interfaces/GqlIncludes.md)

#### Implementation of

[OperationHandler](../interfaces/OperationHandler.md).[handleIncludes](../interfaces/OperationHandler.md#handleincludes)

#### Defined in

[packages/core/src/features/gdcapi/filters.ts:367](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/filters.ts#L367)

___

### handleIntersection

▸ **handleIntersection**(`op`): [`GqlIntersection`](../interfaces/GqlIntersection.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`Intersection`](../interfaces/Intersection.md) |

#### Returns

[`GqlIntersection`](../interfaces/GqlIntersection.md)

#### Implementation of

[OperationHandler](../interfaces/OperationHandler.md).[handleIntersection](../interfaces/OperationHandler.md#handleintersection)

#### Defined in

[packages/core/src/features/gdcapi/filters.ts:388](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/filters.ts#L388)

___

### handleLessThan

▸ **handleLessThan**(`op`): [`GqlLessThan`](../interfaces/GqlLessThan.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`LessThan`](../interfaces/LessThan.md) |

#### Returns

[`GqlLessThan`](../interfaces/GqlLessThan.md)

#### Implementation of

[OperationHandler](../interfaces/OperationHandler.md).[handleLessThan](../interfaces/OperationHandler.md#handlelessthan)

#### Defined in

[packages/core/src/features/gdcapi/filters.ts:325](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/filters.ts#L325)

___

### handleLessThanOrEquals

▸ **handleLessThanOrEquals**(`op`): [`GqlLessThanOrEquals`](../interfaces/GqlLessThanOrEquals.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`LessThanOrEquals`](../interfaces/LessThanOrEquals.md) |

#### Returns

[`GqlLessThanOrEquals`](../interfaces/GqlLessThanOrEquals.md)

#### Implementation of

[OperationHandler](../interfaces/OperationHandler.md).[handleLessThanOrEquals](../interfaces/OperationHandler.md#handlelessthanorequals)

#### Defined in

[packages/core/src/features/gdcapi/filters.ts:332](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/filters.ts#L332)

___

### handleMissing

▸ **handleMissing**(`op`): [`GqlMissing`](../interfaces/GqlMissing.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`Missing`](../interfaces/Missing.md) |

#### Returns

[`GqlMissing`](../interfaces/GqlMissing.md)

#### Implementation of

[OperationHandler](../interfaces/OperationHandler.md).[handleMissing](../interfaces/OperationHandler.md#handlemissing)

#### Defined in

[packages/core/src/features/gdcapi/filters.ts:355](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/filters.ts#L355)

___

### handleNotEquals

▸ **handleNotEquals**(`op`): [`GqlNotEquals`](../interfaces/GqlNotEquals.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`NotEquals`](../interfaces/NotEquals.md) |

#### Returns

[`GqlNotEquals`](../interfaces/GqlNotEquals.md)

#### Implementation of

[OperationHandler](../interfaces/OperationHandler.md).[handleNotEquals](../interfaces/OperationHandler.md#handlenotequals)

#### Defined in

[packages/core/src/features/gdcapi/filters.ts:318](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/filters.ts#L318)

___

### handleUnion

▸ **handleUnion**(`op`): [`GqlUnion`](../interfaces/GqlUnion.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`Union`](../interfaces/Union.md) |

#### Returns

[`GqlUnion`](../interfaces/GqlUnion.md)

#### Implementation of

[OperationHandler](../interfaces/OperationHandler.md).[handleUnion](../interfaces/OperationHandler.md#handleunion)

#### Defined in

[packages/core/src/features/gdcapi/filters.ts:392](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/filters.ts#L392)
