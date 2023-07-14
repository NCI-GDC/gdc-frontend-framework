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
