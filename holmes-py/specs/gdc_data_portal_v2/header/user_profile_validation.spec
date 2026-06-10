# Header - User Profile Validation
Date Created    : 05/26/26
Version			    : 1.0
Owner		        : GDC QA
Description		  : Test User Profile permissions, token
Test-case       : PEAR-930

tags: gdc-data-portal-v2, controlled-access, header

## Navigate to Home Page
* On GDC Data Portal V2 app
* Is text "GDC Apps" present on the page

## Validate User Profile
* Open username menu from the header section
* Select "User Profile" from dropdown menu
* Is text "Username" present on the page
* Verify the table "User Profile Access" is displaying this information
    |expected_text                          |
    |---------------------------------------|
    |Project ID                             |
    |admin                                  |
    |member                                 |
    |read                                   |
    |delete                                 |
    |read_report                            |
    |update                                 |
    |release                                |
    |create                                 |
    |download                               |
    |QA-DICT                                |
    |QA-REGRESSION                          |
    |QA-TEST                                |
    |TCGA-CESC                              |
    |HCMI-CMDC                              |
* Select "Close"

## Download Auth Token
* Open username menu from the header section
* Download "File" from "Username Authentication Token"
* Read from "File from Username Authentication Token"
* Verify that "File from Username Authentication Token" has expected information
  |required_info                        |
  |-------------------------------------|
  |ey                                   |
