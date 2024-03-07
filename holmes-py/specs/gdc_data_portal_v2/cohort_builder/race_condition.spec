# Cohort Builder - Race Condition
Date Created    : 03/06/2024
Version			    : 1.0
Owner		        : GDC QA
Description		  : Add filters quickly and ensure case counts are accurate
Test-case       :

tags: gdc-data-portal-v2, cohort-builder, filter-card

## Navigate to Cohort Builder
* On GDC Data Portal V2 app
* Navigate to "Cohort" from "Header" "section"

## Available Data - Experimental Strategy
* Make the following selections on the Cohort Builder page without pauses
  |tab_name               |facet_name           |selection            |
  |-----------------------|---------------------|---------------------|
  |Available Data         |Experimental Strategy|Methylation Array    |
  |General                |Primary Site         |brain                |
* Collect Cohort Bar Case Count for comparison
* Collect case counts for the following filters on the Cohort Builder page for cohort "Race_Condition"
  |tab_name               |facet_name           |selection                      |
  |-----------------------|---------------------|-------------------------------|
  |General                |Primary Site         |brain                          |
* Verify "Primary Site_brain_Race_Condition Count" and "Cohort Bar Case Count" are "Equal"
* Clear active cohort filters
* Make the following selections on the Cohort Builder page without pauses
  |tab_name               |facet_name           |selection            |
  |-----------------------|---------------------|---------------------|
  |Available Data         |Experimental Strategy|Methylation Array    |
  |Available Data         |Experimental Strategy|scRNA-Seq            |
  |Available Data         |Experimental Strategy|ATAC-Seq             |
  |Available Data         |Experimental Strategy|miRNA-Seq            |
  |Available Data         |Experimental Strategy|WGS                  |
  |Available Data         |Experimental Strategy|WXS                  |
  |Available Data         |Experimental Strategy|Methylation Array    |
  |Available Data         |Experimental Strategy|RNA-Seq              |
  |Available Data         |Experimental Strategy|Targeted Sequencing  |
  |Available Data         |Experimental Strategy|ATAC-Seq             |
  |Available Data         |Experimental Strategy|scRNA-Seq            |
  |Available Data         |Experimental Strategy|Diagnostic Slide     |
  |General                |Program              |MATCH                |
* Collect Cohort Bar Case Count for comparison
* Collect case counts for the following filters on the Cohort Builder page for cohort "Race_Condition"
  |tab_name               |facet_name           |selection                      |
  |-----------------------|---------------------|-------------------------------|
  |General                |Program              |MATCH                          |
* Verify "Program_MATCH_Race_Condition Count" and "Cohort Bar Case Count" are "Equal"

## Available Data - Multiple Facets
* Clear active cohort filters
* Make the following selections on the Cohort Builder page without pauses
  |tab_name               |facet_name           |selection                |
  |-----------------------|---------------------|-------------------------|
  |Available Data         |Data Category        |sequencing reads         |
  |Available Data         |Data Category        |transcriptome profiling  |
  |Available Data         |Data Type            |Splice Junction Quantification|
  |Available Data         |Data Type            |Isoform Expression Quantification|
  |Available Data         |Data Type            |Aligned Reads            |
  |Available Data         |Workflow Type        |STAR - Counts            |
  |Available Data         |Data Format          |tsv                      |
* Collect Cohort Bar Case Count for comparison
* Collect case counts for the following filters on the Cohort Builder page for cohort "Race_Condition"
  |tab_name               |facet_name           |selection                |
  |-----------------------|---------------------|-------------------------|
  |Available Data         |Data Format          |tsv                      |
* Verify "Data Format_tsv_Race_Condition Count" and "Cohort Bar Case Count" are "Equal"

## Filters from Different Tabs
* Clear active cohort filters
* Make the following selections on the Cohort Builder page without pauses
  |tab_name               |facet_name           |selection            |
  |-----------------------|---------------------|---------------------|
  |General                |Program              |TCGA                 |
  |Demographic            |Gender               |male                 |
  |General Diagnosis      |Morphology           |8140/3               |
  |Disease Status and History|Prior Treatment   |no                   |
  |Stage Classification   |Ajcc Pathologic Stage|stage iia            |
  |Grade Classification   |Tumor Grade          |not reported         |
  |Exposure               |Alcohol History      |not reported         |
  |Biospecimen            |Sample Type          |primary tumor        |
  |Available Data         |Data Format          |txt                  |
