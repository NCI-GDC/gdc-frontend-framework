# Cohort Bar - Query Expression Expand/Collapse
Date Created    : 11/15/2024
Version			: 1.0
Owner		    : GDC QA
Description		: Cohort Query Expression Area Expand/Collapse Rows and Filters
Test-case       : PEAR-2270

tags: gdc-data-portal-v2, regression, cohort-bar


## Navigate to Cohort Builder
* On GDC Data Portal V2 app
* Navigate to "Cohort" from "Header" "section"

## Verify Rows and Filters Button are Initially Disabled
* Verify the button "Expand Collapse Cohort Queries" is disabled
* Verify the button "Expand Collapse Cohort Filters Section" is disabled
* Verify the button "Expand Collapse Cohort Queries" area is "Collapsed"
* Verify the button "Expand Collapse Cohort Filters Section" area is "Collapsed"

## Save Cohort for Query Expression Check
* Create and save a cohort named "CQE_Expand_Collapse" with these filters
  |tab_name               |facet_name           |selection                      |
  |-----------------------|---------------------|-------------------------------|
  |Demographic            |Gender               |female                         |
  |Demographic            |Gender               |male                           |
  |Demographic            |Gender               |not reported                   |
  |Demographic            |Gender               |unknown                        |
  |Demographic            |Gender               |unspecified                    |
  |Demographic            |Race                 |not reported                   |
  |Demographic            |Race                 |white                          |
  |Demographic            |Race                 |black or african american      |
  |Demographic            |Race                 |asian                          |
  |Demographic            |Ethnicity            |not reported                   |
  |Demographic            |Ethnicity            |not hispanic or latino         |
  |Demographic            |Ethnicity            |hispanic or latino             |
  |Demographic            |Vital Status         |not reported                   |
  |Demographic            |Vital Status         |alive                          |
  |Demographic            |Vital Status         |dead                           |
  |Demographic            |Vital Status         |unknown                        |
  |General                |Project              |FM-AD                          |
  |General                |Project              |TARGET-AML                     |
  |General                |Project              |TARGET-ALL-P2                  |
  |General                |Project              |MP2PRT-ALL                     |
  |General                |Project              |CPTAC-3                        |
  |General                |Project              |TCGA-BRCA                      |
  |General                |Project              |MMRF-COMMPASS                  |
  |General                |Project              |TARGET-NBL                     |
  |General                |Project              |TARGET-WT                      |
  |General                |Project              |TCGA-OV                        |
  |General                |Project              |TCGA-KIRC                      |
  |General                |Program              |FM                             |
  |General                |Program              |TARGET                         |
  |General                |Program              |TCGA                           |
  |General                |Program              |MP2PRT                         |
  |General                |Program              |CPTAC                          |
  |General                |Program              |MMRF                           |
  |General                |Primary Diagnosis    |adenocarcinoma, nos            |
  |General                |Primary Diagnosis    |carcinoma, nos                 |
  |General                |Primary Diagnosis    |infiltrating duct carcinoma, nos|
  |General                |Primary Diagnosis    |acute myeloid leukemia, nos    |
  |General                |Primary Diagnosis    |squamous cell carcinoma, nos   |
  |General                |Primary Diagnosis    |glioblastoma                   |
  |General                |Primary Diagnosis    |common precursor b all         |
  |General                |Primary Diagnosis    |multiple myeloma               |
  |General                |Primary Diagnosis    |acute lymphocytic leukemia     |
  |General                |Primary Diagnosis    |neuroblastoma, nos             |
  |General                |Primary Diagnosis    |serous carcinoma, nos          |
  |General                |Primary Diagnosis    |wilms tumor                    |
  |General                |Primary Diagnosis    |non-small cell carcinoma       |
  |General                |Primary Diagnosis    |serous cystadenocarcinoma, nos |
  |General                |Primary Diagnosis    |melanoma, nos                  |
  |General                |Primary Diagnosis    |precursor b-cell lymphoblastic leukemia|
  |General                |Disease Type         |adenomas and adenocarcinomas   |
* Verify the button "Expand Collapse Cohort Queries" is enabled
* Verify the button "Expand Collapse Cohort Filters Section" is enabled
* Verify the button "Expand Collapse Cohort Queries" area is "Expanded"
* Verify the button "Expand Collapse Cohort Filters Section" area is "Collapsed"

## Collapse All Values
* Select button "Expand Collapse Cohort Queries"
* Validate the cohort query filter area has these filters
  |facet_name         |selections           |position in filter area |
  |-------------------|---------------------|------------------------|
  |Gender             |5                    |1                       |
  |Race               |4                    |2                       |
  |Ethnicity          |3                    |3                       |
  |Vital Status       |4                    |4                       |
  |Project            |11                   |5                       |
  |Program            |6                    |6                       |
  |Primary Diagnosis  |16                   |7                       |
  |Disease Type       |1                    |8                       |
* Verify the button "Expand Collapse Cohort Filters Section" is disabled
* Verify the button "Expand Collapse Cohort Queries" area is "Collapsed"
* Verify the button "Expand Collapse Cohort Filters Section" area is "Collapsed"

## Expand All Values
* Select button "Expand Collapse Cohort Queries"
* Validate the cohort query filter area has these filters
  |facet_name         |selections                  |position in filter area  |
  |-------------------|----------------------------|-------------------------|
  |Disease Type       |adenomas and adenocarcinomas|8                        |
* Verify the button "Expand Collapse Cohort Filters Section" is enabled
* Verify the button "Expand Collapse Cohort Queries" area is "Expanded"
* Verify the button "Expand Collapse Cohort Filters Section" area is "Collapsed"

## Expand Rows
* Select button "Expand Collapse Cohort Filters Section"
* Verify the button "Expand Collapse Cohort Queries" area is "Expanded"
* Verify the button "Expand Collapse Cohort Filters Section" area is "Expanded"
