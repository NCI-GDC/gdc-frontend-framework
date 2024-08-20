# Data Release: 41 - File Exclusion
Date Created        : 08/20/2024
Version			    : 1.0
Owner		        : GDC QA
Description		    : Files Excluded in DR-41
Test-Case           : PEAR-1928

tags: gdc-data-portal-v2, data-release

## File Excluded in this Data Release
* On GDC Data Portal V2 app
* Quick search for "9aa21e20-e88f-4095-b80d-865c53482e55"
* Validate the quick search bar result in position "1" of the result list has the text "File 9aa21e20-e88f-4095-b80d-865c53482e55 has been updated"
* Select the quick search bar result in position "1"
* Is text "HCM-CSHL-0143-C20.json" present on the page
* Download "File" from "File Summary"
* Read metadata from compressed "File from File Summary"
* Verify that "File from File Summary" has expected information
  |required_info                          |
  |---------------------------------------|
  |3b8e9aaa-a62b-44fa-8afa-539ba998d264   |
  |e6083c0aecf1bee90bbf78e667a75388       |
  |49816                                  |
* Verify the table "File Properties File Summary" is displaying this information
  |text_to_validate                       |
  |---------------------------------------|
  |3b8e9aaa-a62b-44fa-8afa-539ba998d264   |
  |e6083c0aecf1bee90bbf78e667a75388       |
  |open                                   |
* Verify the table "File Versions File Summary" is displaying this information
  |text_to_validate                                   |
  |---------------------------------------------------|
  |3b8e9aaa-a62b-44fa-8afa-539ba998d264Current Version|
  |9aa21e20-e88f-4095-b80d-865c53482e55               |
  |2024-03-29                                         |
  |40.0                                               |
  |41.0                                               |
