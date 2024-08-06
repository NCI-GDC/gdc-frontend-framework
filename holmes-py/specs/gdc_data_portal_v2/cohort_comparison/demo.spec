# Cohort Comparison - Demo
Date Created    : 04/19/2024
Version			    : 1.0
Owner		        : GDC QA
Description		  : Cohort Comparison - Demo
Test-case       : PEAR-483

tags: gdc-data-portal-v2, regression, cohort-comparison

## Travel to Cohort Comparison Demo
* On GDC Data Portal V2 app
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Cohort Comparison Demo" from "Analysis" "app"

## Enable All Cards
* Select analysis cards to enable or disable on Cohort Comparison
  |analysis_card          |
  |-----------------------|
  |Ethnicity              |
  |Race                   |
* Verify analysis cards are visible or not visible as expected on Cohort Comparison
  |analysis_card          |should_be_visible_or_not_visible |
  |-----------------------|---------------------------------|
  |analysis-survival      |Visible                          |
  |Ethnicity              |Visible                          |
  |Gender                 |Visible                          |
  |Race                   |Visible                          |
  |Vital Status           |Visible                          |
  |Age At Diagnosis       |Visible                          |

## Save Cohorts from Analysis cards
* Collect case counts on save cohort buttons from an analysis card on Cohort Comparison
  |analysis_card          |Filter Row                       |Cohort Number  |Collect Case Count Name              |
  |-----------------------|---------------------------------|---------------|-------------------------------------|
  |Gender                 |female                           |2              |CC_Demo_Gender_Female_2 Count        |
  |Vital Status           |alive                            |1              |CC_Demo_Vital_Status_Alive_1 Count   |
  |analysis-survival      |overall survival analysis        |1              |CC_Demo_Overall_Survival_1 Count     |
* Save cohorts from an analysis card on Cohort Comparison
  |analysis_card          |Filter Row                       |Cohort Number  |Cohort Name                    |
  |-----------------------|---------------------------------|---------------|-------------------------------|
  |Gender                 |female                           |2              |CC_Demo_Gender_Female_2        |
  |Vital Status           |alive                            |1              |CC_Demo_Vital_Status_Alive_1   |
  |analysis-survival      |overall survival analysis        |1              |CC_Demo_Overall_Survival_1     |

* Switch cohort to "CC_Demo_Overall_Survival_1" from the Cohort Bar dropdown list
* Collect Cohort Bar Case Count for comparison
* Verify "Cohort Bar Case Count" and "CC_Demo_Overall_Survival_1 Count" are "Equal"

* Switch cohort to "CC_Demo_Gender_Female_2" from the Cohort Bar dropdown list
* Collect Cohort Bar Case Count for comparison
* Verify "Cohort Bar Case Count" and "CC_Demo_Gender_Female_2 Count" are "Equal"

* Switch cohort to "CC_Demo_Vital_Status_Alive_1" from the Cohort Bar dropdown list
* Collect Cohort Bar Case Count for comparison
* Verify "Cohort Bar Case Count" and "CC_Demo_Vital_Status_Alive_1 Count" are "Equal"

## Validate TSV Download Information - Ethnicity
* Collect case counts on save cohort buttons from an analysis card on Cohort Comparison
  |analysis_card          |Filter Row                       |Cohort Number  |Collect Case Count Name              |
  |-----------------------|---------------------------------|---------------|-------------------------------------|
  |Ethnicity              |not hispanic or latino           |1              |CC_Ethnicity_Not_Hispanic_1 Count    |
  |Ethnicity              |hispanic or latino               |1              |CC_Ethnicity_Hispanic_1 Count        |
  |Ethnicity              |not reported                     |1              |CC_Ethnicity_Not_Reported_1 Count    |
  |Ethnicity              |missing                          |1              |CC_Ethnicity_Missing_1 Count         |
  |Ethnicity              |not hispanic or latino           |2              |CC_Ethnicity_Not_Hispanic_2 Count    |
  |Ethnicity              |hispanic or latino               |2              |CC_Ethnicity_Hispanic_2 Count        |
  |Ethnicity              |not reported                     |2              |CC_Ethnicity_Not_Reported_2 Count    |
  |Ethnicity              |missing                          |2              |CC_Ethnicity_Missing_2 Count         |

* Download "Ethnicity" from "Cohort Comparison"
* Read from "Ethnicity from Cohort Comparison"
* Verify that "Ethnicity from Cohort Comparison" has expected information
  |required_info                          |
  |---------------------------------------|
  |Ethnicity                              |
  |not hispanic or latino                 |
  |hispanic or latino                     |
  |not reported                           |
  |missing                                |
  |# Cases S1                             |
  |% Cases S1                             |
  |# Cases S2                             |
  |% Cases S2                             |
* Verify that "Ethnicity from Cohort Comparison" has expected information from collected data
  |collected_data                         |
  |---------------------------------------|
  |CC_Ethnicity_Not_Hispanic_1 Count      |
  |CC_Ethnicity_Hispanic_1 Count          |
  |CC_Ethnicity_Not_Reported_1 Count      |
  |CC_Ethnicity_Missing_1 Count           |
  |CC_Ethnicity_Not_Hispanic_2 Count      |
  |CC_Ethnicity_Hispanic_2 Count          |
  |CC_Ethnicity_Not_Reported_2 Count      |
  |CC_Ethnicity_Missing_2 Count           |

## Verify Demo Text
* Is text "Demo showing cases with low grade gliomas with and without mutations in the genes IDH1 and IDH2." present on the page
* Is text "Cohort Comparison Demo" present on the page

## Verify Venn Diagram Link
* Select the link "Open Venn Diagram"
* Is text "Set Operations" present on the page
* Is text "Union of selected sets:" present on the page
* Is text "Low grade gliomas - IDH1 or IDH2 mutated" present on the page
* Is text "Low grade gliomas - IDH1 and IDH2 not mutated" present on the page
