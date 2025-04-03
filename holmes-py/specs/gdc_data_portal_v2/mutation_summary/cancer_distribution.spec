# Mutation Summary - Cancer Distribution Table
Date Created: 03/20/2025
Version			: 1.0
Owner		    : GDC QA
Description : Validate Cancer Distribution Table and Downloads
Test-Case   : PEAR-2367

tags: gdc-data-portal-v2, regression, mutation-summary

## Navigate to Mutation Summary Page: chr1:g.114716126C>T
* On GDC Data Portal V2 app
* Quick search for "chr1:g.114716126C>T" and go to its page

## Validate Table: Cancer Distribution
* Verify the table "Cancer Distribution Mutation Summary" header text is correct
    |expected_text                          |column |
    |---------------------------------------|-------|
    |Project                                |1      |
    |Disease Type                           |2      |
    |Primary Site                           |3      |
    |# SSM Affected Cases                   |4      |
* Select value from table "Cancer Distribution Mutation Summary" by row and column
    |row   |column|
    |------|------|
    |1     |2     |
* Verify the table "Cancer Distribution Mutation Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |Myeloid Leukemias                      |
    |Not Applicable                         |
* Select value from table "Cancer Distribution Mutation Summary" by row and column
    |row   |column|
    |------|------|
    |1     |3     |
* Verify the table "Cancer Distribution Mutation Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |Hematopoietic and reticuloendothelial systems|
    |Unknown  |
* Select value from table "Cancer Distribution Mutation Summary" by row and column
    |row   |column|
    |------|------|
    |1     |3     |

## Cancer Distribution: JSON
* Download "JSON" from "Mutation Summary Cancer Distribution"
* Read from "JSON from Mutation Summary Cancer Distribution"
* Verify that "JSON from Mutation Summary Cancer Distribution" has expected information
    |required_info                          |
    |---------------------------------------|
    |TARGET-AML                             |
    |TARGET-ALL-P2                          |
    |Plasma Cell Tumors                     |
    |Complex Mixed and Stromal Neoplasms    |
    |Cystic, Mucinous and Serous Neoplasms  |
    |Other and ill-defined sites            |
    |Other and unspecified urinary organs   |
    |Lymphoid Leukemias                     |
    |Acute Lymphoblastic Leukemia           |
    |CPTAC-3                                |
    |1                                      |
    |1317                                   |
    |0.07593014426727411                    |

* Verify that "JSON from Mutation Summary Cancer Distribution" does not contain specified information
    |required_info                          |
    |---------------------------------------|
    |PIK3CA                                 |
    |num_affected_cases_percent             |
    |num_cnv_loss                           |
    |num_cnv_loss_percent                   |
    |mutations_counts                       |

## Cancer Distribution - Validate JSON File Fields
  |field_name                               |
  |-----------------------------------------|
  |project_id		                            |
  |disease_type                             |
  |site	                                    |
  |num_affected_cases                       |
  |num_affected_cases_total                 |
  |affected_cases_percent                   |
* Verify that the "JSON from Mutation Summary Cancer Distribution" has <field_name> for each object

## Cancer Distribution: TSV
* Download "TSV" from "Mutation Summary Cancer Distribution"
* Read from "TSV from Mutation Summary Cancer Distribution"
* Verify that "TSV from Mutation Summary Cancer Distribution" has expected information
    |required_info                          |
    |---------------------------------------|
    |Project                                |
    |Disease Type                           |
    |Primary Site                           |
    |# SSM Affected Cases                   |
    |CPTAC-3                                |
    |MMRF-COMMPASS                          |
    |Germ Cell Neoplasms                    |
    |Acute Lymphoblastic Leukemia,Lymphoid Leukemias|
    |Colon,Rectosigmoid junction            |
    |Breast,Colon,Other and unspecified female genital organs,Ovary,Rectum,Retroperitoneum and peritoneum|
    |64 / 1487 (4.30 %)                     |
    |4 / 22 (18.18 %)                       |
* Verify that "TSV from Mutation Summary Cancer Distribution" does not contain specified information
    |required_info                          |
    |---------------------------------------|
    |PIK3CA                                 |
    |# CNV Losses                           |
    |# Mutations Counts                     |
    |Mutations Counts                       |

## Cancer Distribution Mutations Graph: JSON
* Expand dropdown in graph "Cancer Distribution Mutations"
* Download "JSON" from "Graph Dropdown"
* Read from "JSON from Graph Dropdown"
* Verify that "JSON from Graph Dropdown" has expected information
    |required_info                          |
    |---------------------------------------|
    |TARGET-AML                             |
    |18.181818181818183                     |
    |CPTAC-3                                |
    |0.07593014426727411                    |
    |TCGA-TGCT                              |

## Save New Cohort: SSM Affected Cases
* Collect button labels in table for comparison
  |button_label                                                     |row  |column |
  |-----------------------------------------------------------------|-----|-------|
  |TARGET-AML: chr1:g.114716126C>T SSM Affected Cases in Cohort     |1    |4      |
* Select value from table by row and column
  |row   |column|
  |------|------|
  |1     |4     |
* Name the cohort "TARGET-AML: chr1:g.114716126C>T SSM Affected Cases in Cohort" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                                                      |Keep or Remove Modal|
  |-----------------|-------------------------------------------------------------------------------|--------------------|
  |Save             |TARGET-AML: chr1:g.114716126C>T SSM Affected Cases in Cohort has been saved    |Remove Modal        |

## Validate Cohorts
* Navigate to "Analysis" from "Header" "section"

* Switch cohort to "TARGET-AML: chr1:g.114716126C>T SSM Affected Cases in Cohort" from the Cohort Bar dropdown list
* "TARGET-AML: chr1:g.114716126C>T SSM Affected Cases in Cohort" should be the active cohort
* Collect Cohort Bar Case Count for comparison
* Verify "Cohort Bar Case Count" and "TARGET-AML: chr1:g.114716126C>T SSM Affected Cases in Cohort" are "Equal"
