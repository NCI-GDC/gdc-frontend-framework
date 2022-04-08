[@gff/core](../README.md) / [Exports](../modules.md) / GdcFile

# Interface: GdcFile

## Table of contents

### Properties

- [access](GdcFile.md#access)
- [acl](GdcFile.md#acl)
- [analysis](GdcFile.md#analysis)
- [cases](GdcFile.md#cases)
- [createDatetime](GdcFile.md#createdatetime)
- [dataCategory](GdcFile.md#datacategory)
- [dataFormat](GdcFile.md#dataformat)
- [dataRelease](GdcFile.md#datarelease)
- [dataType](GdcFile.md#datatype)
- [downstream\_analyses](GdcFile.md#downstream_analyses)
- [experimentalStrategy](GdcFile.md#experimentalstrategy)
- [fileId](GdcFile.md#fileid)
- [fileName](GdcFile.md#filename)
- [fileSize](GdcFile.md#filesize)
- [fileType](GdcFile.md#filetype)
- [id](GdcFile.md#id)
- [md5sum](GdcFile.md#md5sum)
- [platform](GdcFile.md#platform)
- [project\_id](GdcFile.md#project_id)
- [state](GdcFile.md#state)
- [submitterId](GdcFile.md#submitterid)
- [updatedDatetime](GdcFile.md#updateddatetime)
- [version](GdcFile.md#version)

## Properties

### access

• `Readonly` **access**: ``"open"`` \| ``"controlled"``

#### Defined in

[packages/core/src/features/files/filesSlice.ts:207](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/files/filesSlice.ts#L207)

___

### acl

• `Readonly` **acl**: readonly `string`[]

#### Defined in

[packages/core/src/features/files/filesSlice.ts:208](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/files/filesSlice.ts#L208)

___

### analysis

• `Optional` `Readonly` **analysis**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `input_files?` | readonly `string`[] |
| `updated_datetime` | `string` |
| `workflow_type` | `string` |

#### Defined in

[packages/core/src/features/files/filesSlice.ts:264](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/files/filesSlice.ts#L264)

___

### cases

• `Optional` `Readonly` **cases**: readonly { `annotations?`: readonly string[] ; `case_id`: `string` ; `samples?`: readonly { readonly sample\_id: string; readonly sample\_type: string; readonly submitter\_id: string; readonly tissue\_type: string; readonly portions?: readonly { readonly submitter\_id: string; readonly analytes?: readonly { readonly analyte\_id: string; readonly analyte\_type: string; readonly submitter\_id: string; }[]... ; `submitter_id`: `string`  }[]

#### Defined in

[packages/core/src/features/files/filesSlice.ts:225](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/files/filesSlice.ts#L225)

___

### createDatetime

• `Readonly` **createDatetime**: `string`

#### Defined in

[packages/core/src/features/files/filesSlice.ts:209](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/files/filesSlice.ts#L209)

___

### dataCategory

• `Readonly` **dataCategory**: `string`

#### Defined in

[packages/core/src/features/files/filesSlice.ts:211](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/files/filesSlice.ts#L211)

___

### dataFormat

• `Readonly` **dataFormat**: ``"TSV"`` \| ``"TXT"`` \| ``"VCF"`` \| ``"BAM"`` \| ``"MAF"`` \| ``"SVS"`` \| ``"IDAT"`` \| ``"BCR XML"`` \| ``"BCR SSF XML"`` \| ``"BEDPE"`` \| ``"BCR AUXILIARY XML"`` \| ``"BCR OMF XML"`` \| ``"BCR BIOTAB"`` \| ``"BCR Biotab"`` \| ``"BCR PPS XML"`` \| ``"CDC JSON"`` \| ``"XLSX"`` \| ``"MEX"`` \| ``"HDF5"``

#### Defined in

[packages/core/src/features/files/filesSlice.ts:212](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/files/filesSlice.ts#L212)

___

### dataRelease

• `Readonly` **dataRelease**: `string`

#### Defined in

[packages/core/src/features/files/filesSlice.ts:213](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/files/filesSlice.ts#L213)

___

### dataType

• `Readonly` **dataType**: ``"Aggregated Somatic Mutation"`` \| ``"Aligned Reads"`` \| ``"Allele-specific Copy Number Segment"`` \| ``"Annotated Somatic Mutation"`` \| ``"Biospecimen Supplement"`` \| ``"Clinical Supplement"`` \| ``"Copy Number Segment"`` \| ``"Differential Gene Expression"`` \| ``"Gene Expression Quantification"`` \| ``"Gene Level Copy Number Scores"`` \| ``"Gene Level Copy Number"`` \| ``"Isoform Expression Quantification"`` \| ``"Masked Annotated Somatic Mutation"`` \| ``"Masked Copy Number Segment"`` \| ``"Masked Somatic Mutation"`` \| ``"Methylation Beta Value"`` \| ``"Protein Expression Quantification"`` \| ``"Raw CGI Variant"`` \| ``"Raw Simple Somatic Mutation"`` \| ``"Single Cell Analysis"`` \| ``"Slide Image"`` \| ``"Splice Junction Quantification"`` \| ``"Structural Rearrangement"`` \| ``"Transcript Fusion"`` \| ``"Masked Intensities"`` \| ``"miRNA Expression Quantification"``

#### Defined in

[packages/core/src/features/files/filesSlice.ts:214](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/files/filesSlice.ts#L214)

___

### downstream\_analyses

• `Optional` `Readonly` **downstream\_analyses**: readonly { `output_files?`: readonly { readonly file\_name: string; readonly data\_category: string; readonly data\_type: string; readonly data\_format: string; readonly file\_size: number; }[] ; `workflow_type`: `string`  }[]

#### Defined in

[packages/core/src/features/files/filesSlice.ts:269](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/files/filesSlice.ts#L269)

___

### experimentalStrategy

• `Optional` `Readonly` **experimentalStrategy**: ``"ATAC-Seq"`` \| ``"Diagnostic Slide"`` \| ``"Genotyping Array"`` \| ``"Methylation Array"`` \| ``"RNA-Seq"`` \| ``"Targeted Sequencing"`` \| ``"Tissue Slide"`` \| ``"WGS"`` \| ``"WXS"`` \| ``"miRNA-Seq"`` \| ``"scRNA-Seq"`` \| ``"_missing"`` \| ``"Reverse Phase Protein Array"``

#### Defined in

[packages/core/src/features/files/filesSlice.ts:223](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/files/filesSlice.ts#L223)

___

### fileId

• `Readonly` **fileId**: `string`

#### Defined in

[packages/core/src/features/files/filesSlice.ts:215](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/files/filesSlice.ts#L215)

___

### fileName

• `Readonly` **fileName**: `string`

#### Defined in

[packages/core/src/features/files/filesSlice.ts:216](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/files/filesSlice.ts#L216)

___

### fileSize

• `Readonly` **fileSize**: `number`

#### Defined in

[packages/core/src/features/files/filesSlice.ts:217](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/files/filesSlice.ts#L217)

___

### fileType

• `Readonly` **fileType**: ``"annotated_somatic_mutation"`` \| ``"simple_somatic_mutation"`` \| ``"aligned_reads"`` \| ``"gene_expression"`` \| ``"copy_number_segment"`` \| ``"copy_number_estimate"`` \| ``"slide_image"`` \| ``"mirna_expression"`` \| ``"biospecimen_supplement"`` \| ``"clinical_supplement"`` \| ``"methylation_beta_value"`` \| ``"structural_variation"`` \| ``"aggregated_somatic_mutation"`` \| ``"masked_somatic_mutation"`` \| ``"secondary_expression_analysis"`` \| ``"masked_methylation_array"`` \| ``"protein_expression"``

#### Defined in

[packages/core/src/features/files/filesSlice.ts:221](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/files/filesSlice.ts#L221)

___

### id

• `Readonly` **id**: `string`

#### Defined in

[packages/core/src/features/files/filesSlice.ts:205](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/files/filesSlice.ts#L205)

___

### md5sum

• `Readonly` **md5sum**: `string`

#### Defined in

[packages/core/src/features/files/filesSlice.ts:218](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/files/filesSlice.ts#L218)

___

### platform

• `Readonly` **platform**: `string`

#### Defined in

[packages/core/src/features/files/filesSlice.ts:219](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/files/filesSlice.ts#L219)

___

### project\_id

• `Optional` `Readonly` **project\_id**: `string`

#### Defined in

[packages/core/src/features/files/filesSlice.ts:224](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/files/filesSlice.ts#L224)

___

### state

• `Readonly` **state**: `string`

#### Defined in

[packages/core/src/features/files/filesSlice.ts:220](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/files/filesSlice.ts#L220)

___

### submitterId

• `Readonly` **submitterId**: `string`

#### Defined in

[packages/core/src/features/files/filesSlice.ts:206](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/files/filesSlice.ts#L206)

___

### updatedDatetime

• `Readonly` **updatedDatetime**: `string`

#### Defined in

[packages/core/src/features/files/filesSlice.ts:210](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/files/filesSlice.ts#L210)

___

### version

• `Readonly` **version**: `string`

#### Defined in

[packages/core/src/features/files/filesSlice.ts:222](https://github.com/NCI-GDC/gdc-frontend-framework/blob/5235625/packages/core/src/features/files/filesSlice.ts#L222)
