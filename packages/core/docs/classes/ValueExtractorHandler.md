[@gff/core](../README.md) / [Exports](../modules.md) / ValueExtractorHandler

# Class: ValueExtractorHandler

## Implements

- [`OperationHandler`](../interfaces/OperationHandler.md)<[`OperandValue`](../modules.md#operandvalue)\>

## Table of contents

### Constructors

- [constructor](ValueExtractorHandler.md#constructor)

### Methods

- [handleEquals](ValueExtractorHandler.md#handleequals)
- [handleExcludes](ValueExtractorHandler.md#handleexcludes)
- [handleExcludesIfAny](ValueExtractorHandler.md#handleexcludesifany)
- [handleExists](ValueExtractorHandler.md#handleexists)
- [handleGreaterThan](ValueExtractorHandler.md#handlegreaterthan)
- [handleGreaterThanOrEquals](ValueExtractorHandler.md#handlegreaterthanorequals)
- [handleIncludes](ValueExtractorHandler.md#handleincludes)
- [handleIntersection](ValueExtractorHandler.md#handleintersection)
- [handleLessThan](ValueExtractorHandler.md#handlelessthan)
- [handleLessThanOrEquals](ValueExtractorHandler.md#handlelessthanorequals)
- [handleMissing](ValueExtractorHandler.md#handlemissing)
- [handleNotEquals](ValueExtractorHandler.md#handlenotequals)
- [handleUnion](ValueExtractorHandler.md#handleunion)

## Constructors

### constructor

• **new ValueExtractorHandler**()

## Methods

### handleEquals

▸ **handleEquals**(`op`): `string` \| `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`Equals`](../interfaces/Equals.md) |

#### Returns

`string` \| `number`

#### Implementation of

[OperationHandler](../interfaces/OperationHandler.md).[handleEquals](../interfaces/OperationHandler.md#handleequals)

#### Defined in

[packages/core/src/features/cohort/cohortFilterSlice.ts:66](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/cohort/cohortFilterSlice.ts#L66)

___

### handleExcludes

▸ **handleExcludes**(`op`): readonly `string`[] \| readonly `number`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`Excludes`](../interfaces/Excludes.md) |

#### Returns

readonly `string`[] \| readonly `number`[]

#### Implementation of

[OperationHandler](../interfaces/OperationHandler.md).[handleExcludes](../interfaces/OperationHandler.md#handleexcludes)

#### Defined in

[packages/core/src/features/cohort/cohortFilterSlice.ts:68](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/cohort/cohortFilterSlice.ts#L68)

___

### handleExcludesIfAny

▸ **handleExcludesIfAny**(`op`): `string` \| readonly `string`[] \| readonly `number`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`ExcludesIfAny`](../interfaces/ExcludesIfAny.md) |

#### Returns

`string` \| readonly `string`[] \| readonly `number`[]

#### Implementation of

[OperationHandler](../interfaces/OperationHandler.md).[handleExcludesIfAny](../interfaces/OperationHandler.md#handleexcludesifany)

#### Defined in

[packages/core/src/features/cohort/cohortFilterSlice.ts:69](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/cohort/cohortFilterSlice.ts#L69)

___

### handleExists

▸ **handleExists**(`_`): `undefined`

#### Parameters

| Name | Type |
| :------ | :------ |
| `_` | [`Exists`](../interfaces/Exists.md) |

#### Returns

`undefined`

#### Implementation of

[OperationHandler](../interfaces/OperationHandler.md).[handleExists](../interfaces/OperationHandler.md#handleexists)

#### Defined in

[packages/core/src/features/cohort/cohortFilterSlice.ts:76](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/cohort/cohortFilterSlice.ts#L76)

___

### handleGreaterThan

▸ **handleGreaterThan**(`op`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`GreaterThan`](../interfaces/GreaterThan.md) |

#### Returns

`number`

#### Implementation of

[OperationHandler](../interfaces/OperationHandler.md).[handleGreaterThan](../interfaces/OperationHandler.md#handlegreaterthan)

#### Defined in

[packages/core/src/features/cohort/cohortFilterSlice.ts:72](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/cohort/cohortFilterSlice.ts#L72)

___

### handleGreaterThanOrEquals

▸ **handleGreaterThanOrEquals**(`op`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`GreaterThanOrEquals`](../interfaces/GreaterThanOrEquals.md) |

#### Returns

`number`

#### Implementation of

[OperationHandler](../interfaces/OperationHandler.md).[handleGreaterThanOrEquals](../interfaces/OperationHandler.md#handlegreaterthanorequals)

#### Defined in

[packages/core/src/features/cohort/cohortFilterSlice.ts:71](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/cohort/cohortFilterSlice.ts#L71)

___

### handleIncludes

▸ **handleIncludes**(`op`): readonly `string`[] \| readonly `number`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`Includes`](../interfaces/Includes.md) |

#### Returns

readonly `string`[] \| readonly `number`[]

#### Implementation of

[OperationHandler](../interfaces/OperationHandler.md).[handleIncludes](../interfaces/OperationHandler.md#handleincludes)

#### Defined in

[packages/core/src/features/cohort/cohortFilterSlice.ts:70](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/cohort/cohortFilterSlice.ts#L70)

___

### handleIntersection

▸ **handleIntersection**(`_`): `undefined`

#### Parameters

| Name | Type |
| :------ | :------ |
| `_` | [`Intersection`](../interfaces/Intersection.md) |

#### Returns

`undefined`

#### Implementation of

[OperationHandler](../interfaces/OperationHandler.md).[handleIntersection](../interfaces/OperationHandler.md#handleintersection)

#### Defined in

[packages/core/src/features/cohort/cohortFilterSlice.ts:77](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/cohort/cohortFilterSlice.ts#L77)

___

### handleLessThan

▸ **handleLessThan**(`op`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`LessThan`](../interfaces/LessThan.md) |

#### Returns

`number`

#### Implementation of

[OperationHandler](../interfaces/OperationHandler.md).[handleLessThan](../interfaces/OperationHandler.md#handlelessthan)

#### Defined in

[packages/core/src/features/cohort/cohortFilterSlice.ts:73](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/cohort/cohortFilterSlice.ts#L73)

___

### handleLessThanOrEquals

▸ **handleLessThanOrEquals**(`op`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`LessThanOrEquals`](../interfaces/LessThanOrEquals.md) |

#### Returns

`number`

#### Implementation of

[OperationHandler](../interfaces/OperationHandler.md).[handleLessThanOrEquals](../interfaces/OperationHandler.md#handlelessthanorequals)

#### Defined in

[packages/core/src/features/cohort/cohortFilterSlice.ts:74](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/cohort/cohortFilterSlice.ts#L74)

___

### handleMissing

▸ **handleMissing**(`_`): `undefined`

#### Parameters

| Name | Type |
| :------ | :------ |
| `_` | [`Missing`](../interfaces/Missing.md) |

#### Returns

`undefined`

#### Implementation of

[OperationHandler](../interfaces/OperationHandler.md).[handleMissing](../interfaces/OperationHandler.md#handlemissing)

#### Defined in

[packages/core/src/features/cohort/cohortFilterSlice.ts:75](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/cohort/cohortFilterSlice.ts#L75)

___

### handleNotEquals

▸ **handleNotEquals**(`op`): `string` \| `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`NotEquals`](../interfaces/NotEquals.md) |

#### Returns

`string` \| `number`

#### Implementation of

[OperationHandler](../interfaces/OperationHandler.md).[handleNotEquals](../interfaces/OperationHandler.md#handlenotequals)

#### Defined in

[packages/core/src/features/cohort/cohortFilterSlice.ts:67](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/cohort/cohortFilterSlice.ts#L67)

___

### handleUnion

▸ **handleUnion**(`_`): `undefined`

#### Parameters

| Name | Type |
| :------ | :------ |
| `_` | [`Union`](../interfaces/Union.md) |

#### Returns

`undefined`

#### Implementation of

[OperationHandler](../interfaces/OperationHandler.md).[handleUnion](../interfaces/OperationHandler.md#handleunion)

#### Defined in

[packages/core/src/features/cohort/cohortFilterSlice.ts:78](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/cohort/cohortFilterSlice.ts#L78)
