# Data Release - Case Inclusion
Date Created        : 08/04/2024
Version			    : 1.0
Owner		        : GDC QA
Description		    : Case Inclusion in Data Release
Test-Case           : PEAR-1929

tags: gdc-data-portal-v2, data-release

table: resources/data_release/case_inclusion.csv

## Case Introduced in this Data Release: C3L-04090
* On GDC Data Portal V2 app
* Quick search for <Case ID> and go to its page
* Add all files to cart on the case summary page
* Is text <Files Added> present on the page
* Remove all files from cart on the case summary page
* Is text <Files Removed> present on the page
* Verify the table "Summary Case Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |<Case UUID>                            |
    |<Case ID>                              |
    |<Primary Site>                         |
