# Data Release - File Inclusion Controlled Access
Date Created        :
Version			    : 1.0
Owner		        : GDC QA
Description		    :
Test-Case           : PEAR-1928

tags: gdc-data-portal-v2, data-release

table: resources/data_release/file_inclusion_open.csv

## File Introduced in this Data Release
* On GDC Data Portal V2 app
* Quick search for <File UUID> and go to its page
* Download "File" from "File Summary"
* Read metadata from compressed "File from File Summary"
* Verify that "File from File Summary" has expected information
    |required_info                          |
    |---------------------------------------|
    |<File UUID>                            |
    |<MD5 Checksum>                         |
    |<File Size>                            |
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
