# End to End - Other Clinical Attributes
Date Created        : 09/24/2024
Version			    : 1.0
Owner		        : GDC QA
Description		    : Other Clinical Attributes
Test-case           :

tags: gdc-data-portal-v2, end-to-end, regression

## Navigate to Cohort Builder=
* On GDC Data Portal V2 app
* Navigate to "Cohort" from "Header" "section"

## Add Other Clinical Attribute Filters
* Add a custom filter from "Custom Filters" tab on the Cohort Builder page
    |filter_name                                                |
    |-----------------------------------------------------------|
    |follow_ups.other_clinical_attributes.risk_factors          |
    |follow_ups.other_clinical_attributes.days_to_comorbidity   |
    |follow_ups.other_clinical_attributes.bmi                   |

## Save Cohort - Risk Factors and Days to Comorbidity
* Select "Add" from the Cohort Bar
* Close the message
* Search in a filter card from "Custom Filters" tab on the Cohort Builder page
    |facet_name                                     |label                |text  |
    |---------------------------------------------- |---------------------|------|
    |Other Clinical Attributes Days to Comorbidity  |input from value     |-20   |
    |Other Clinical Attributes Days to Comorbidity  |input to value       |10    |
* Select the following labels from "Custom Filters" tab on the Cohort Builder page
    |facet_name                                     |selection            |
    |-----------------------------------------------|---------------------|
    |Other Clinical Attributes Days to Comorbidity  |Apply                |
* Make the following selections from "Custom Filters" tab on the Cohort Builder page
    |facet_name                            |selection                      |
    |---------------------------------------|-------------------------------|
    |Other Clinical Attributes Risk Factors|colon polyps                   |
* Select "Save" from the Cohort Bar
* Name the cohort "OCA_Days_Comorbidity_Risk_Factor" in the Cohort Bar section
* Perform action and validate modal text
    |Action to Perform|Text to validate in modal                  |Keep or Remove Modal|
    |-----------------|-------------------------------------------|--------------------|
    |Save             |Cohort has been saved                      |Remove Modal        |
* Validate the cohort query filter area has these filters
    |facet_name         |selections           |position in filter area  |
    |-------------------|---------------------|-------------------------|
    |Days to Comorbidity|>=-7305and<3653      |1                        |
    |Risk Factors       |colon polyps         |2                        |
* Collect "OCA_Days_Comorbidity_Risk_Factor" Case Count for comparison

## Save Cohort - Bmi
* Select "Add" from the Cohort Bar
* Close the message
* Search in a filter card from "Custom Filters" tab on the Cohort Builder page
    |facet_name                                     |label                |text  |
    |-----------------------------------------------|---------------------|------|
    |Other Clinical Attributes Bmi                  |input from value     |18    |
    |Other Clinical Attributes Bmi                  |input to value       |32    |
* Select the following labels from "Custom Filters" tab on the Cohort Builder page
    |facet_name                                     |selection            |
    |-----------------------------------------------|---------------------|
    |Other Clinical Attributes Bmi                  |Apply                |
* Validate the cohort query filter area has these filters
    |facet_name         |selections           |position in filter area  |
    |-------------------|---------------------|-------------------------|
    |Bmi                |>=18and<32           |1                        |
* Select "Save" from the Cohort Bar
* Name the cohort "OCA_Bmi" in the Cohort Bar section
* Perform action and validate modal text
    |Action to Perform|Text to validate in modal                  |Keep or Remove Modal|
    |-----------------|-------------------------------------------|--------------------|
    |Save             |Cohort has been saved                      |Remove Modal        |
* Collect "OCA_Bmi" Case Count for comparison

## Run Cohort Comparison Analysis
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Cohort Comparison" from "Analysis" "app"
* Change number of entries shown in the table to "100"
* Is text "Select a cohort to compare with OCA_Bmi" present on the page
* Select cohort "OCA_Days_Comorbidity_Risk_Factor" for comparison on the cohort comparison selection screen
* Run analysis on Cohort Comparison

## Validate Cohort Case Counts
* Collect case count of cohorts s1 and s2 on the cohort comparison main screen
* Verify "OCA_Bmi Case Count" and "Cohort Comparison s1" are "equal"
* Verify "OCA_Days_Comorbidity_Risk_Factor Case Count" and "Cohort Comparison s2" are "equal"

