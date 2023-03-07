# Case Summary - Add and Remove from Cart, Download File
Date Created    : 03/07/2023
Version			    : 1.0
Owner		        : GDC QA
Description		  : Add and Remove from cart, download file
Test-Case       : N/A

tags: gdc-data-portal-v2, case-summary, cart, file-download

## Case Summary Page - Navigate to a case summary page
* On GDC Data Portal V2 app
* Quick search for "29eb55e1-2cc9-4d9e-8210-e312046d13fc" and go to its page

## Case Summary Page - add to cart
* Add all files to cart on the case summary page

## Case Summary Page - remove from cart
* Remove all files from cart on the case summary page

## Case Summary Page - download file
* Download "File" from "Case Summary Biospecimen Supplement First File"
* Read metadata from compressed "File from Case Summary Biospecimen Supplement First File"
* Verify that "File from Case Summary Biospecimen Supplement First File" has expected information
  |required_info                          |
  |---------------------------------------|
  |ea806d2a-6b37-4af2-a8eb-d92d5720b02f   |
  |8c09e09fafbcedff64b6cb7151332ff1       |
  |50220                                  |
Checks the UUID, MD5 Checksum, and file size values in the metadata file
