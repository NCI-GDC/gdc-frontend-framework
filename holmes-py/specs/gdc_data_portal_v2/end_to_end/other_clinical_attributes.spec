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
