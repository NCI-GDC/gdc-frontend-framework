[@gff/core](../README.md) / [Exports](../modules.md) / SSMSConsequence

# Interface: SSMSConsequence

## Table of contents

### Properties

- [aa\_change](SSMSConsequence.md#aa_change)
- [annotation](SSMSConsequence.md#annotation)
- [consequence\_type](SSMSConsequence.md#consequence_type)
- [gene](SSMSConsequence.md#gene)
- [id](SSMSConsequence.md#id)
- [is\_canonical](SSMSConsequence.md#is_canonical)

## Properties

### aa\_change

• `Readonly` **aa\_change**: `string`

#### Defined in

[packages/core/src/features/genomic/ssmsTableSlice.ts:94](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/genomic/ssmsTableSlice.ts#L94)

___

### annotation

• `Readonly` **annotation**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `polyphen_impact` | `string` |
| `polyphen_score` | `number` |
| `shift_impact` | `string` |
| `sift_score` | `string` |
| `vep_impact` | `string` |

#### Defined in

[packages/core/src/features/genomic/ssmsTableSlice.ts:95](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/genomic/ssmsTableSlice.ts#L95)

___

### consequence\_type

• **consequence\_type**: `string`

#### Defined in

[packages/core/src/features/genomic/ssmsTableSlice.ts:102](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/genomic/ssmsTableSlice.ts#L102)

___

### gene

• `Readonly` **gene**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `gene_id` | `string` |
| `symbol` | `string` |

#### Defined in

[packages/core/src/features/genomic/ssmsTableSlice.ts:103](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/genomic/ssmsTableSlice.ts#L103)

___

### id

• `Readonly` **id**: `string`

#### Defined in

[packages/core/src/features/genomic/ssmsTableSlice.ts:93](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/genomic/ssmsTableSlice.ts#L93)

___

### is\_canonical

• `Readonly` **is\_canonical**: `boolean`

#### Defined in

[packages/core/src/features/genomic/ssmsTableSlice.ts:107](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/genomic/ssmsTableSlice.ts#L107)
