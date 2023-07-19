# Home Page - Live Statistics
Date Created    : 03/21/2023
Version			    : 1.0
Owner		        : GDC QA
Description		  : Test Home Page - Live Stats
Test-case       : PEAR-939

tags: gdc-data-portal-v2, regression, home-page

## Navigate to Home Page
* On GDC Data Portal V2 app

## Validate Live Statistics
* Is text "Mutations" present on the page
* Pause "2" seconds
* Live statistics should display correct values
  |category       |expected_statistic |
  |---------------|-------------------|
  |Projects       |74                 |
  |Primary Sites  |67                 |
  |Cases          |86,513             |
  |Files          |887,872            |
  |Genes          |22,450             |
  |Mutations      |2,761,145          |
