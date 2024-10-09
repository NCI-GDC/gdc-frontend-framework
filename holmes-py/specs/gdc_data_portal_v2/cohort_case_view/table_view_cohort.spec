# Cohort Case View - Save Cohort
Date Created        : 10/07/2024
Version			    : 1.0
Owner		        : GDC QA
Description		    : Save New Cohort Button with Dropdown Options
Test-Case           : PEAR-1013

tags: gdc-data-portal-v2, regression, cohort-bar, case-view

## Make Blank Cohort
* On GDC Data Portal V2 app
* Navigate to "Cohort" from "Header" "section"
* Create and save a cohort named "CT_MP2PRT" with these filters
  |tab_name               |facet_name           |selection                      |
  |-----------------------|---------------------|-------------------------------|
  |General                |Program              |MP2PRT                         |

## Navigate to Table View
* Expand or collapse the cohort bar
* Go to tab "Table View" in Cohort Case View

## Only Selected Cases
* In table "Cases", search the table for "MP2PRT-PAR"
* Change number of entries shown in the table "Cases" to "100"
* Select value from table "Cases" by row and column
  |row   |column|
  |------|------|
  |1     |1     |
  |2     |1     |
  |3     |1     |
  |4     |1     |
  |5     |1     |
  |6     |1     |
  |7     |1     |
  |8     |1     |
  |9     |1     |
  |10    |1     |
* Select "Save New Cohort" in Cohort Table View
* Select "Only Selected Cases" from dropdown menu
* Name the cohort "CT_Only_Selected_Cases" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                  |Keep or Remove Modal|
  |-----------------|-------------------------------------------|--------------------|
  |Save             |CT_Only_Selected_Cases has been saved      |Keep Modal          |
* Set this as your current cohort
* "CT_Only_Selected_Cases" should be the active cohort
* The cohort bar case count should be "10"
* Collect table "Cases" Item Count for comparison
* Collect Cohort Bar Case Count for comparison
* Verify "Cohort Bar Case Count" and "Cases Item Count" are "Equal"

## Existing Cohort With Selected Cases
* Switch cohort to "CT_MP2PRT" from the Cohort Bar dropdown list
* Select value from table "Cases" by row and column
  |row   |column|
  |------|------|
  |11    |1     |
  |12    |1     |
  |13    |1     |
  |14    |1     |
  |15    |1     |
* Select "Save New Cohort" in Cohort Table View
* Select "Existing Cohort With Selected Cases" from dropdown menu
* Change number of entries shown in the table "Select Cohort" to "100"
* Verify the cohort "CT_Only_Selected_Cases" displays a count of "10" in Modal
* Select the radio button "CT_Only_Selected_Cases"
* Select button "Submit"
* Name the cohort "CT_Existing_Cohort_With_Selected_Cases" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                              |Keep or Remove Modal|
  |-----------------|-------------------------------------------------------|--------------------|
  |Save             |CT_Existing_Cohort_With_Selected_Cases has been saved  |Keep Modal          |
* Set this as your current cohort
* "CT_Existing_Cohort_With_Selected_Cases" should be the active cohort
* The cohort bar case count should be "15"
* Collect table "Cases" Item Count for comparison
* Collect Cohort Bar Case Count for comparison
* Verify "Cohort Bar Case Count" and "Cases Item Count" are "Equal"

## Existing Cohort Without Selected Cases
* Switch cohort to "CT_MP2PRT" from the Cohort Bar dropdown list
* Select value from table "Cases" by row and column
  |row   |column|
  |------|------|
  |1     |1     |
  |2     |1     |
  |12    |1     |
  |13    |1     |
  |21    |1     |
* Select "Save New Cohort" in Cohort Table View
* Select "Existing Cohort Without Selected Cases" from dropdown menu
* Verify the cohort "CT_Existing_Cohort_With_Selected_Cases" displays a count of "15" in Modal
* Select the radio button "CT_Existing_Cohort_With_Selected_Cases"
* Select button "Submit"
* Name the cohort "CT_Existing_Cohort_Without_Selected_Cases" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                              |Keep or Remove Modal|
  |-----------------|-------------------------------------------------------|--------------------|
  |Save             |CT_Existing_Cohort_Without_Selected_Cases has been saved|Keep Modal         |
* Set this as your current cohort
* "CT_Existing_Cohort_Without_Selected_Cases" should be the active cohort
* The cohort bar case count should be "11"
* Collect table "Cases" Item Count for comparison
* Collect Cohort Bar Case Count for comparison
* Verify "Cohort Bar Case Count" and "Cases Item Count" are "Equal"
