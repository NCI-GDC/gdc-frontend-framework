[@gff/core](../README.md) / [Exports](../modules.md) / FileDefaults

# Interface: FileDefaults

## Table of contents

### Properties

- [access](FileDefaults.md#access)
- [acl](FileDefaults.md#acl)
- [analysis](FileDefaults.md#analysis)
- [cases](FileDefaults.md#cases)
- [create\_datetime](FileDefaults.md#create_datetime)
- [data\_category](FileDefaults.md#data_category)
- [data\_format](FileDefaults.md#data_format)
- [data\_release](FileDefaults.md#data_release)
- [data\_type](FileDefaults.md#data_type)
- [downstream\_analyses](FileDefaults.md#downstream_analyses)
- [experimental\_strategy](FileDefaults.md#experimental_strategy)
- [file\_id](FileDefaults.md#file_id)
- [file\_name](FileDefaults.md#file_name)
- [file\_size](FileDefaults.md#file_size)
- [id](FileDefaults.md#id)
- [md5sum](FileDefaults.md#md5sum)
- [platform](FileDefaults.md#platform)
- [state](FileDefaults.md#state)
- [submitter\_id](FileDefaults.md#submitter_id)
- [type](FileDefaults.md#type)
- [updated\_datetime](FileDefaults.md#updated_datetime)
- [version](FileDefaults.md#version)

## Properties

### access

• `Readonly` **access**: `string`

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:281](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/gdcapi.ts#L281)

___

### acl

• `Readonly` **acl**: readonly `string`[]

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:282](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/gdcapi.ts#L282)

___

### analysis

• `Optional` `Readonly` **analysis**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `input_files?` | readonly { `file_id`: `string`  }[] |
| `updated_datetime` | `string` |
| `workflow_type` | `string` |

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:349](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/gdcapi.ts#L349)

___

### cases

• `Optional` `Readonly` **cases**: readonly { `annotations?`: readonly { readonly annotation\_id: string; }[] ; `case_id`: `string` ; `project?`: { `dbgap_accession_number?`: `string` ; `disease_type`: `string` ; `name`: `string` ; `primary_site`: `string` ; `project_id`: `string` ; `releasable`: `boolean` ; `released`: `boolean` ; `state`: `string`  } ; `samples?`: readonly { readonly sample\_id: string; readonly sample\_type: string; readonly tissue\_type: string; readonly submitter\_id: string; readonly portions?: readonly { readonly submitter\_id: string; readonly analytes?: readonly { readonly analyte\_id: string; readonly analyte\_type: string; readonly submitter\_id: string; }[]... ; `submitter_id`: `string`  }[]

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:298](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/gdcapi.ts#L298)

___

### create\_datetime

• `Readonly` **create\_datetime**: `string`

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:283](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/gdcapi.ts#L283)

___

### data\_category

• `Readonly` **data\_category**: `string`

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:285](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/gdcapi.ts#L285)

___

### data\_format

• `Readonly` **data\_format**: `string`

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:286](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/gdcapi.ts#L286)

___

### data\_release

• `Readonly` **data\_release**: `string`

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:287](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/gdcapi.ts#L287)

___

### data\_type

• `Readonly` **data\_type**: `string`

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:288](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/gdcapi.ts#L288)

___

### downstream\_analyses

• `Optional` `Readonly` **downstream\_analyses**: readonly { `output_files?`: readonly { readonly file\_name: string; readonly data\_category: string; readonly data\_type: string; readonly data\_format: string; readonly file\_size: number; }[] ; `workflow_type`: `string`  }[]

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:356](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/gdcapi.ts#L356)

___

### experimental\_strategy

• `Readonly` **experimental\_strategy**: `string`

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:297](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/gdcapi.ts#L297)

___

### file\_id

• `Readonly` **file\_id**: `string`

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:289](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/gdcapi.ts#L289)

___

### file\_name

• `Readonly` **file\_name**: `string`

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:290](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/gdcapi.ts#L290)

___

### file\_size

• `Readonly` **file\_size**: `number`

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:291](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/gdcapi.ts#L291)

___

### id

• `Readonly` **id**: `string`

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:279](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/gdcapi.ts#L279)

___

### md5sum

• `Readonly` **md5sum**: `string`

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:292](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/gdcapi.ts#L292)

___

### platform

• `Readonly` **platform**: `string`

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:293](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/gdcapi.ts#L293)

___

### state

• `Readonly` **state**: `string`

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:294](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/gdcapi.ts#L294)

___

### submitter\_id

• `Readonly` **submitter\_id**: `string`

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:280](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/gdcapi.ts#L280)

___

### type

• `Readonly` **type**: `string`

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:295](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/gdcapi.ts#L295)

___

### updated\_datetime

• `Readonly` **updated\_datetime**: `string`

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:284](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/gdcapi.ts#L284)

___

### version

• `Readonly` **version**: `string`

#### Defined in

[packages/core/src/features/gdcapi/gdcapi.ts:296](https://github.com/NCI-GDC/gdc-frontend-framework/blob/036b468/packages/core/src/features/gdcapi/gdcapi.ts#L296)
