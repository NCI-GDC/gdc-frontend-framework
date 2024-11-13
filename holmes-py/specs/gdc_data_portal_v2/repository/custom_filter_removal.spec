# Repository - Custom Filter Removal
Date Created    : 11/12/2024
Version			    : 1.0
Owner		        : GDC QA
Description		  : Validate custom filters that have been removed are not present
Test-case       : PEAR-2269

tags: gdc-data-portal-v2, repository, regression

## Navigate to Cohort Builder
* On GDC Data Portal V2 app
* Navigate to "Downloads" from "Header" "section"

## Validate Removal of Custom Filters
* Navigate to "Add a File Filter" from "Repository" "app"
* Is text "Search for a property" present on the page
* Verify these custom filters "are not" present in the properties table
  |removed_property                                         |
  |---------------------------------------------------------|
  |analysis.input_files.proportion_coverage_10X             |
  |analysis.input_files.proportion_coverage_30X             |
  |analysis.metadata.read_groups.RIN                        |
  |downstream_analyses.output_files.proportion_coverage_10X |
  |downstream_analyses.output_files.proportion_coverage_30X |
  |index_files.proportion_coverage_10X                      |
  |index_files.proportion_coverage_30X                      |
  |proportion_coverage_10X                                  |
  |proportion_coverage_30X                                  |

## Close Modal
* Close the modal
