# End to End - Multiple Filter Cohort
Date Created    : 08/08/2023
Version			    : 1.0
Owner		        : GDC QA
Description		  : End to end test with multiple types of cohorts
Test-case       :

tags: gdc-data-portal-v2, end-to-end

## Save a cohort with multiple types of filters
* On GDC Data Portal V2 app
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Mutation Frequency" from "Analysis" "app"
* Is text "Overall Survival Plot" present on the page
* Select value from table by row and column
  |row   |column|
  |------|------|
  |1     |2     |
* Wait for loading spinner
* Wait for cohort bar case count loading spinner
* Navigate to "Cohort" from "Header" "section"
* Make the following selections from "Demographic" tab on the Cohort Builder page
  |facet_name       |selection              |
  |-----------------|-----------------------|
  |Ethnicity        |not hispanic or latino |
* Make the following selections from "Available Data" tab on the Cohort Builder page
  |facet_name       |selection              |
  |-----------------|-----------------------|
  |Data Format      |bam                    |
* Select "Save" from the Cohort Bar
* Name the cohort "Multiple Filters Cohort" in the Cohort Bar section
* "Save" "Cohort has been saved" and "remove modal" in the Cohort Bar section
* "Multiple Filters Cohort" should be the active cohort

## Projects Page
* Navigate to "Projects" from "Header" "section"
* Verify presence of filter card
  |filter_name            |
  |-----------------------|
  |Primary Site           |
  |Program                |
  |Disease Type           |
  |Data Category          |
  |Experimental Strategy  |
* Expand or contract a filter
  |filter_name            |label                |
  |-----------------------|---------------------|
  |Experimental Strategy  |plus-icon            |
* Make the following selections on a filter card
  |filter_name            |selection            |
  |-----------------------|---------------------|
  |Experimental Strategy  |scRNA-Seq            |
* Verify the page is showing "Showing 1 - 1 of 1 projects"


## Validate Repository Page
When the filters are fixed, add tests Header
* Navigate to "Downloads" from "Header" "section"
* Select value from table by row and column
  |row|column|
  |------|---|
  |1     |3  |

## File Summary Page
* Download "File" from "File Summary"
* Read metadata from compressed "File from File Summary"
* Verify that "File from File Summary" has expected information
  |required_info                          |
  |---------------------------------------|
  |0089d221-5807-47f1-a382-1e2e336df201   |
  |3024b4210d713fb1222fde805b9c94dc       |
  |validated                              |







## Pause Test
* Pause "10000" seconds

## ADD back to projects test later
* Download "TSV Projects Table" from "Projects"
* Read from "TSV Projects Table from Projects"
* Verify that "TSV Projects Table from Projects" has expected information
  |required_info|
  |-------------|
  |Project      |
  |Disease Type |
  |Primary Site |
  |Program      |
  |Cases        |
  |Experimental Strategy  |
  |CPTAC-3      |
