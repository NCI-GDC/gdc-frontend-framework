# Cohort Builder - Race Condition
Date Created    : 03/06/2024
Version			    : 1.0
Owner		        : GDC QA
Description		  : Add filters quickly and ensure case counts are accurate
Test-case       :

tags: gdc-data-portal-v2, cohort-builder, filter-card

## Navigate to Cohort Builder
* On GDC Data Portal V2 app
* Navigate to "Cohort" from "Header" "section"

## Cohort Builder - General Card Functions
* Make the following selections on the Cohort Builder page without pauses
  |tab_name               |facet_name           |selection            |
  |-----------------------|---------------------|---------------------|
  |Available Data         |Experimental Strategy|Methylation Array    |
  |General                |Primary Site         |brain                |
* Collect Cohort Bar Case Count for comparison
* Collect case counts for the following filters on the Cohort Builder page for cohort "Race_Condition"
  |tab_name               |facet_name           |selection                      |
  |-----------------------|---------------------|-------------------------------|
  |General                |Primary Site         |brain                          |
* Verify "Primary Site_brain_Race_Condition Count" and "Cohort Bar Case Count" are "Equal"
