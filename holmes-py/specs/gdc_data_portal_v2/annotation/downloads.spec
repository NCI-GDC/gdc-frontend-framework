# Browse Annotation - Downloads
Date Created        : 05/15/2025
Version			        : 1.0
Owner		            : GDC QA
Description		      : JSON and TSV Downloads
Test-Case           : PEAR-2423

tags: gdc-data-portal-v2, regression, annotations

## Navigate to Browse Annotations
* On GDC Data Portal V2 app
* Navigate to "Browse Annotations" from "Header" "section"
* In table "Annotations" select or deselect these options from the table column selector
    |table_column_to_select                 |
    |---------------------------------------|
    |Case ID                                |
    |Program Name                           |
    |Entity ID                              |
    |Status                                 |
    |Notes                                  |

## Download JSON
* In table "Annotations", search the table for "0458ea85-1477-5a46-8da5-eb19d7f23896"
* Verify the table "Annotations" has a total of "1" items

* Download "JSON" from "Browse Annotations"
* Read from "JSON from Browse Annotations"
* Verify that "JSON from Browse Annotations" has expected information
    |required_info                          |
    |---------------------------------------|
    |0458ea85-1477-5a46-8da5-eb19d7f23896   |
    |TCGA-AB-2847                           |
    |Biospecimens from this case belong to Batch 25 and were processed into analyte outside of the normal TCGA standardized laboratory pipeline.  Users should note that the resulting characterization data may exhibit features (e.g. batch effects) due to this difference.   |
    |case                                   |
    |5b846aad-6133-4133-a78b-65be81332cb4   |
    |TCGA-LAML                              |
    |TCGA                                   |
    |Notification                           |
    |5b846aad-6133-4133-a78b-65be81332cb4   |
    |Alternate sample pipeline              |
    |2012-11-13T00:00:00                    |
    |Approved                               |
    |TCGA-AB-2847                           |
* Verify that "JSON from Browse Annotations" does not contain specified information
    |required_info                          |
    |---------------------------------------|
    |0f0ca45e-5687-45c2-aedd-ef57a2ea7385   |
    |0249d337-1373-445e-a618-37b3e0ba809a   |
    |014ead0b-da21-582e-be8b-7ac57d494670   |
    |20d5e413-eb23-554a-8e31-c920820cc7e6   |
    |2bc15fb7-1d0b-4eaa-9c05-1e64e23d038a   |

## Annotations Table - Validate JSON File Fields
  |field_name                               |
  |-----------------------------------------|
  |annotation_id	                          |
  |entity_submitter_id	                    |
  |notes	                                  |
  |entity_type	                            |
  |case_id	                                |
  |project.project_id                       |
  |project.program.name                     |
  |classification	                          |
  |entity_id	                              |
  |category	                                |
  |created_datetime                         |
  |status                                   |
  |case_submitter_id	                      |
* Verify that the "JSON from Browse Annotations" has <field_name> for each object


## Download TSV
* In table "Annotations", search the table for "d64a94a6-b0a8-5aac-983c-2dbbb4363583"
* Download "TSV" from "Browse Annotations"
* Read from "TSV from Browse Annotations"
* Verify that "TSV from Browse Annotations" has expected information
    |required_info                          |
    |---------------------------------------|
    |Case UUID                              |
    |Case ID                                |
    |Program                                |
    |Project                                |
    |Entity Type                            |
    |Entity UUID                            |
    |Entity ID                              |
    |Category                               |
    |Classification                         |
    |Created Datetime                       |
    |Status                                 |
    |Notes                                  |
    |d64a94a6-b0a8-5aac-983c-2dbbb4363583   |
    |b3169af9-675d-4f3e-a806-1840f4fc0eff   |
    |TCGA-35-3621                           |
    |TCGA                                   |
    |TCGA-LUAD                              |
    |aliquot                                |
    |a727b9e4-9361-4316-b306-01410dbb1be7   |
    |TCGA-35-3621-01A-01W-0928-08           |
    |Biospecimen identity unknown           |
    |Redaction                              |
    |2013-08-13T00:00:00                    |
    |Approved                               |
    |Participant redacted for genotype mismatch.|

* Verify that "TSV from Browse Annotations" does not contain specified information
    |required_info                          |
    |---------------------------------------|
    |0f0ca45e-5687-45c2-aedd-ef57a2ea7385   |
    |0249d337-1373-445e-a618-37b3e0ba809a   |
    |014ead0b-da21-582e-be8b-7ac57d494670   |
    |20d5e413-eb23-554a-8e31-c920820cc7e6   |
    |2bc15fb7-1d0b-4eaa-9c05-1e64e23d038a   |
