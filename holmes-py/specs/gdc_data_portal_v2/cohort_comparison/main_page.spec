# Cohort Comparison - Main Page
Date Created    : 03/1/2024
Version			    : 1.0
Owner		        : GDC QA
Description		  : Cohort Comparison - Main Page
Test-case       : PEAR-817

tags: gdc-data-portal-v2, regression, cohort-comparison

## Navigate to Cohort Builder
* On GDC Data Portal V2 app
* Navigate to "Cohort" from "Header" "section"

## Create Cohorts for Comparison
* Create and save a cohort named "CC_Compare_1" with these filters
  |tab_name               |facet_name           |selection                      |
  |-----------------------|---------------------|-------------------------------|
  |Biospecimen            |Composition          |solid tissue                   |
  |Biospecimen            |Composition          |peripheral whole blood         |
  |Biospecimen            |Composition          |whole bone marrow              |
  |Biospecimen            |Composition          |peripheral blood components nos|
* Create and save a cohort named "CC_Compare_2" with these filters
  |tab_name               |facet_name           |selection            |
  |-----------------------|---------------------|---------------------|
  |Available Data         |Platform             |illumina             |
  |Available Data         |Access               |open                 |
  |Available Data         |Access               |controlled           |
* Collect "CC_Compare_2" Case Count for comparison
* Switch cohort to "CC_Compare_1" from the Cohort Bar dropdown list
* Collect "CC_Compare_1" Case Count for comparison

## Travel to cohort comparison selection screen
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Cohort Comparison" from "Analysis" "app"
* Change number of entries shown in the table to "100"
* Is text "Select a cohort to compare with CC_Compare_1" present on the page

## Select cohort to compare with and run
* Select cohort "CC_Compare_2" for comparison on the cohort comparison selection screen
* Run analysis on Cohort Comparison

## Verify Analysis Cards Visibility
* Verify analysis cards are visible or not visible as expected on cohort comparison
  |analysis_card          |should_be_visible_or_not_visible |
  |-----------------------|---------------------------------|
  |analysis-survival      |Visible                          |
  |Ethnicity              |Not Visible                      |
  |Gender                 |Visible                          |
  |Race                   |Not Visible                      |
  |Vital Status           |Visible                          |
  |Age At Diagnosis       |Visible                          |
* Select analysis cards to enable or disable on cohort comparison
  |analysis_card          |
  |-----------------------|
  |survival               |
  |Gender                 |
  |Vital Status           |
  |Age At Diagnosis       |
* Verify analysis cards are visible or not visible as expected on cohort comparison
  |analysis_card          |should_be_visible_or_not_visible |
  |-----------------------|---------------------------------|
  |analysis-survival      |Not Visible                      |
  |Ethnicity              |Not Visible                      |
  |Gender                 |Not Visible                      |
  |Race                   |Not Visible                      |
  |Vital Status           |Not Visible                      |
  |Age At Diagnosis       |Not Visible                      |
* Select analysis cards to enable or disable on cohort comparison
  |analysis_card          |
  |-----------------------|
  |survival               |
  |Ethnicity              |
  |Gender                 |
  |Race                   |
  |Vital Status           |
  |Age At Diagnosis       |
* Verify analysis cards are visible or not visible as expected on cohort comparison
  |analysis_card          |should_be_visible_or_not_visible |
  |-----------------------|---------------------------------|
  |analysis-survival      |Visible                          |
  |Ethnicity              |Visible                          |
  |Gender                 |Visible                          |
  |Race                   |Visible                          |
  |Vital Status           |Visible                          |
  |Age At Diagnosis       |Visible                          |

Checklist:
- Compare cohort counts to what is on page
done Add all filters, verify they are present and not present
- Verify cohort creation. Both filters and case counts
- Venn Diagram
