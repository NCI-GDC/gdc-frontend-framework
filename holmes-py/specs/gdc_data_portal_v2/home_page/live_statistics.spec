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
* Pause "5" seconds
* Live statistics should display correct values
  |category       |expected_statistic |
  |---------------|-------------------|
  |Projects       |83                 |
  |Primary Sites  |69                 |
  |Cases          |44,637             |
  |Files          |1,019,317          |
  |Genes          |22,534             |
  |Mutations      |2,934,380          |
