# Clinical Data Analysis - TSV Download
Date Created  : 12/09/2024
Version			  : 1.0
Owner		      : GDC QA
Description		: Download TSV in Different Analysis Cards

tags: gdc-data-portal-v2, clinical-data-analysis, regression

## Create Cohort for Test
* On GDC Data Portal V2 app
* Navigate to "Cohort" from "Header" "section"
* Create and save a cohort named "cDAVE_TSV" with these filters
  |tab_name               |facet_name           |selection                      |
  |-----------------------|---------------------|-------------------------------|
  |General                |Program              |OHSU                           |
  |General                |Program              |ORGANOID                       |
  |General                |Program              |BEATAML1.0                     |

## Navigate to Clinical Data Analysis
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Clinical Data Analysis" from "Analysis" "app"
* Wait for "Overall Survival Plot" to be present on the page

## Histogram TSV Download
* Download "Gender" from "CDAVE Analysis Card TSV"
* Collect analysis card table data for comparison on the Clinical Data Analysis page
  |button_label                         |analysis_card|row  |column |do_not_trim_content|
  |-------------------------------------|-------------|-----|-------|-------------------|
  |Gender_R1_C2                         |Gender       |1    |2      |True               |
  |Gender_R1_C3                         |Gender       |1    |3      |True               |
  |Gender_R2_C2                         |Gender       |2    |2      |True               |
  |Gender_R2_C3                         |Gender       |2    |3      |True               |
  |Gender_R3_C2                         |Gender       |3    |2      |True               |
  |Gender_R3_C3                         |Gender       |3    |3      |True               |
  |Gender_R4_C2                         |Gender       |4    |2      |True               |
  |Gender_R4_C3                         |Gender       |4    |3      |True               |
  |Gender_R5_C2                         |Gender       |5    |2      |True               |
  |Gender_R5_C3                         |Gender       |5    |3      |True               |
* Read from "Gender from CDAVE Analysis Card TSV"
* Verify that "Gender from CDAVE Analysis Card TSV" has expected information
  |required_info                          |
  |---------------------------------------|
  |Gender                                 |
  |# Cases                                |
* Verify that "Gender from CDAVE Analysis Card TSV" has exact expected information from collected data
  |collected_data                         |
  |---------------------------------------|
  |Gender_R1_C2                           |
  |Gender_R1_C3                           |
  |Gender_R2_C2                           |
  |Gender_R2_C3                           |
  |Gender_R3_C2                           |
  |Gender_R3_C3                           |
  |Gender_R4_C2                           |
  |Gender_R4_C3                           |
  |Gender_R5_C2                           |
  |Gender_R5_C3                           |


## Histogram Days TSV Download
* Switch analysis card "Age At Diagnosis" to unit "Days" on the Clinical Data Analysis page
* Download "Age At Diagnosis" from "CDAVE Analysis Card TSV"
* Collect analysis card table data for comparison on the Clinical Data Analysis page
  |button_label                         |analysis_card    |row  |column |do_not_trim_content|
  |-------------------------------------|-----------------|-----|-------|-------------------|
  |Age At Diagnosis_R1_C2               |Age At Diagnosis |1    |2      |True               |
  |Age At Diagnosis_R1_C3               |Age At Diagnosis |1    |3      |True               |
  |Age At Diagnosis_R2_C2               |Age At Diagnosis |2    |2      |True               |
  |Age At Diagnosis_R2_C3               |Age At Diagnosis |2    |3      |True               |
  |Age At Diagnosis_R3_C2               |Age At Diagnosis |3    |2      |True               |
  |Age At Diagnosis_R3_C3               |Age At Diagnosis |3    |3      |True               |
  |Age At Diagnosis_R4_C2               |Age At Diagnosis |4    |2      |True               |
  |Age At Diagnosis_R4_C3               |Age At Diagnosis |4    |3      |True               |
  |Age At Diagnosis_R5_C2               |Age At Diagnosis |5    |2      |True               |
  |Age At Diagnosis_R5_C3               |Age At Diagnosis |5    |3      |True               |
* Read from "Age At Diagnosis from CDAVE Analysis Card TSV"
* Verify that "Age At Diagnosis from CDAVE Analysis Card TSV" has expected information
  |required_info                          |
  |---------------------------------------|
  |Age At Diagnosis (Days)                |
  |# Cases                                |
* Verify that "Age At Diagnosis from CDAVE Analysis Card TSV" has exact expected information from collected data
  |collected_data                         |
  |---------------------------------------|
  |Age At Diagnosis_R1_C2                 |
  |Age At Diagnosis_R1_C3                 |
  |Age At Diagnosis_R2_C2                 |
  |Age At Diagnosis_R2_C3                 |
  |Age At Diagnosis_R3_C2                 |
  |Age At Diagnosis_R3_C3                 |
  |Age At Diagnosis_R4_C2                 |
  |Age At Diagnosis_R4_C3                 |
  |Age At Diagnosis_R5_C2                 |
  |Age At Diagnosis_R5_C3                 |