* Collect Cohort Bar Case Count for comparison
* Collect case counts for the following filters on the Cohort Builder page for cohort "Race_Condition"
  |tab_name               |facet_name           |selection            |
  |-----------------------|---------------------|---------------------|
  |Available Data         |Data Format          |txt                  |
* Verify "Data Format_txt_Race_Condition Count" and "Cohort Bar Case Count" are "Equal"

## Treatment - Multiple Facets
* Clear active cohort filters
* Make the following selections on the Cohort Builder page without pauses
  |tab_name               |facet_name           |selection                    |
  |-----------------------|---------------------|-----------------------------|
  |Treatment              |Treatment Type       |radiation therapy, nos       |
  |Treatment              |Treatment Type       |pharmaceutical therapy, nos  |
  |Treatment              |Treatment Type       |chemotherapy                 |
  |Treatment              |Treatment Type       |stem cell transplantation, autologous |
  |Treatment              |Therapeutic Agents   |cyclophosphamide             |
  |Treatment              |Treatment Outcome    |complete response            |
  |Demographic            |Vital Status         |alive                        |
* Collect Cohort Bar Case Count for comparison
* Collect case counts for the following filters on the Cohort Builder page for cohort "Race_Condition"
  |tab_name               |facet_name           |selection            |
  |-----------------------|---------------------|---------------------|
  |Demographic            |Vital Status         |alive                |
* Verify "Vital Status_alive_Race_Condition Count" and "Cohort Bar Case Count" are "Equal"

## Other Classification - Cog Neuroblastoma Risk Group
* Clear active cohort filters
* Make the following selections on the Cohort Builder page without pauses
  |tab_name               |facet_name                   |selection            |
  |-----------------------|-----------------------------|---------------------|
  |Other Classification   |Cog Neuroblastoma Risk Group |high risk            |
  |Available Data         |Platform                     |illumina             |
* Collect Cohort Bar Case Count for comparison
* Collect case counts for the following filters on the Cohort Builder page for cohort "Race_Condition"
  |tab_name               |facet_name                   |selection            |
  |-----------------------|-----------------------------|---------------------|
  |Available Data         |Platform                     |illumina             |
* Verify "Platform_illumina_Race_Condition Count" and "Cohort Bar Case Count" are "Equal"

## Other Classification - Eln Risk Classification
* Clear active cohort filters
* Make the following selections on the Cohort Builder page without pauses
  |tab_name               |facet_name                   |selection            |
  |-----------------------|-----------------------------|---------------------|
  |Other Classification   |Eln Risk Classification      |adverse              |
  |Other Classification   |Eln Risk Classification      |intermediate         |
  |Other Classification   |Eln Risk Classification      |favorable            |
  |Disease Status and History|Progression or Recurrence |no                   |
* Collect Cohort Bar Case Count for comparison
* Collect case counts for the following filters on the Cohort Builder page for cohort "Race_Condition"
  |tab_name               |facet_name                   |selection            |
  |-----------------------|-----------------------------|---------------------|
  |Disease Status and History|Progression or Recurrence |no                   |
* Verify "Progression or Recurrence_no_Race_Condition Count" and "Cohort Bar Case Count" are "Equal"

## Other Classification - Wilms Tumor Histologic Subtype
* Clear active cohort filters
* Make the following selections on the Cohort Builder page without pauses
  |tab_name               |facet_name                     |selection            |
  |-----------------------|-------------------------------|---------------------|
  |Other Classification   |Wilms Tumor Histologic Subtype |favorable            |
  |Other Classification   |Wilms Tumor Histologic Subtype |unfavorable          |
  |Biospecimen            |Tumor Descriptor               |primary              |
* Collect Cohort Bar Case Count for comparison
* Collect case counts for the following filters on the Cohort Builder page for cohort "Race_Condition"
  |tab_name               |facet_name                   |selection            |
  |-----------------------|-----------------------------|---------------------|
  |Biospecimen            |Tumor Descriptor             |primary              |
* Verify "Tumor Descriptor_primary_Race_Condition Count" and "Cohort Bar Case Count" are "Equal"
