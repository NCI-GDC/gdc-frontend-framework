# Clinical Data Analysis - Survival Plot
Date Created  : 12/10/2024
Version	      : 1.0
Owner		  : GDC QA
Description	  : Survival Plot Graphing
Test-Case     : PEAR-604

tags: gdc-data-portal-v2, clinical-data-analysis, regression

## Create Cohort for Test
* On GDC Data Portal V2 app
* Navigate to "Cohort" from "Header" "section"
* Create and save a cohort named "cDAVE_Ajcc_Pathologic" with these filters
  |tab_name               |facet_name           |selection                      |
  |-----------------------|---------------------|-------------------------------|
  |General Diagnosis      |Ajcc Pathologic Stage|stage i                        |
  |General Diagnosis      |Ajcc Pathologic Stage|stage iia                      |
  |General Diagnosis      |Ajcc Pathologic Stage|stage ii                       |
  |General Diagnosis      |Ajcc Pathologic Stage|stage ia                       |
  |General Diagnosis      |Ajcc Pathologic Stage|stage iiic                     |
  |General Diagnosis      |Ajcc Pathologic Stage|stage iic                      |
* Collect case counts for the following filters on the Cohort Builder page for cohort "cDAVE_Ajcc_Pathologic"
  |tab_name               |facet_name           |selection                      |
  |-----------------------|---------------------|-------------------------------|
  |General Diagnosis      |Ajcc Pathologic Stage|stage i                        |
  |General Diagnosis      |Ajcc Pathologic Stage|stage iia                      |
  |General Diagnosis      |Ajcc Pathologic Stage|stage ii                       |
  |General Diagnosis      |Ajcc Pathologic Stage|stage ia                       |
  |General Diagnosis      |Ajcc Pathologic Stage|stage iiic                     |
  |General Diagnosis      |Ajcc Pathologic Stage|stage iic                      |


## Navigate to Clinical Data Analysis
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Clinical Data Analysis" from "Analysis" "app"
* Wait for "Overall Survival Plot" to be present on the page
* Expand clinical property sections
* Select the following fields on the Clinical Data Analysis page
  |field_switch_selector    |
  |-------------------------|
  |AJCC Pathologic Stage    |

## Add to Plotted Chart
* On the "AJCC Pathologic Stage" card, select "Survival Plot" button on the Clinical Data Analysis page
* Is text "Use the Survival buttons" present on the page
* On the "AJCC Pathologic Stage" card's table, select value by row and column on the Clinical Data Analysis page
    |row   |column|button_or_checkbox   |
    |------|------|---------------------|
    |3     |2     |button               |
    |4     |2     |button               |
    |5     |2     |button               |
* Is text "S1 (N = " present on the page
* Is text ") - stage iiic" present on the page
* Is text "S2 (N = " present on the page
* Is text ") - stage iia" present on the page
* Is text "S3 (N = " present on the page
* Is text ") - stage ii" present on the page
* Is text "S4 (N = " present on the page
* Is text ") - stage ia" present on the page
* Is text "S5 (N = " present on the page
* Is text ") - stage iiic" present on the page

## Survival Plot Validate Counts
* Collect analysis card table data for comparison on the Clinical Data Analysis page
  |button_label                         |analysis_card               |row  |column |do_not_trim_content|
  |-------------------------------------|----------------------------|-----|-------|-------------------|
  |Ajcc Pathologic Stage_R1_C4          |AJCC Pathologic Stage       |1    |4      |False              |
  |Ajcc Pathologic Stage_R2_C4          |AJCC Pathologic Stage       |2    |4      |False              |
  |Ajcc Pathologic Stage_R3_C4          |AJCC Pathologic Stage       |3    |4      |False              |
  |Ajcc Pathologic Stage_R4_C4          |AJCC Pathologic Stage       |4    |4      |False              |
  |Ajcc Pathologic Stage_R5_C4          |AJCC Pathologic Stage       |5    |4      |False              |
  |Ajcc Pathologic Stage_R6_C4          |AJCC Pathologic Stage       |6    |4      |False              |

* Verify "Ajcc Pathologic Stage_stage i_cDAVE_Ajcc_Pathologic Count" and "Ajcc Pathologic Stage_R1_C4" are "Equal"
* Verify "Ajcc Pathologic Stage_stage iia_cDAVE_Ajcc_Pathologic Count" and "Ajcc Pathologic Stage_R2_C4" are "Equal"
* Verify "Ajcc Pathologic Stage_stage ii_cDAVE_Ajcc_Pathologic Count" and "Ajcc Pathologic Stage_R3_C4" are "Equal"
* Verify "Ajcc Pathologic Stage_stage ia_cDAVE_Ajcc_Pathologic Count" and "Ajcc Pathologic Stage_R4_C4" are "Equal"
* Verify "Ajcc Pathologic Stage_stage iiic_cDAVE_Ajcc_Pathologic Count" and "Ajcc Pathologic Stage_R5_C4" are "Equal"
* Verify "Ajcc Pathologic Stage_stage iic_cDAVE_Ajcc_Pathologic Count" and "Ajcc Pathologic Stage_R6_C4" are "Equal"
