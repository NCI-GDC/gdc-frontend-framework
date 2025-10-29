# Browse Annotation - Filters
Date Created        : 05/14/2025
Version			        : 1.0
Owner		            : GDC QA
Description		      : Test Filters in Browse Annotations
Test-Case           : PEAR-2420

tags: gdc-data-portal-v2, regression, annotations

## Navigate to Browse Annotations
* On GDC Data Portal V2 app
* Navigate to "Browse Annotations" from "Header" "section"

## Validate Filters Presence
* Verify presence of filter card
  |filter_name            |
  |-----------------------|
  |Project Id             |
  |Entity Type            |
  |Category               |
  |Classification         |
  |Created Datetime       |

## Project Id and Entity Type
* Make the following selections on a filter card
  |facet_name       |selection                            |
  |-----------------|-------------------------------------|
  |Project Id       |TCGA-OV                              |
  |Entity Type      |annotated_somatic_mutation           |
* Wait for table loading spinner
* Collect case counts for the following filters for cohort "Browse_Annotations_Filters"
  |facet_name       |selection                            |
  |-----------------|-------------------------------------|
  |Entity Type      |annotated_somatic_mutation           |
* Collect table "Annotations" Item Count for comparison
* Verify "Annotations Item Count" and "Entity Type_annotated_somatic_mutation_Browse_Annotations_Filters Count" are "Equal"

## Category and Classification
* Perform the following actions on a filter card
  |filter_name      |action               |
  |-----------------|---------------------|
  |Project Id       |clear selection      |
  |Entity Type      |clear selection      |
* Make the following selections on a filter card
  |facet_name       |selection                            |
  |-----------------|-------------------------------------|
  |Category         |center qc failed                     |
  |Classification   |centernotification                   |
* Collect case counts for the following filters for cohort "Browse_Annotations_Filters"
  |facet_name       |selection                            |
  |-----------------|-------------------------------------|
  |Classification   |centernotification                   |
* Collect table "Annotations" Item Count for comparison
* Verify "Annotations Item Count" and "Classification_centernotification_Browse_Annotations_Filters Count" are "Equal"

## Created Datetime
* Perform the following actions on a filter card
  |filter_name      |action               |
  |-----------------|---------------------|
  |Category         |clear selection      |
  |Classification   |clear selection      |
* Search in a filter card
  |facet_name       |label                  |text      |
  |-----------------|-----------------------|----------|
  |Created Datetime |input since value      |2023-05-10|
  |Created Datetime |input through value    |2023/12/30|

* In table "Annotations", search the table for "e0e55988-3539-4648-be0f-45975dc0708c"
* Verify the table "Annotations" has a total of "0" items

* In table "Annotations", search the table for "ae450927-0b69-4d34-9b03-ad65ae7da446"
* Verify the table "Annotations" has a total of "1" items

* In table "Annotations", search the table for "a3677fb4-86d2-499a-ad3a-c570aa0bc969"
* Verify the table "Annotations" has a total of "0" items
