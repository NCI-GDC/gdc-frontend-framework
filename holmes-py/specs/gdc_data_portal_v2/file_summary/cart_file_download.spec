# File Summary - File Download
Date Created    : 03/01/2023
Version			    : 1.0
Owner		        : GDC QA
Description		  : Add and Remove from cart, download file
Test-Case       : PEAR-540

tags: gdc-data-portal-v2, file-summary, cart, file-download, smoke-test

## File Summary Page - Navigate to a file summary page
* On GDC Data Portal V2 app
* Quick search for "ea806d2a-6b37-4af2-a8eb-d92d5720b02f" and go to its page

## File Summary Page - add to cart
* Add file to cart on the file summary page

## File Summary Page - remove from cart
* Remove file from cart on the file summary page

## File Summary Page - download file
* Download "File" from "File Summary"
* Read metadata from compressed "File from File Summary"
* Verify that "File from File Summary" has expected information
  |required_info                          |
  |---------------------------------------|
  |ea806d2a-6b37-4af2-a8eb-d92d5720b02f   |
  |8c09e09fafbcedff64b6cb7151332ff1       |
  |50220                                  |
Checks the UUID, MD5 Checksum, and file size values in the metadata file
