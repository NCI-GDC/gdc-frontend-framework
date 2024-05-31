# Data Release: 40 - File Inclusion
Date Created        : 05/28/2024
Version			    : 1.0
Owner		        : GDC QA
Description		    : Files Introduced in DR-40
Test-Case           : PEAR-1928

tags: gdc-data-portal-v2, data-release

## File Introduced in this Data Release
* On GDC Data Portal V2 app
* Quick search for "bcc10436-c964-4597-93d9-da1e4013be76" and go to its page
* Select file download button on the file summary page
* Is text "You don't have access to this file. Please login." present on the page
* Select "Close"
* Validate text is present in table "File Properties" on the file summary page
    |text_to_validate                       |
    |---------------------------------------|
    |bcc10436-c964-4597-93d9-da1e4013be76   |
    |1c525454405c23de56474349c01243e5       |
    |controlled                             |
* Validate text is present in table "File Versions" on the file summary page
    |text_to_validate                                       |
    |-------------------------------------------------------|
    |bcc10436-c964-4597-93d9-da1e4013be76Current Version    |
    |2024-03-29                                             |
    |	40.0                                                |
