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
* Search "a615d1d8-38ab-4d51-bf1d-f4c3c97a5de1" in the files table on the case summary page
* Download "File" from "Case Summary Files Table"
* Read metadata from compressed "File from Case Summary Files Table"
* Verify that "File from Case Summary Files Table" has expected information
  |required_info                          |
  |---------------------------------------|
  |a615d1d8-38ab-4d51-bf1d-f4c3c97a5de1   |
  |a8c5db169c6088dd308eb73e368a7cd2       |
  |116284                                 |
Checks the UUID, MD5 Checksum, and file size values in the metadata file
