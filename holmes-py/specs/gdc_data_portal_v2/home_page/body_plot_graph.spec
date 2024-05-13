# Home Page - Body Plot Graph Cohort Creation
Date Created    : 05/10/24
Version			: 1.0
Owner		    : GDC QA
Description		: Home Page - Create Cohorts using Body Plot Graph
Test-case       : PEAR-1104

tags: gdc-data-portal-v2, regression, home-page, cohort-bar

## Navigate to Home Page
* On GDC Data Portal V2 app

## Create Cohort Using Label
* Select the "Label" "Liver" on the Body Plot Graph
* Is text "Explore this Liver cohort in the Analysis Center?" present on the page
* Select "Yes"
* Is modal with text "Liver has been created. This is now your current cohort." present on the page and "Remove Modal"
* Wait for cohort bar case count loading spinner
* Validate the cohort query filter area has these filters
  |facet_name               |selections                         |position in filter area  |
  |-------------------------|-----------------------------------|-------------------------|
  |Primary Site             |liver and intrahepatic bile ducts  |1                        |
  |Tissue or Organ of Origin|intrahepatic bile ductliver        |2                        |

## Replace Previous Unsaved Cohort and Save the Cohort
* Navigate to "Home" from "Header" "section"
* Select the "Bar Graph" "Kidney" on the Body Plot Graph
* Is text "Explore this Kidney cohort in the Analysis Center?" present on the page
* Is text "This will replace the Liver cohort." present on the page
* Select "Yes"
* Is modal with text "Kidney has been created. This is now your current cohort." present on the page and "Remove Modal"
* Validate the cohort query filter area has these filters
  |facet_name               |selections                         |position in filter area  |
  |-------------------------|-----------------------------------|-------------------------|
  |Primary Site             |Kidney                             |1                        |
  |Tissue or Organ of Origin|kidney, nos                        |2                        |
* Select "Save" from the Cohort Bar
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                  |Keep or Remove Modal|
  |-----------------|-------------------------------------------|--------------------|
  |Save             |Cohort has been saved                      |Remove Modal        |

## Create Body Plot Cohort then Delete Cohort
* Navigate to "Home" from "Header" "section"
* Select the "Bar Graph" "Adrenal Gland" on the Body Plot Graph
* Is text "Explore this Adrenal Gland cohort in the Analysis Center?" present on the page
* Select "Yes"
* Is modal with text "Adrenal Gland has been created. This is now your current cohort." present on the page and "Remove Modal"
* Validate the cohort query filter area has these filters
  |facet_name               |selections                                                       |position in filter area  |
  |-------------------------|-----------------------------------------------------------------|-------------------------|
  |Primary Site             |adrenal gland                                                    |1                        |
  |Tissue or Organ of Origin|adrenal gland, noscortex of adrenal glandmedulla of adrenal gland|2                        |
* Select "Delete" from the Cohort Bar
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                  |Keep or Remove Modal|
  |-----------------|-------------------------------------------|--------------------|
  |Delete           |Adrenal Gland has been deleted.            |Remove Modal        |
