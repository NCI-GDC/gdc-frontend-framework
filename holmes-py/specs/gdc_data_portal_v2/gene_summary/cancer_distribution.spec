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

* Verify the table "Cancer Distribution Gene Summary" body text is correct
    |expected_text                          |row  |column |
    |---------------------------------------|-----|-------|
    |TCGA-UCEC                              |1    |1      |

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
  |project_id		                        |
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
