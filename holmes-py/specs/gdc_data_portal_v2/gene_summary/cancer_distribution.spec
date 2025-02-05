# Gene Summary - Cancer Distribution
Date Created    : 12/16/2024
Version			: 1.0
Owner		    : GDC QA
Description		: Validate Cancer Distribution Area
Test-Case       : PEAR-2286

tags: gdc-data-portal-v2, regression, gene-summary

## Navigate to Gene Summary Page: RBM15
* On GDC Data Portal V2 app
* Quick search for "RBM15" and go to its page

## Validate Table: Cancer Distribution
* Wait for table "Cancer Distribution Gene Summary" body text to appear
    |expected_text                                        |row  |column |
    |-----------------------------------------------------|-----|-------|
    |TCGA-UCEC                                            |1    |1      |
* Verify the table "Cancer Distribution Gene Summary" header text is correct
    |expected_text                          |column |
    |---------------------------------------|-------|
    |Project                                |1      |
    |Disease Type                           |2      |
    |Primary Site                           |3      |
    |# SSM Affected Cases                   |4      |
    |# CNV Gains                            |5      |
    |# CNV Losses                           |6      |
    |# Mutations                            |7      |
* Select value from table "Cancer Distribution Gene Summary" by row and column
    |row   |column|
    |------|------|
    |1     |2     |
* Verify the table "Cancer Distribution Gene Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |Adenomas and Adenocarcinomas           |
    |Cystic, Mucinous and Serous Neoplasms  |
    |Epithelial Neoplasms, NOS              |
    |Not Reported                           |
* Select value from table "Cancer Distribution Gene Summary" by row and column
    |row   |column|
    |------|------|
    |1     |3     |
* Verify the table "Cancer Distribution Gene Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |Corpus uteri                           |
    |Uterus, NOS                            |
* Select value from table "Cancer Distribution Gene Summary" by row and column
    |row   |column|
    |------|------|
    |1     |3     |

## Cancer Distribution: JSON
* Download "JSON" from "Gene Summary Cancer Distribution"
* Read from "JSON from Gene Summary Cancer Distribution"
* Verify that "JSON from Gene Summary Cancer Distribution" has expected information
    |required_info                          |
    |---------------------------------------|
    |TCGA-UCEC                              |
    |TCGA-PAAD                              |
    |Adnexal and Skin Appendage Neoplasms   |
    |Fibroepithelial Neoplasms              |
    |Brain                                  |
    |Hematopoietic and reticuloendothelial systems|
    |Lymphoid Leukemias                     |
    |Acute Lymphoblastic Leukemia           |
    |TCGA-LGG                               |
* Verify that "JSON from Gene Summary Cancer Distribution" does not contain specified information
    |required_info                          |
    |---------------------------------------|
    |PIK3CA                                 |
    |CSMD3                                  |
    |FAT4                                   |
    |MUC16                                  |
    |LRP1B                                  |
    |KMT2D                                  |
    |KRAS                                   |
    |PTEN                                   |
    |TP53                                   |
    |FAT3                                   |

## Cancer Distribution - Validate JSON File Fields
  |field_name                               |
  |-----------------------------------------|
  |project_id		                            |
  |disease_type                             |
  |site	                                    |
  |num_affected_cases                       |
  |num_affected_cases_total                 |
  |num_affected_cases_percent               |
  |num_cnv_gain                             |
  |num_cnv_gain_percent                     |
  |num_cnv_loss                             |
  |num_cnv_loss_percent                     |
  |num_cnv_cases_total                      |
  |mutations_counts                         |
* Verify that the "JSON from Gene Summary Cancer Distribution" has <field_name> for each object

## Cancer Distribution: TSV
* Download "TSV" from "Gene Summary Cancer Distribution"
* Read from "TSV from Gene Summary Cancer Distribution"
* Verify that "TSV from Gene Summary Cancer Distribution" has expected information
    |required_info                          |
    |---------------------------------------|
    |Project                                |
    |Disease Type                           |
    |Primary Site                           |
    |# SSM Affected Cases                   |
    |# CNV Gains                            |
    |# CNV Losses                           |
    |# Mutations                            |
    |TCGA-UCEC                              |
    |Plasma Cell Tumors                     |
    |Colon,Rectosigmoid junction            |
    |31 / 512 (6.05 %)                      |
    |MP2PRT-ALL                             |
    |TCGA-LGG                               |
    |CPTAC-3                                |
