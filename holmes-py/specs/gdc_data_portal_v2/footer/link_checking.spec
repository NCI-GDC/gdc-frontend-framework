# Footer - Links
Date Created    : 06/12/2023
Version			    : 1.0
Owner		        : GDC QA
Description		  : Test Footer - Links
Test-case       : PEAR-942

tags: gdc-data-portal-v2, regression, footer, navigation

## Navigate to Home Page
* On GDC Data Portal V2 app

## Check Footer Text
* Is text "at the National Institutes of Health" present on the page
* Is text "NIH... Turning Discovery Into Health" present on the page

## Validate Navigation Links - different tab
* These links on the "Footer" should take the user to correct page in a new tab
  |button_text                                |url_expected_on_new_tab                                        |
  |-------------------------------------------|---------------------------------------------------------------|
  |Data Portal                                |https://portal.gdc.cancer.gov/                                 |
  |Website                                    |https://gdc.cancer.gov/                                        |
  |API                                        |https://gdc.cancer.gov/developers/gdc-application-programming-interface-api|
  |Data Transfer Tool                         |https://gdc.cancer.gov/access-data/gdc-data-transfer-tool      |
  |Documentation                              |https://docs.gdc.cancer.gov/                                   |
  |Data Submission Portal                     |https://portal.gdc.cancer.gov/submission/                      |
  |Publications                               |https://gdc.cancer.gov/about-data/publications                 |
  |Site Home                                  |https://portal.gdc.cancer.gov/                                 |
  |Support                                    |https://gdc.cancer.gov/support                                 |
  |Listserv                                   |https://list.nih.gov/cgi-bin/wa.exe?SUBED1=gdc-users-l&A=1     |
  |Accessibility                              |https://www.cancer.gov/policies/accessibility                  |
  |Disclaimer                                 |https://www.cancer.gov/policies/disclaimer                     |
  |FOIA                                       |https://www.nih.gov/institutes-nih/nih-office-director/office-communications-public-liaison/freedom-information-act-office|
  |HHS Vulnerability Disclosure               |https://www.hhs.gov/vulnerability-disclosure-policy/           |
  |U.S. Department of Health and Human Services|https://www.hhs.gov/                                          |
  |National Institutes of Health              |https://www.nih.gov/                                           |
  |National Cancer Institute                  |https://www.cancer.gov/                                        |
  |USA.gov                                    |https://www.usa.gov/                                           |

## Validate Navigation Links - same tab
* These links should take the user to correct page in the same tab
  |button_text                    |expected_landing_page|
  |-------------------------------|---------------------|
  |Site Home                      |Home                 |
