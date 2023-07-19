# Mutation Frequency - Custom Gene and Mutation Filters
Date Created  : 07/14/2023
Version			  : 1.0
Owner		      : GDC QA
Description		: Custom Filtering on the Mutation Frequency App
Test-Case     : PEAR-732

tags: gdc-data-portal-v2, mutation-frequency, regression

## Navigate to Mutation Frequency App
* On GDC Data Portal V2 app
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Mutation Frequency" from "Analysis" "app"

## Validate Custom Gene Filters
* Select "Custom Gene Filters" in the Mutation Frequency app
* Upload "Custom Gene Filters" "txt" from "Mutation Frequency" in "Mutation Frequency Custom Filter" through "Browse"
* Is text "6 submitted gene identifiers mapped to 6 unique GDC genes" present on the page
* Select "Submit"
* Wait for loading spinner
* Verify the table body text is correct
  |expected_text                        |row  |column |
  |-------------------------------------|-----|-------|
  |MUC16                                |1    |4      |
  |FAT3                                 |2    |4      |
  |FAM135B                              |3    |4      |
  |ANK1                                 |4    |4      |
  |RB1                                  |5    |4      |
  |MYH9                                 |6    |4      |
* Verify the page is showing "1 - 6 of 6 genes"
* Is text "- MUC16 Not Mutated Cases" present on the page
* Is text "- MUC16 Mutated Cases" present on the page
* Perform the following actions on a filter card
  |filter_name          |action               |
  |---------------------|---------------------|
  |Custom Gene Filters  |clear selection      |

## Validate Custom Mutation Filters
* Switch to "Mutations" tab in the Mutation Frequency app
* Wait for loading spinner
* Select "Custom Mutation Filters" in the Mutation Frequency app
* Upload "Custom Mutation Filters" "txt" from "Mutation Frequency" in "Mutation Frequency Custom Filter" through "Browse"
* Is text "4 submitted mutation identifiers mapped to 4 unique GDC mutations" present on the page
* Select "Submit"
* Wait for loading spinner
* Verify the table body text is correct
  |expected_text                       |row  |column |
  |------------------------------------|-----|-------|
  |KRASG12D                            |1    |5      |
  |ACVR2AK437Rfs*5                     |2    |5      |
  |KRASQ61H                            |3    |5      |
  |FGFR3S249C                          |4    |5      |
* Verify the page is showing "1 - 4 of 4 somatic mutations"
* Is text "- KRAS G12D Missense Not Mutated Cases" present on the page
* Is text "- KRAS G12D Missense Mutated Cases" present on the page
* Perform the following actions on a filter card
  |filter_name              |action               |
  |-------------------------|---------------------|
  |Custom Mutation Filters  |clear selection      |
