# Project Page - Filter Card Check
Date Created   : 05/22/2023
Version			   : 1.0
Owner		       : GDC QA
Description		 : Filter Card Check
Test-Case      : PEAR-1286

tags: gdc-data-portal-v2, regression, projects

## Navigate to Projects Page
* On GDC Data Portal V2 app
* Navigate to "Projects" from "Header" "section"

## Verify All Filter Cards are Present
* Verify presence of filter card
  |filter_name            |
  |-----------------------|
  |Primary Site           |
  |Program                |
  |Disease Type           |
  |Data Category          |
  |Experimental Strategy  |

## Use Filter Cards
* Verify the page is showing "1 - 20"
* Expand or contract a filter
  |filter_name      |label                |
  |-----------------|---------------------|
  |Program          |plus-icon            |
* Make the following selections on a filter card
  |filter_name      |selection            |
  |-----------------|---------------------|
  |Program          |FM                   |
  |Primary Site     |adrenal gland        |
  |Disease Type     |basal cell neoplasms |
  |Data Category    |biospecimen          |
  |Experimental Strategy  |Targeted Sequencing|
* Verify the page is showing "Showing 1 - 1 of 1 projects"
* Perform the following actions on a filter card
  |filter_name      |action               |
  |-----------------|---------------------|
  |Primary Site     |clear selection      |
  |Disease Type     |clear selection      |
  |Data Category    |clear selection      |
  |Experimental Strategy |clear selection |
* Make the following selections on a filter card
  |filter_name      |selection            |
  |-----------------|---------------------|
  |Program          |HCMI                 |
* Verify the page is showing "Showing 1 - 2 of 2 projects"
* Perform the following actions on a filter card
  |filter_name      |action               |
  |-----------------|---------------------|
  |Program          |clear selection      |
* Verify the page is showing "1 - 20"
* Pause "1" seconds