* Verify that "TSV from Gene Summary Cancer Distribution" does not contain specified information
    |required_info                          |
    |---------------------------------------|
    |PIK3CA                                 |
    |CSMD3                                  |
    |FAT4                                   |
    |MUC16                                  |
    |LRP1B                                  |
    |KMT2D                                  |
    |KRAS                                   |
    |PTEN                                   |
    |TP53                                   |
    |FAT3                                   |

## Cancer Distribution Mutations Graph: JSON
* Expand dropdown in graph "Cancer Distribution Mutations"
* Download "JSON" from "Graph Dropdown"
* Read from "JSON from Graph Dropdown"
* Verify that "JSON from Graph Dropdown" has expected information
    |required_info                          |
    |---------------------------------------|
    |TCGA-UCEC                              |
    |6.0546875                              |
    |CDDP_EAGLE-1                           |
    |TCGA-ACC                               |

## Cancer Distribution CNV Graph: JSON
* Expand dropdown in graph "Cancer Distribution CNV"
* Download "JSON" from "Graph Dropdown"
* Read from "JSON from Graph Dropdown"
* Verify that "JSON from Graph Dropdown" has expected information
    |required_info                          |
    |---------------------------------------|
    |TARGET-OS                              |
    |TCGA-PCPG                              |
    |TCGA-KICH                              |
    |CDDP_EAGLE-1                           |
    |TCGA-MESO                              |

## Cancer Distribution CNV Graph - Validate JSON File Fields
  |field_name                               |
  |-----------------------------------------|
  |symbol			                              |
  |gain                                     |
  |loss	                                    |
  |total                                    |
* Verify that the "JSON from Graph Dropdown" has <field_name> for each object

## Save New Cohort: SSM Affected Cases
* Collect button labels in table for comparison
  |button_label                                     |row  |column |
  |-------------------------------------------------|-----|-------|
  |TCGA-UCEC: RBM15 SSM Affected Cases in Cohort    |1    |4      |
* Select value from table by row and column
  |row   |column|
  |------|------|
  |1     |4     |
* Name the cohort "TCGA-UCEC: RBM15 SSM Affected Cases in Cohort" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                                      |Keep or Remove Modal|
  |-----------------|---------------------------------------------------------------|--------------------|
  |Save             |TCGA-UCEC: RBM15 SSM Affected Cases in Cohort has been saved   |Remove Modal        |

## Save New Cohort: CNV Gain
* Collect button labels in table for comparison
  |button_label                         |row  |column |
  |-------------------------------------|-----|-------|
  |TCGA-COAD: RBM15 CNV Gain            |2    |5      |
* Select value from table by row and column
  |row   |column|
  |------|------|
  |2     |5     |
* Name the cohort "TCGA-COAD: RBM15 CNV Gain" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                            |Keep or Remove Modal|
  |-----------------|-----------------------------------------------------|--------------------|
  |Save             |TCGA-COAD: RBM15 CNV Gain has been saved             |Remove Modal        |

## Save New Cohort: CNV Loss
* Collect button labels in table for comparison
  |button_label                         |row  |column |
  |-------------------------------------|-----|-------|
  |TCGA-READ: RBM15 CNV Loss            |3    |6      |
* Select value from table by row and column
  |row   |column|
  |------|------|
  |3     |6     |
* Name the cohort "TCGA-READ: RBM15 CNV Loss" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                            |Keep or Remove Modal|
  |-----------------|-----------------------------------------------------|--------------------|
  |Save             |TCGA-READ: RBM15 CNV Loss has been saved             |Remove Modal        |

## Validate Cohorts
* Navigate to "Analysis" from "Header" "section"

* Switch cohort to "TCGA-UCEC: RBM15 SSM Affected Cases in Cohort" from the Cohort Bar dropdown list
* "TCGA-UCEC: RBM15 SSM Affected Cases in Cohort" should be the active cohort
* Collect Cohort Bar Case Count for comparison
* Verify "Cohort Bar Case Count" and "TCGA-UCEC: RBM15 SSM Affected Cases in Cohort" are "Equal"

* Switch cohort to "TCGA-COAD: RBM15 CNV Gain" from the Cohort Bar dropdown list
* "TCGA-COAD: RBM15 CNV Gain" should be the active cohort
* Collect Cohort Bar Case Count for comparison
* Verify "Cohort Bar Case Count" and "TCGA-COAD: RBM15 CNV Gain" are "Equal"

* Switch cohort to "TCGA-READ: RBM15 CNV Loss" from the Cohort Bar dropdown list
* "TCGA-READ: RBM15 CNV Loss" should be the active cohort
* Collect Cohort Bar Case Count for comparison
* Verify "Cohort Bar Case Count" and "TCGA-READ: RBM15 CNV Loss" are "Equal"
