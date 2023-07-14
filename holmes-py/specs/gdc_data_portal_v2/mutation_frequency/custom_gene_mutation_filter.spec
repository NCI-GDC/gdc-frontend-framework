# Mutation Frequency - Custom Gene and Mutation Filters
Date Created    : 07/14/2023
Version			: 1.0
Owner		    : GDC QA
Description		: Custom Filtering on the Mutation Frequency App
Test-Case       : PEAR-732

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
* Perform the following actions on a filter card
  |filter_name          |action               |
  |---------------------|---------------------|
  |Custom Gene Filters  |clear selection      |
* Wait for loading spinner

## Validate Custom Mutation Filters
* Switch to "Mutations" tab in the Mutation Frequency app
* Wait for loading spinner
* Select "Custom Mutation Filters" in the Mutation Frequency app
* Upload "Custom Mutation Filters" "txt" from "Mutation Frequency" in "Mutation Frequency Custom Filter" through "Browse"
* Is text "4 submitted mutation identifiers mapped to 4 unique GDC mutations" present on the page
* Select "Submit"
* Wait for loading spinner
* Pause "10" seconds
* Perform the following actions on a filter card
  |filter_name              |action               |
  |-------------------------|---------------------|
  |Custom Mutation Filters  |clear selection      |
