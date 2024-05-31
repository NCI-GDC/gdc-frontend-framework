# Data Release: 40 - File Exclusion
Date Created        : 05/28/2024
Version			    : 1.0
Owner		        : GDC QA
Description		    : Files Excluded in DR-40
Test-Case           : PEAR-1928

tags: gdc-data-portal-v2, data-release

## File Excluded in this Data Release
* On GDC Data Portal V2 app
* Quick search for "f8f20eda-b70f-4767-ad3b-1a704faa5d36"
* Validate the quick search bar result in position "1" of the result list has the text "File f8f20eda-b70f-4767-ad3b-1a704faa5d36 has been updated"
* Select the quick search bar result in position "1"
* Is text "HCM-SANG-0282-C18.json" present on the page
* Verify the table "File Properties File Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |547f5ad0-d93d-4299-b2c0-34ac05b63779   |
    |249722ea264253c3572619e6d2c38885       |
    |open                                   |
* Verify the table "File Versions File Summary" is displaying this information
    |text_to_validate                                   |
    |---------------------------------------------------|
    |547f5ad0-d93d-4299-b2c0-34ac05b63779Current Version|
    |2024-03-29                                         |
    |40.0                                               |
    |f8f20eda-b70f-4767-ad3b-1a704faa5d36               |
