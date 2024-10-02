# Cohort Case View - Summary View Header
Date Created    : 10/01/2024
Version			    : 1.0
Owner		        : GDC QA
Description		  : Summary View Header
Test-Case       : PEAR-2207

tags: gdc-data-portal-v2, regression, cohort-bar, case-view

## Navigate to Summary View
* On GDC Data Portal V2 app
* Navigate to "Analysis" from "Header" "section"
* Expand or collapse the cohort bar
* Go to tab "Summary View" in Cohort Case View


TCGA-KIRP for biospecimen
mmrf-compass, female for clinical
## Biospecimen - TSV
* Make the following selections on a filter card in Cohort Summary View
  |facet_name           |selection            |
  |---------------------|---------------------|
  |Project              |TCGA-KIRP            |
* Download "TSV" from "Cohort Summary View Biospecimen"
* Read file content from compressed "TSV from Cohort Summary View Biospecimen"


## Flip Filters
* Perform the following actions on a filter card in Cohort Summary View
  |filter_name          |action               |
  |---------------------|---------------------|
  |Project              |Chart view           |

## Collapse Cohort Case View
* Expand or collapse the cohort bar