## Save Cohort from Overall Survival Card
* Collect case counts on save cohort buttons from an analysis card on Cohort Comparison
  |analysis_card          |Filter Row                       |Cohort Number  |Collect Case Count Name              |
  |-----------------------|---------------------------------|---------------|-------------------------------------|
  |analysis-survival      |overall survival analysis        |1              |OCA_Overall_Survival_1 Count         |
* Save cohorts from an analysis card on Cohort Comparison
  |analysis_card          |Filter Row                       |Cohort Number  |Cohort Name                    |
  |-----------------------|---------------------------------|---------------|-------------------------------|
  |analysis-survival      |overall survival analysis        |1              |OCA_Overall_Survival_1         |

## Venn Diagram Link and Set Operationsa
* Select the link "Open Venn Diagram"
* Is text "Set Operations" present on the page
* Is text "Union of selected sets:" present on the page

## Cohorts Union Row - 2 Sets
* Select the following checkboxes in the Set Operations analysis screen
  |checkbox_name                |
  |-----------------------------|
  |S1 minus S2                  |
  |S2 minus S1                  |
* Download "File" from "Set Operations Union Row"
* Read from "File from Set Operations Union Row"
* Verify that "File from Set Operations Union Row" has expected information
  |required_info                        |
  |-------------------------------------|
  |08ecccb7-db6b-435a-a64b-86be8be343ef |
  |79ea2d3a-7ab5-4312-a09d-ff7571057e64 |
  |d0c3439b-2aae-4893-96c5-c925d2d8de6f |
  |fda02a1d-38f1-4e71-91f9-c58f174605d6 |
  |ffef8d1d-f99d-4cc0-9f49-46488bfca131 |
* Verify that "File from Set Operations Union Row" does not contain specified information
  |required_info                        |
  |-------------------------------------|
  |23443700-fe39-4fd5-862f-ffb02cda3947 |
  |8b3b1f24-419e-4043-82be-2bd41268bb0e |
  |fdfd5770-4b64-4d35-b472-9c7908210b22 |
* Select Union Row to save as a new set in the Set Operations analysis screen
* Name the cohort "S1 S2 Symmetric Difference Set Operations" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                               |Keep or Remove Modal|
  |-----------------|--------------------------------------------------------|--------------------|
  |Save             |S1 S2 Symmetric Difference Set Operations has been saved|Remove Modal        |

## Validate Created Cohorts
* Collect union row save set item count as "S1 S2 Symmetric Difference" on the Set Operations analysis screen
* Navigate to "Analysis" from "Header" "section"
* Switch cohort to "S1 S2 Symmetric Difference Set Operations" from the Cohort Bar dropdown list
* Collect Cohort Bar Case Count for comparison
* Verify "S1 S2 Symmetric Difference Count Set Operations" and "Cohort Bar Case Count" are "Equal"
* Switch cohort to "OCA_Overall_Survival_1" from the Cohort Bar dropdown list
* Collect Cohort Bar Case Count for comparison
* Verify "OCA_Overall_Survival_1 Count" and "Cohort Bar Case Count" are "Equal"

## Validate Other Clinical Attribute File Summary Page
* Quick search for "25bf249e-5c0f-4d3c-b76b-8eac678b0d9b" and go to its page
* Verify the table "File Properties File Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |25bf249e-5c0f-4d3c-b76b-8eac678b0d9b   |
* Verify the table "Data Information File Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |Transcriptome Profiling                |
* Download "File" from "File Summary"
* Read metadata from compressed "File from File Summary"
* Verify that "File from File Summary" has expected information
    |required_info                          |
    |---------------------------------------|
    |25bf249e-5c0f-4d3c-b76b-8eac678b0d9b   |
    |8113ab0c7f0d201dab0f5c9a90e25f5a       |
    |50557                                   |
* Read file content from compressed "File from File Summary"
* Verify that "File from File Summary" has expected information
    |required_info                          |
    |---------------------------------------|
    |hsa-let-7a-2                           |
    |236021                                 |
    |27328.588000                           |
    |miRNA_ID                               |
    |read_count                             |
    |reads_per_million_miRNA_mapped         |
    |cross-mapped                           |
