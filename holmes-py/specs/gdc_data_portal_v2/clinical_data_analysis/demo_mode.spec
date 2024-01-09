# Clinical Data Analysis - Demo Mode
Date Created    : 06/02/2023
Version		    : 1.0
Owner		    : GDC QA
Description     : cDAVE Demo Mode
Test-Case       : PEAR-603

tags: gdc-data-portal-v2, clinical-data-analysis, regression, smoke-test

## Navigate to Clinical Data Analysis Demo
* On GDC Data Portal V2 app
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Clinical Data Analysis Demo" from "Analysis" "app"

## Test clinical data properties section
* Wait for "Overall Survival Plot" to be present on the page
* Expand clinical property sections
* Is text "Demo showing cases with low grade gliomas (TCGA-LGG project)." present on the page
* Is text "Not enough survival data" not present on the page
* Validate all expected analysis cards are present on the Clinical Data Analysis page
  |analysis_card        |
  |---------------------|
  |Gender               |
  |Race                 |
  |Ethnicity            |
  |Age At Diagnosis     |
  |Primary Diagnosis    |
* Select the following fields on the Clinical Data Analysis page
  |field_switch_selector                            |
  |-------------------------------------------------|
  |demographic.ethnicity                            |
  |demographic.year_of_birth                        |
  |diagnoses.age_at_diagnosis                       |
  |diagnoses.ajcc_clinical_stage                    |
  |diagnoses.treatments.days_to_treatment_start     |
  |exposures.alcohol_history                        |
* Validate all expected analysis cards are present on the Clinical Data Analysis page
  |analysis_card            |
  |-------------------------|
  |Gender                   |
  |Race                     |
  |Primary Diagnosis        |
  |Year Of Birth            |
  |AJCC Clinical Stage      |
  |Days To Treatment Start  |
  |Alcohol History          |
* Validate these analysis cards are not present on the Clinical Data Analysis page
  |analysis_card            |
  |-------------------------|
  |Ethnicity                |
  |Age At Diagnosis         |
