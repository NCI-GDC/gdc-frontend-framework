# Data Release - File Inclusion Controlled Access
Date Created        : 08/04/2024
Version			    : 1.0
Owner		        : GDC QA
Description		    : Controlled Access File Inclusion in Data Release
Test-Case           : PEAR-1928

tags: gdc-data-portal-v2, data-release

table: resources/data_release/file_inclusion_controlled.csv

## File Introduced in this Data Release
* On GDC Data Portal V2 app
* Quick search for <File UUID> and go to its page
* Select file download button on the file summary page
* Is text "You don't have access to this file. Please login." present on the page
* Select "Close"
* Verify the table "File Properties File Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |<File UUID>                            |
    |<MD5 Checksum>                         |
    |<Access>                               |
* Verify the table "File Versions File Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |<Current Version>                      |
    |<Release Date>                         |
    |<Release Number>                       |