## Survival Plot TSV Download
* On the "Primary Diagnosis" card, select "Survival Plot" button on the Clinical Data Analysis page
* Is text "Use the Survival buttons" present on the page
* Download "Primary Diagnosis" from "CDAVE Analysis Card TSV"
* Collect analysis card table data for comparison on the Clinical Data Analysis page
  |button_label                         |analysis_card    |row  |column |do_not_trim_content|
  |-------------------------------------|-----------------|-----|-------|-------------------|
  |Primary Diagnosis_R1_C3              |Primary Diagnosis|1    |3      |True               |
  |Primary Diagnosis_R1_C4              |Primary Diagnosis|1    |4      |True               |
  |Primary Diagnosis_R2_C3              |Primary Diagnosis|2    |3      |True               |
  |Primary Diagnosis_R2_C4              |Primary Diagnosis|2    |4      |True               |
  |Primary Diagnosis_R3_C3              |Primary Diagnosis|3    |3      |True               |
  |Primary Diagnosis_R3_C4              |Primary Diagnosis|3    |4      |True               |
  |Primary Diagnosis_R4_C3              |Primary Diagnosis|4    |3      |True               |
  |Primary Diagnosis_R4_C4              |Primary Diagnosis|4    |4      |True               |
  |Primary Diagnosis_R5_C3              |Primary Diagnosis|5    |3      |True               |
  |Primary Diagnosis_R5_C4              |Primary Diagnosis|5    |4      |True               |
  |Primary Diagnosis_R22_C3             |Primary Diagnosis|22   |3      |True               |
  |Primary Diagnosis_R22_C4             |Primary Diagnosis|22   |4      |True               |
* Read from "Primary Diagnosis from CDAVE Analysis Card TSV"
* Verify that "Primary Diagnosis from CDAVE Analysis Card TSV" has expected information
  |required_info                          |
  |---------------------------------------|
  |Primary Diagnosis                      |
  |# Cases                                |
* Verify that "Primary Diagnosis from CDAVE Analysis Card TSV" has exact expected information from collected data
  |collected_data                         |
  |---------------------------------------|
  |Primary Diagnosis_R1_C3                |
  |Primary Diagnosis_R1_C4                |
  |Primary Diagnosis_R2_C3                |
  |Primary Diagnosis_R2_C4                |
  |Primary Diagnosis_R3_C3                |
  |Primary Diagnosis_R3_C4                |
  |Primary Diagnosis_R4_C3                |
  |Primary Diagnosis_R4_C4                |
  |Primary Diagnosis_R5_C3                |
  |Primary Diagnosis_R5_C4                |
  |Primary Diagnosis_R22_C3               |
  |Primary Diagnosis_R22_C4               |

## Box/QQ Plot TSV Download
* On the "Age At Diagnosis" card, select "Box QQ Plot" button on the Clinical Data Analysis page
* Switch analysis card "Age At Diagnosis" to unit "Years" on the Clinical Data Analysis page
* Download "Age At Diagnosis" from "CDAVE Analysis Card TSV"
* Collect analysis card table data for comparison on the Clinical Data Analysis page
  |button_label                         |analysis_card    |row  |column |do_not_trim_content|
  |-------------------------------------|-----------------|-----|-------|-------------------|
  |Age At Diagnosis_R1_C1               |Age At Diagnosis |1    |1      |True               |
  |Age At Diagnosis_R1_C2               |Age At Diagnosis |1    |2      |True               |
  |Age At Diagnosis_R2_C1               |Age At Diagnosis |2    |1      |True               |
  |Age At Diagnosis_R2_C2               |Age At Diagnosis |2    |2      |True               |
  |Age At Diagnosis_R3_C1               |Age At Diagnosis |3    |1      |True               |
  |Age At Diagnosis_R3_C2               |Age At Diagnosis |3    |2      |True               |
  |Age At Diagnosis_R4_C1               |Age At Diagnosis |4    |1      |True               |
  |Age At Diagnosis_R4_C2               |Age At Diagnosis |4    |2      |True               |
  |Age At Diagnosis_R5_C1               |Age At Diagnosis |5    |1      |True               |
  |Age At Diagnosis_R5_C2               |Age At Diagnosis |5    |2      |True               |
* Read from "Age At Diagnosis from CDAVE Analysis Card TSV"
* Verify that "Age At Diagnosis from CDAVE Analysis Card TSV" has expected information
  |required_info                          |
  |---------------------------------------|
  |Statistics                             |
  |Years                                  |
* Verify that "Age At Diagnosis from CDAVE Analysis Card TSV" has exact expected information from collected data
  |collected_data                         |
  |---------------------------------------|
  |Age At Diagnosis_R1_C1                 |
  |Age At Diagnosis_R1_C2                 |
  |Age At Diagnosis_R2_C1                 |
  |Age At Diagnosis_R2_C2                 |
  |Age At Diagnosis_R3_C1                 |
  |Age At Diagnosis_R3_C2                 |
  |Age At Diagnosis_R4_C1                 |
  |Age At Diagnosis_R4_C2                 |
  |Age At Diagnosis_R5_C1                 |
  |Age At Diagnosis_R5_C2                 |
