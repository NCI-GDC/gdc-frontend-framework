# Header - Links
Date Created    : 09/29/2025
Version			    : 1.0
Owner		        : GDC QA
Description		  : Test Header - Links
Test-case       : PEAR-2518

tags: gdc-data-portal-v2, regression, header, navigation, new_tab

## Navigate to Home Page
* On GDC Data Portal V2 app
* Is text "GDC Apps" present on the page

## Validate Navigation Links - different tab
* These links on the "Header" should take the user to correct page in a new tab
  |button_text                                |url_expected_on_new_tab                                        |
  |-------------------------------------------|---------------------------------------------------------------|
  |Video Guides                               |https://docs.gdc.cancer.gov/Data_Portal/Users_Guide/Video_Tutorials/|
  |Obtaining Access to Controlled Data        |https://gdc.cancer.gov/access-data/obtaining-access-controlled-data|

## Validate Apps Links
* These Apps links should take the user to correct page in new tab
  |button_text                                |url_expected_on_new_tab                                        |
  |-------------------------------------------|---------------------------------------------------------------|
  |Website                                    |https://gdc.cancer.gov/?utm_source=dataportal&utm_medium=apps  |
  |API                                        |https://gdc.cancer.gov/developers/gdc-application-programming-interface-api?utm_source=dataportal&utm_medium=apps   |
  |Data Transfer Tool                         |https://gdc.cancer.gov/access-data/gdc-data-transfer-tool?utm_source=dataportal&utm_medium=apps|
  |Documentation                              |https://docs.gdc.cancer.gov/?utm_source=dataportal&utm_medium=apps|
  |Data Submission Portal                     |https://portal.gdc.cancer.gov/submission/login?next=%2Fsubmission%2Fundefined|
  |Publications                               |https://gdc.cancer.gov/about-data/publications?utm_source=dataportal&utm_medium=apps|
* Navigate to "Manage Sets" from "Header" "section"
* These Apps links should take the user to correct page in the same tab
  |button_text                                |url_expected_on_new_tab                                        |
  |-------------------------------------------|---------------------------------------------------------------|
  |Data Portal                                |A repository and computational platform for cancer             |


## Validate Pop-up Modal
* Select link "Send Feedback" from the header section
* Is text "We are continuously working on improving GDC 2.0 and would greatly appreciate feedback from our users." present on the page
* Close the modal
