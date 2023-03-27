# Home Page - Navigation
Date Created    : 03/21/2023
Version			    : 1.0
Owner		        : GDC QA
Description		  : Test Home Page - Navigation
Test-case       : PEAR-939

tags: gdc-data-portal-v2, regression, home-page, navigation

## Navigate to Home Page
* On GDC Data Portal V2 app

## Validate Navigation Buttons - different tab
* These buttons on the "Home Page" should take the user to correct page in a new tab
  |button_text                                |text_on_expected_page                                  |
  |-------------------------------------------|-------------------------------------------------------|
  |Learn More About Our Harmonization Process |GDC for processing genomic data                        |
  |Contact Us                                 |For assistance with GDC query                          |
  |Data Release 36.0 - December 12, 2022      |Data Migrated from the Legacy Archive to Active Portal |

## Validate Navigation Buttons - same tab
* Selecting these buttons should take the user to correct page in the same tab
  |button_text                    |expected_landing_page|
  |-------------------------------|---------------------|
  |Explore Our Cancer Datasets    |Analysis             |
  |Explore These Studies          |Projects             |
  |Explore Cohort Builder         |Cohort               |
  |Explore More Tools             |Analysis             |
  |Explore Repository             |Downloads            |
