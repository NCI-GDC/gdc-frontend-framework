# Data Release - File Exclusion
Date Created        : 08/04/2024
Version			    : 1.0
Owner		        : GDC QA
Description		    : File Exclusion in Data Release
Test-Case           : PEAR-1928

tags: gdc-data-portal-v2, data-release

table: resources/data_release/file_exclusion.csv

## File Excluded in this Data Release
* On GDC Data Portal V2 app
* Quick search for <Old File UUID>
* Validate the quick search bar result in position "1" of the result list has the text <Expected Search Text>
* Select the quick search bar result in position "1"
* Is text <New File Name> present on the page
* Verify the table "File Properties File Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |<New File UUID>                        |
    |<MD5 Checksum>                         |
    |<Access>                               |
* Verify the table "File Versions File Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |<Old File UUID>                        |
    |<Old Release Date>                     |
    |<Old Release Number>                   |
    |<Current Version>                      |
    |<Release Date>                         |
    |<Release Number>                       |
