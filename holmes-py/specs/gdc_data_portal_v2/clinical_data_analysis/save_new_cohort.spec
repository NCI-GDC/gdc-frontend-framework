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
* Create and save a cohort named "cDAVE_Apollo" with these filters
  |tab_name               |facet_name           |selection                      |
  |-----------------------|---------------------|-------------------------------|
  |General                |Program              |APOLLO                         |
* Collect case counts for the following filters on the Cohort Builder page for cohort "cDAVE_Apollo"
  |tab_name               |facet_name           |selection                      |
  |-----------------------|---------------------|-------------------------------|
  |Demographic            |Gender               |female                         |
  |Demographic            |Gender               |male                           |


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
* Collect Cohort Bar Case Count for comparison
* Verify "Cohort Bar Case Count" and "Gender_male_cDAVE_Apollo Count" are "Equal"
