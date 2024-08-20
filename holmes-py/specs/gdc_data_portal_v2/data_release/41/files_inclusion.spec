# Data Release: 41 - File Inclusion
Date Created        : 08/20/2024
Version			    : 1.0
Owner		        : GDC QA
Description		    : Files Introduced in DR-41
Test-Case           : PEAR-1928

tags: gdc-data-portal-v2, data-release

## File Introduced in this Data Release - Controlled Access
* On GDC Data Portal V2 app
* Quick search for "407f3d17-c0d0-49b7-9451-2452cdf4559c" and go to its page
* Select file download button on the file summary page
* Is text "You don't have access to this file. Please login." present on the page
* Select "Close"
* Verify the table "File Properties File Summary" is displaying this information
  |text_to_validate                       |
  |---------------------------------------|
  |407f3d17-c0d0-49b7-9451-2452cdf4559c   |
  |043c421d89044c2553d952d5dd164b32       |
  |controlled                             |
* Verify the table "File Versions File Summary" is displaying this information
  |text_to_validate                                   |
  |---------------------------------------------------|
  |407f3d17-c0d0-49b7-9451-2452cdf4559cCurrent Version|
  |41.0                                               |

## File Introduced in this Data Release - Open Access
* On GDC Data Portal V2 app
* Quick search for "431fae1b-f3ea-4b47-b49f-9c909d87d4de" and go to its page
* Download "File" from "File Summary"
* Read metadata from compressed "File from File Summary"
* Verify that "File from File Summary" has expected information
  |required_info                          |
  |---------------------------------------|
  |431fae1b-f3ea-4b47-b49f-9c909d87d4de   |
  |e9b6a300bca391f298c90b46dd462aa0       |
  |50836                                  |
* Verify the table "File Properties File Summary" is displaying this information
  |text_to_validate                       |
  |---------------------------------------|
  |431fae1b-f3ea-4b47-b49f-9c909d87d4de   |
  |e9b6a300bca391f298c90b46dd462aa0       |
  |open                                   |
* Verify the table "File Versions File Summary" is displaying this information
  |text_to_validate                                   |
  |---------------------------------------------------|
  |431fae1b-f3ea-4b47-b49f-9c909d87d4deCurrent Version|
  |41.0                                               |
