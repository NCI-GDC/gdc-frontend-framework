# Cohort Builder - Other Clinical Attributes
Date Created        : 06/06/2025
Version			    : 1.0
Owner		        : GDC QA
Description		    : Other Clinical Attributes in Cohort Builder
Test-case           :

tags: gdc-data-portal-v2, regression, cohort-builder

## Navigate to Cohort Builder
* On GDC Data Portal V2 app
* Navigate to "Cohort" from "Header" "section"

## BMI, Height, Weight
* Select "Add" from the Cohort Bar
* Search in a filter card from "Other Clinical Attributes" tab on the Cohort Builder page
  |facet_name       |label                |text  |
  |-----------------|---------------------|------|
  |Bmi              |input from value     |10    |
  |Bmi              |input to value       |35    |
  |Weight           |input from value     |70    |
  |Weight           |input to value       |120   |
  |Height           |input from value     |150   |
  |Height           |input to value       |240   |
* Select the following labels from "Other Clinical Attributes" tab on the Cohort Builder page
  |facet_name       |selection            |
  |-----------------|---------------------|
  |Bmi              |Apply                |
  |Weight           |Apply                |
  |Height           |Apply                |
* Select "Save" from the Cohort Bar
* Name the cohort "OCA_BMI_Height_Weight" in the Cohort Bar section
* Perform action and validate modal text
    |Action to Perform|Text to validate in modal                  |Keep or Remove Modal|
    |-----------------|-------------------------------------------|--------------------|
    |Save             |Cohort has been saved                      |Remove Modal        |
* Validate the cohort query filter area has these filters
    |facet_name         |selections           |position in filter area  |
    |-------------------|---------------------|-------------------------|
    |Bmi                |>=10and<35           |1                        |
    |Weight             |>=70and<120          |2                        |
    |Height             |>=150and<240         |3                        |

## Menopause Status, Pregnancy Outcome, Number of Pregnancies
* Create and save a cohort named "OCA_Menopause_Pregnancy_Number" with these filters
  |tab_name                 |facet_name           |selection                      |
  |-------------------------|---------------------|-------------------------------|
  |Other Clinical Attributes|Menopause Status     |postmenopausal                 |
* Collect Cohort Bar Case Count for comparison
* Collect case counts for the following filters on the Cohort Builder page for cohort "OCA_Menopause_Pregnancy_Number"
  |tab_name               |facet_name                   |selection            |
  |-----------------------|-----------------------------|---------------------|
  |Other Clinical Attributes|Menopause Status           |postmenopausal       |
* Verify "Menopause Status_postmenopausal_OCA_Menopause_Pregnancy_Number Count" and "Cohort Bar Case Count" are "Equal"

* Make the following selections from "Other Clinical Attributes" tab on the Cohort Builder page
  |facet_name       |selection            |
  |-----------------|---------------------|
  |Pregnancy Outcome|full term birth, nos |
* Collect Cohort Bar Case Count for comparison
* Collect case counts for the following filters on the Cohort Builder page for cohort "OCA_Menopause_Pregnancy_Number"
  |tab_name                 |facet_name                  |selection            |
  |-------------------------|---------------------------|---------------------|
  |Other Clinical Attributes|Pregnancy Outcome          |full term birth, nos |
* Verify "Pregnancy Outcome_full term birth, nos_OCA_Menopause_Pregnancy_Number Count" and "Cohort Bar Case Count" are "Equal"

* Make the following selections from "Other Clinical Attributes" tab on the Cohort Builder page
  |facet_name           |selection            |
  |---------------------|---------------------|
  |Number of Pregnancies|1                    |
* Collect Cohort Bar Case Count for comparison
* Collect case counts for the following filters on the Cohort Builder page for cohort "OCA_Menopause_Pregnancy_Number"
  |tab_name                 |facet_name                  |selection            |
  |-------------------------|---------------------------|---------------------|
  |Other Clinical Attributes|Number of Pregnancies      |1                    |
* Verify "Number of Pregnancies_1_OCA_Menopause_Pregnancy_Number Count" and "Cohort Bar Case Count" are "Equal"
* Select "Save" from the Cohort Bar
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                  |Keep or Remove Modal|
  |-----------------|-------------------------------------------|--------------------|
  |Save             |Cohort has been saved                      |Remove Modal        |

* Validate the cohort query filter area has these filters
    |facet_name         |selections           |position in filter area  |
    |-------------------|---------------------|-------------------------|
    |Menopause Status   |postmenopausal       |1                        |
    |Pregnancy Outcome  |full term birth, nos |2                        |
    |Number of Pregnancies|1                  |3                        |

## Risk Factors, Comorbidities
* Create and save a cohort named "OCA_Risk Factors_Comorbidities" with these filters
  |tab_name                 |facet_name           |selection                      |
  |-------------------------|---------------------|-------------------------------|
  |Other Clinical Attributes|Risk Factors         |allergy, cat                   |
* Collect Cohort Bar Case Count for comparison
* Collect case counts for the following filters on the Cohort Builder page for cohort "OCA_Risk Factors_Comorbidities"
  |tab_name                 |facet_name                   |selection            |
  |-------------------------|-----------------------------|---------------------|
  |Other Clinical Attributes|Risk Factors                 |allergy, cat         |
* Verify "Risk Factors_allergy, cat_OCA_Risk Factors_Comorbidities Count" and "Cohort Bar Case Count" are "Equal"

* Make the following selections from "Other Clinical Attributes" tab on the Cohort Builder page
  |facet_name       |selection            |
  |-----------------|---------------------|
  |Comorbidities    |allergies            |
* Collect Cohort Bar Case Count for comparison
* Collect case counts for the following filters on the Cohort Builder page for cohort "OCA_Risk Factors_Comorbidities"
  |tab_name                 |facet_name                 |selection            |
  |-------------------------|---------------------------|---------------------|
  |Other Clinical Attributes|Comorbidities              |allergies            |
* Verify "Comorbidities_allergies_OCA_Risk Factors_Comorbidities Count" and "Cohort Bar Case Count" are "Equal"

* Select "Save" from the Cohort Bar
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                  |Keep or Remove Modal|
  |-----------------|-------------------------------------------|--------------------|
  |Save             |Cohort has been saved                      |Remove Modal        |

* Validate the cohort query filter area has these filters
    |facet_name         |selections           |position in filter area  |
    |-------------------|---------------------|-------------------------|
    |Risk Factors       |allergy, cat         |1                        |
    |Comorbidities      |allergies            |2                        |
