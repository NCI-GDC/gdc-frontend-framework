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
* Perform the following actions on a filter card
  |filter_name          |action               |
  |---------------------|---------------------|
  |Experimental Strategy|clear selection      |
* Verify the page is showing "1 - 20"

## Repository Page
When the filters are fixed add tests for them - PEAR-1350
* Navigate to "Downloads" from "Header" "section"
* Verify cohort case count equals repository table case count
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
* Pause "5" seconds

## Clinical Data Analysis App
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Clinical Data Analysis" from "Analysis" "app"
* Wait for "Overall Survival Plot" to be present on the page
* Expand clinical property sections
* Is text "Not enough survival data" not present on the page
* Validate all expected analysis cards are present on the Clinical Data Analysis page
  |analysis_card        |
  |---------------------|
  |Gender               |
  |Race                 |
  |Ethnicity            |
  |Age At Diagnosis     |
  |Primary Diagnosis    |
* Select the following fields on the Clinical Data Analysis page
  |field_switch_selector                            |
  |-------------------------------------------------|
  |demographic.gender                               |
  |demographic.year_of_death                        |
  |demographic.race                                 |
  |diagnoses.cog_renal_stage                        |
  |diagnoses.site_of_resection_or_biopsy            |
  |diagnoses.treatments.therapeutic_agents          |
  |exposures.tobacco_smoking_quit_year              |
* Validate all expected analysis cards are present on the Clinical Data Analysis page
  |analysis_card            |
  |-------------------------|
  |Ethnicity                |
  |Age At Diagnosis         |
  |Primary Diagnosis        |
  |Year Of Death            |
  |COG Renal Stage          |
  |Site Of Resection Or Biopsy|
  |Therapeutic Agents       |
  |Tobacco Smoking Quit Year|
* Validate these analysis cards are not present on the Clinical Data Analysis page
  |analysis_card            |
  |-------------------------|
  |Gender                   |
  |Race                     |
