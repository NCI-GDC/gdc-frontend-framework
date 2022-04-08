[@gff/core](../README.md) / [Exports](../modules.md) / ProjectDefaults

# Interface: ProjectDefaults

## Table of contents

### Properties

- [dbgap\_accession\_number](ProjectDefaults.md#dbgap_accession_number)
- [disease\_type](ProjectDefaults.md#disease_type)
- [name](ProjectDefaults.md#name)
- [primary\_site](ProjectDefaults.md#primary_site)
- [program](ProjectDefaults.md#program)
- [project\_id](ProjectDefaults.md#project_id)
- [summary](ProjectDefaults.md#summary)

## Properties

### dbgap\_accession\_number

• `Readonly` **dbgap\_accession\_number**: `string`

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:233](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/gdcapi.ts#L233)

___

### disease\_type

• `Readonly` **disease\_type**: readonly `string`[]

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:234](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/gdcapi.ts#L234)

___

### name

• `Readonly` **name**: `string`

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:235](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/gdcapi.ts#L235)

___

### primary\_site

• `Readonly` **primary\_site**: readonly `string`[]

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:236](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/gdcapi.ts#L236)

___

### program

• `Optional` `Readonly` **program**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `dbgap_accession_number` | `string` |
| `name` | `string` |
| `program_id` | `string` |

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:253](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/gdcapi.ts#L253)

___

### project\_id

• `Readonly` **project\_id**: `string`

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:237](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/gdcapi.ts#L237)

___

### summary

• `Optional` `Readonly` **summary**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `case_count` | `number` |
| `data_categories?` | readonly { `case_count`: `number` ; `data_category`: `string` ; `file_count`: `number`  }[] |
| `experimental_strategies?` | readonly { `case_count`: `number` ; `experimental_strategy`: `string` ; `file_count`: `number`  }[] |
| `file_count` | `number` |
| `file_size` | `number` |

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:238](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/gdcapi.ts#L238)
