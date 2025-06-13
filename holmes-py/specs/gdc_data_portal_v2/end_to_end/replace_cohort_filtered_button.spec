# End to End - Replace Cohort With Filtered Cohort Button
Date Created        : 06/12/2025
Version			    : 1.0
Owner		        : GDC QA
Description		    : Replace Cohort with Various Filtered Cohort Buttons
Test-case           :

tags: gdc-data-portal-v2, end-to-end, regression

## Create Initial Cohorts
* On GDC Data Portal V2 app
* Navigate to "Cohort" from "Header" "section"

* Create and save a cohort named "replace_cohort_3" with these filters
  |tab_name               |facet_name           |selection                      |
  |-----------------------|---------------------|-------------------------------|
  |General                |Program              |TCGA                           |
* Create and save a cohort named "replace_cohort_2" with these filters
  |tab_name               |facet_name           |selection                      |
  |-----------------------|---------------------|-------------------------------|
  |Demographic            |Gender               |male                           |
* Create and save a cohort named "replace_cohort_1" with these filters
  |tab_name               |facet_name           |selection                      |
  |-----------------------|---------------------|-------------------------------|
  |Demographic            |Gender               |female                         |

## Set Operations Replace
* Navigate to "Analysis" from "Header" "section"
* Switch cohort to "replace_cohort_1" from the Cohort Bar dropdown list
* Navigate to "Set Operations" from "Analysis" "app"
* Change number of entries shown in the table to "100"
* Select the following checkboxes in the Set Operations selection screen
  |checkbox_name                |
  |-----------------------------|
  |replace_cohort_1             |
  |replace_cohort_2             |
  |replace_cohort_3             |
* Run analysis on Set Operations
* Select the following checkboxes in the Set Operations analysis screen
  |checkbox_name                |
  |-----------------------------|
  |S2 intersect S3 minus S1     |
  |S1 intersect S3 minus S2     |
  |S1 minus S2 union S3         |
  |S2 minus S1 union S3         |
  |S3 minus S1 union S2         |
* Pause "8" seconds
* Collect union row save set item count as "S1 Union S2 Union S3" on the Set Operations analysis screen

* Select Union Row to save as a new set in the Set Operations analysis screen
* Name the cohort "replace_cohort_1" in the Cohort Bar section
* Select button "Save Name"
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                                  |Keep or Remove Modal|
  |-----------------|-----------------------------------------------------------|--------------------|
  |Replace          |Cohort has been saved.                                     |Remove Modal        |

* Collect Cohort Bar Case Count for comparison
* Verify "S1 Union S2 Union S3 Count Set Operations" and "Cohort Bar Case Count" are "Equal"

* Verify the table "Summary Set Operations" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |replace_cohort_1                       |
    |replace_cohort_2                       |
    |replace_cohort_3                       |

## Cohort Comparison Replace
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Cohort Comparison" from "Analysis" "app"
* Change number of entries shown in the table to "100"
* Select cohort "replace_cohort_2" for comparison on the cohort comparison selection screen
* Run analysis on Cohort Comparison

* Collect case counts on save cohort buttons from an analysis card on Cohort Comparison
  |analysis_card          |Filter Row                       |Cohort Number  |Collect Case Count Name              |
  |-----------------------|---------------------------------|---------------|-------------------------------------|
  |Vital Status           |alive                            |1              |CC_Vital_Status_Alive_1 Count        |
  |Vital Status           |dead                             |2              |CC_Vital_Status_Dead_2 Count         |

* Replace active cohort with one from an analysis card on Cohort Comparison
  |analysis_card          |Filter Row                       |Cohort Number  |Cohort Name                    |Expected Message                   |
  |-----------------------|---------------------------------|---------------|-------------------------------|-----------------------------------|
  |Vital Status           |alive                            |1              |replace_cohort_1               |Cohort has been saved.             |
  |Vital Status           |dead                             |2              |replace_cohort_3               |replace_cohort_3 has been saved.   |

* Collect Cohort Bar Case Count for comparison
* Verify "Cohort Bar Case Count" and "CC_Vital_Status_Alive_1 Count" are "Equal"

* Switch cohort to "replace_cohort_3" from the Cohort Bar dropdown list
* Collect Cohort Bar Case Count for comparison
* Verify "Cohort Bar Case Count" and "CC_Vital_Status_Dead_2 Count" are "Equal"

## Project Page Replace
* Navigate to "Analysis" from "Header" "section"
* Switch cohort to "replace_cohort_1" from the Cohort Bar dropdown list
* Quick search for "FM-AD" and go to its page
* Collect "Case Count" on Project Summary page
* Select "Save New Cohort" on Project Summary page

* Name the cohort "replace_cohort_1" in the Cohort Bar section
* Select button "Save Name"
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                                  |Keep or Remove Modal|
  |-----------------|-----------------------------------------------------------|--------------------|
  |Replace          |Cohort has been saved.                                     |Remove Modal        |

* Navigate to "Analysis" from "Header" "section"
* Collect Cohort Bar Case Count for comparison
* Verify "Cohort Bar Case Count" and "Case Count Project Summary" are "Equal"
