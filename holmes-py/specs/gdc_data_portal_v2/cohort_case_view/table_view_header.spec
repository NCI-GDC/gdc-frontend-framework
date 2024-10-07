# Cohort Case View - Table View Header
Date Created        : 10/01/2024
Version			    : 1.0
Owner		        : GDC QA
Description		    : Validate Cohort Header
Test-Case           : PEAR-1052

tags: gdc-data-portal-v2, regression, cohort-bar, case-view

## Navigate to Table View
* On GDC Data Portal V2 app
* Navigate to "Analysis" from "Header" "section"
* Expand or collapse the cohort bar
* Go to tab "Table View" in Cohort Case View

## Biospecimen - TSV
* In table "Cases", search the table for "MMRF_11"
* Download "TSV" from "Cohort Table View Biospecimen"
* Read file content from compressed "TSV from Cohort Table View Biospecimen"
* Verify that "TSV from Cohort Table View Biospecimen" has expected information
    |required_info                          |
    |---------------------------------------|
    |aliquot_id                             |
    |aliquot_volume                         |
    |no_matched_normal_wxs                  |
    |selected_normal_targeted_sequencing    |
    |7c0feb4c-3ce1-529a-98a6-3e48e1d06a8a   |
    |ba678f26-a87d-4da0-bcee-d3a6caffae53   |
    |MMRF_1152_1_BM_CD138pos_T2_TSE61_K03194|
    |analyte_quantity                       |
    |ribosomal_rna_28s_16s_ratio            |
    |well_number                            |
    |172f1884-c9d3-529b-a885-b5a37442a7e3   |
    |de08e2be-078b-58b3-90a6-7546145af589   |
    |slide_id                               |
    |slide_submitter_id                     |
    |percent_neutrophil_infiltration        |
    |prostatic_chips_total_count            |
    |portion_id                             |
    |portion_submitter_id                   |
    |portion_number                         |
    |8742f2f2-fe95-5f62-9ef1-8241488cd623   |
    |331d5f27-bfe8-58f6-98b9-f54376f15c96   |
    |sample_id                              |
    |sample_submitter_id                    |
    |days_to_sample_procurement             |
    |intermediate_dimension                 |
    |preservation_method                    |
    |time_between_clamping_and_freezing     |
    |tumor_code_id                          |
    |ccff20ac-6979-4602-ae3e-bb8fb3968a61   |
    |-27                                    |
    |Primary Blood Derived Cancer - Bone Marrow|
    |Bone Marrow NOS                        |
    |MMRF_1195_1_PB_Whole                   |
* Verify that "TSV from Cohort Table View Biospecimen" does not contain specified information
    |required_info                          |
    |---------------------------------------|
    |FM-AD                                  |
    |TARGET-AML                             |
    |MATCH                                  |
    |TCGA                                   |


## Biospecimen - JSON
* In table "Cases", search the table for "MMRF_1186"
* Download "JSON" from "Cohort Table View Biospecimen"
* Read from "JSON from Cohort Table View Biospecimen"
* Verify that "JSON from Cohort Table View Biospecimen" has expected information
    |required_info                          |
    |---------------------------------------|
    |e04417a0-1644-410d-b771-d5d097500a49   |
    |MMRF_1186                              |
    |MMRF-COMMPASS                          |
    |0ee3be21-7250-4f1c-a5c0-6b2ba89b2f4a   |
    |MMRF_1186_2_BM_CD138pos                |
    |c15574aa-1229-5e79-97c8-e3f0052c1442   |
    |80b55c55-e704-439a-919f-9661cc94ba8d   |
    |MMRF_1186_2_BM_CD138pos_T1_KHS5U_L14411|
    |ff9daa57-3c56-5a00-b2d7-6fb061caf3fa   |
    |2018-01-01T12:08:49.642883-06:00       |
    |837e028e-39f2-51f2-9ae7-6242bb0dff0a   |
* Verify that "JSON from Cohort Table View Biospecimen" does not contain specified information
    |required_info                          |
    |---------------------------------------|
    |FM-AD                                  |
    |TARGET-AML                             |
    |MATCH                                  |
    |TCGA                                   |
    |MMRF_1108                              |

## Biospecimen - Validate JSON Fields
  |field_name                                       |
  |-------------------------------------------------|
  |case_id                                          |
  |project.project_id                               |
  |submitter_id                                     |
  |samples.tumor_descriptor	                        |
  |samples.preservation_method                      |
  |samples.sample_id                                |
  |samples.portions.analytes.analyte_id	            |
  |samples.portions.analytes.aliquots.aliquot_id	|
  |samples.portions.portion_id	                    |
* Verify that the "JSON from Cohort Table View Biospecimen" has <field_name> for each object

## Cohort Table - JSON
* In table "Cases", search the table for "MMRF_11"
* Download "JSON" from "Cohort Table View"
* Read from "JSON from Cohort Table View"
* Verify that "JSON from Cohort Table View" has expected information
    |required_info                          |
    |---------------------------------------|
    |RNA-Seq                                |
    |WGS                                    |
    |WXS                                    |
    |Hematopoietic and reticuloendothelial systems|
    |Plasma Cell Tumors                     |
    |8bb96689-fe0a-45b5-af07-3a6c30480927   |
    |MMRF_1171                              |
    |MMRF-COMMPASS                          |
    |MMRF                                   |
    |29995                                  |
    |white                                  |
    |male                                   |
    |not hispanic or latino                 |
    |Dead                                   |
    |female                                 |
    |372                                    |
    |Alive                                  |
    |6356f1f3-7d56-4464-b70c-84eb69b7262c   |
* Verify that "JSON from Cohort Table View" does not contain specified information
    |required_info                          |
    |---------------------------------------|
    |FM-AD                                  |
    |TARGET-AML                             |
    |MATCH                                  |
    |TCGA                                   |

## Cohort Table - Validate JSON Fields
  |field_name                                       |
  |-------------------------------------------------|
  |summary.file_count                               |
  |primary_site	                                    |
  |disease_type	                                    |
  |case_id	                                        |
  |submitter_id	                                    |
  |project.project_id                               |
  |project.program.name                             |
  |diagnoses.age_at_diagnosis                       |
  |demographic.race                                 |
  |demographic.gender                               |
  |demographic.ethnicity                            |
  |demographic.vital_status                         |
  |demographic.days_to_death                        |
* Verify that the "JSON from Cohort Table View" has <field_name> for each object
