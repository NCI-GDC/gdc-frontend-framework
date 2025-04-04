# Clinical Data Analysis - Save New Cohort
Date Created  : 12/11/2024
Version	      : 1.0
Owner		      : GDC QA
Description	  : Save New Cohort with Dropdown Options
Test-Case     : PEAR-620

tags: gdc-data-portal-v2, clinical-data-analysis, regression

## Create Cohort for Test
* On GDC Data Portal V2 app
* Navigate to "Cohort" from "Header" "section"

* Create and save a cohort named "cDAVE_Apollo_Female" with these filters
  |tab_name               |facet_name           |selection                      |
  |-----------------------|---------------------|-------------------------------|
  |General                |Program              |APOLLO                         |
  |Demographic            |Gender               |female                         |
* Collect "cDAVE_Apollo_Female" Case Count for comparison

* Create and save a cohort named "cDAVE_Apollo" with these filters
  |tab_name               |facet_name           |selection                      |
  |-----------------------|---------------------|-------------------------------|
  |General                |Program              |APOLLO                         |
* Collect case counts for the following filters on the Cohort Builder page for cohort "cDAVE_Apollo"
  |tab_name               |facet_name           |selection                      |
  |-----------------------|---------------------|-------------------------------|
  |Demographic            |Gender               |female                         |
  |Demographic            |Gender               |male                           |
* Collect "cDAVE_Apollo" Case Count for comparison

## Navigate to Clinical Data Analysis
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Clinical Data Analysis" from "Analysis" "app"
* Wait for "Overall Survival Plot" to be present on the page

## Only Selected Cases
* On the "Gender" card's table, select value by row and column on the Clinical Data Analysis page
    |row   |column|button_or_checkbox   |
    |------|------|---------------------|
    |1     |1     |checkbox             |
* Collect analysis card table data for comparison on the Clinical Data Analysis page
  |button_label                         |analysis_card               |row  |column |do_not_trim_content|
  |-------------------------------------|----------------------------|-----|-------|-------------------|
  |Gender_male_R1_C3                    |Gender                      |1    |3      |False              |
* Verify "Gender_male_R1_C3" and "Gender_male_cDAVE_Apollo Count" are "Equal"
* On the "Gender" card, select "Save New Cohort Cases Table" button on the Clinical Data Analysis page
* Select "Only Selected Cases" from dropdown menu
* Name the cohort "cDAVE_Apollo_Male" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                                          |Keep or Remove Modal|
  |-----------------|-------------------------------------------------------------------|--------------------|
  |Save             |cDAVE_Apollo_Male has been saved.                                  |Remove Modal        |
* Switch cohort to "cDAVE_Apollo_Male" from the Cohort Bar dropdown list
* Collect "cDAVE_Apollo_Male" Case Count for comparison
* Verify "cDAVE_Apollo_Male Case Count" and "Gender_male_cDAVE_Apollo Count" are "Equal"

## Existing Cohort With Selected Cases
* Switch cohort to "cDAVE_Apollo_Female" from the Cohort Bar dropdown list
* On the "Gender" card's table, select value by row and column on the Clinical Data Analysis page
    |row   |column|button_or_checkbox   |
    |------|------|---------------------|
    |1     |1     |checkbox             |
* On the "Gender" card, select "Save New Cohort Cases Table" button on the Clinical Data Analysis page
* Select "Existing Cohort With Selected Cases" from dropdown menu

* Change number of entries shown in the table "Select Cohort" to "100"
* Select the radio button "cDAVE_Apollo_Male"
* Select button "Submit"
* Name the cohort "cDAVE_Apollo_Female_added_Male" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                              |Keep or Remove Modal|
  |-----------------|-------------------------------------------------------|--------------------|
  |Save             |cDAVE_Apollo_Female_added_Male has been saved          |Remove Modal        |
* Switch cohort to "cDAVE_Apollo_Female_added_Male" from the Cohort Bar dropdown list
* Collect "cDAVE_Apollo_Female_added_Male" Case Count for comparison
* Verify "cDAVE_Apollo Case Count" and "cDAVE_Apollo_Female_added_Male Case Count" are "Equal"

## Existing Cohort Without Selected Cases
* Switch cohort to "cDAVE_Apollo" from the Cohort Bar dropdown list
* On the "Gender" card's table, select value by row and column on the Clinical Data Analysis page
    |row   |column|button_or_checkbox   |
    |------|------|---------------------|
    |1     |1     |checkbox             |

* On the "Gender" card, select "Save New Cohort Cases Table" button on the Clinical Data Analysis page
* Select "Existing Cohort Without Selected Cases" from dropdown menu
* Change number of entries shown in the table "Select Cohort" to "100"
* Select the radio button "cDAVE_Apollo_Female_added_Male"
* Select button "Submit"
* Name the cohort "cDAVE_Apollo_Female_minus_Male" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                              |Keep or Remove Modal|
  |-----------------|-------------------------------------------------------|--------------------|
  |Save             |cDAVE_Apollo_Female_minus_Male has been saved          |Remove Modal        |
* Switch cohort to "cDAVE_Apollo_Female_minus_Male" from the Cohort Bar dropdown list
* Collect "cDAVE_Apollo_Female_minus_Male" Case Count for comparison
* Verify "cDAVE_Apollo_Female_minus_Male Case Count" and "cDAVE_Apollo_Female Case Count" are "Equal"
