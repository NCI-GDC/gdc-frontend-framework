# Cohort Builder - Custom Filter
Date Created    : 02/21/2023
Version			    : 1.0
Owner		        : GDC QA
Description		  : Test Cohort Builder - test custom filter tab and modal
Test-case       : PEAR-795

tags: gdc-data-portal-v2, cohort-builder, regression

## Navigate to Cohort Builder

* On GDC Data Portal V2 app
* Navigate to "Cohort" from "Header" "section"

## Cohort Builder - Custom Filter Tab and Modal

* Navigate to the "Custom Filters" tab on the Cohort Builder page

* Is text "No custom filters added" present on the page

* Select "cohort-builder-add-a-custom-filter" a data-testid button

* Enter "days_to_collection" in the text box "Search For a Property"

* Select "samples.days_to_collection" a data-testid button

* Perform the following actions from "Custom Filters" tab on the Cohort Builder page
  |facet_name                 |action               |
  |---------------------------|---------------------|
  |Samples Days to Collection |Remove the facet     |

* Select "cohort-builder-add-a-custom-filter" a data-testid button

* Enter "serological laboratory test" in the text box "Search For a Property"

* Select "follow_ups.viral_hepatitis_serologies" a data-testid button

* Perform the following actions from "Custom Filters" tab on the Cohort Builder page
  |facet_name                             |action               |
  |---------------------------------------|---------------------|
  |Follow Ups Viral Hepatitis Serologies  |Remove the facet     |

* Select "cohort-builder-add-a-custom-filter" a data-testid button

* Only show custom case filters with values

* Is data-testid button "diagnoses.pathology_details.number_proliferating_cells" not present on the page

* Select "diagnoses.annotations.classification" a data-testid button

* Perform the following actions from "Custom Filters" tab on the Cohort Builder page
  |facet_name                     |action               |
  |-------------------------------|---------------------|
  |Annotations Classification     |Remove the facet     |

* Is text "No custom filters added" present on the page
