[@gff/core](../README.md) / [Exports](../modules.md) / Project

# Interface: Project

## Table of contents

### Properties

- [disease\_type](Project.md#disease_type)
- [name](Project.md#name)
- [primary\_site](Project.md#primary_site)
- [program](Project.md#program)
- [projectId](Project.md#projectid)
- [summary](Project.md#summary)

## Properties

### disease\_type

• `Readonly` **disease\_type**: `string`[]

#### Defined in

[packages/core/src/features/projects/projectsSlice.ts:15](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/projects/projectsSlice.ts#L15)

___

### name

• `Readonly` **name**: `string`

#### Defined in

[packages/core/src/features/projects/projectsSlice.ts:13](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/projects/projectsSlice.ts#L13)

___

### primary\_site

• `Readonly` **primary\_site**: `string`[]

#### Defined in

[packages/core/src/features/projects/projectsSlice.ts:16](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/projects/projectsSlice.ts#L16)

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

[packages/core/src/features/projects/projectsSlice.ts:22](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/projects/projectsSlice.ts#L22)

___

### projectId

• `Readonly` **projectId**: `string`

#### Defined in

[packages/core/src/features/projects/projectsSlice.ts:14](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/projects/projectsSlice.ts#L14)

___

### summary

• `Optional` `Readonly` **summary**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `case_count` | `number` |
| `file_count` | `number` |
| `file_size` | `number` |

#### Defined in

[packages/core/src/features/projects/projectsSlice.ts:17](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/projects/projectsSlice.ts#L17)
