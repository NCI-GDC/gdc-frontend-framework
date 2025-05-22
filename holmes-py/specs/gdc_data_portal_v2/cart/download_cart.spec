# Cart - Download Cart Options
Date Created    : 10/25/2024
Version			    : 1.0
Owner		        : GDC QA
Description		  : Manifest and Download Cart
Test-Case       : PEAR-2246

tags: gdc-data-portal-v2, regression, cart


## Remove Any Files From Cart
* On GDC Data Portal V2 app
* Navigate to "Cart" from "Header" "section"
* Remove "All Files" from cart on the Cart page
* Is text "Your cart is empty." present on the page

## Add Files to Cart
* Navigate to "Downloads" from "Header" "section"
* Add the following files to the cart on the Repository page
  |file_uuid_to_add                     |
  |-------------------------------------|
  |79ab390d-a0e5-48fd-bb02-1a2f0f4d66c7 |
  |d44f5813-c524-406f-91f3-9201dd170341 |
  |9c0e3c5c-fae2-46e6-9fa3-f50f38459e33 |
  |a7aae2a5-3abf-452a-9c0c-8bf4a6deb34c |
  |ce9cc0e6-78e5-448d-b395-006ea93c7be2 |
  |19e8f6a9-f8c6-4343-af12-86a3c5e28694 |
  |07a438c5-f83f-411b-ae25-a1c5fc34dbdc |
  |3d67242c-cf58-47d0-9e02-48d770efbe98 |
  |2de8c412-a56a-46eb-891c-2ef83c7fe0fd |
  |fe3e912a-a0bf-49e7-97a3-0df8cc21d751 |

## Download Manifest
* Navigate to "Cart" from "Header" "section"
* Select "Download Cart" on the Cart page
* Download "Manifest" from "Cart Header"
* Read from "Manifest from Cart Header"
* Verify that "Manifest from Cart Header" has expected information
    |required_info                          |
    |---------------------------------------|
    |id                                     |
    |filename                               |
    |md5                                    |
    |size                                   |
    |state                                  |
    |fe3e912a-a0bf-49e7-97a3-0df8cc21d751   |
    |a7aae2a5-3abf-452a-9c0c-8bf4a6deb34c   |
    |3d67242c-cf58-47d0-9e02-48d770efbe98   |
    |2de8c412-a56a-46eb-891c-2ef83c7fe0fd   |
    |07a438c5-f83f-411b-ae25-a1c5fc34dbdc   |
    |79ab390d-a0e5-48fd-bb02-1a2f0f4d66c7   |
    |857ce186645d12ea8c66ccb55662b81d       |
    |FM-AD_Biospecimen.Rectum.tsv           |
    |25559                                  |
    |e6dc58c715f28acede37e94709f9aed5       |
    |released                               |

## Mixed Access Cart Download
* Select "Download Cart" on the Cart page
* Select "Cart" from dropdown menu
* Is text "You are attempting to download files that you are not authorized to access." present on the page
* Is text "4 files that you are authorized to download." present on the page
* Is text "6 files that you are not authorized to download." present on the page
* Is text "Please request dbGaP Access to the project (click here for more information)." present on the page
* Download "Download 4 Authorized Files" from "Cart Header"
* Read file content from compressed "Download 4 Authorized Files from Cart Header"
* Verify that "Download 4 Authorized Files from Cart Header" has expected information
    |required_info                          |
    |---------------------------------------|
    |fe3e912a-a0bf-49e7-97a3-0df8cc21d751   |
    |a7aae2a5-3abf-452a-9c0c-8bf4a6deb34c   |
    |79ab390d-a0e5-48fd-bb02-1a2f0f4d66c7   |
    |19e8f6a9-f8c6-4343-af12-86a3c5e28694   |
    |hsa-mir-103a-1                         |
    |hsa-mir-7151                           |
    |259.446613                             |
    |54c5412-2d12-4229-b2d2-f91d63eb2363    |
    |114077167                              |
    |f5e221dd-f1b2-435e-9ab6-300d2abd39c1   |
    |6a1d5c68-a949-4708-9b58-ac91ace26789   |
* Verify that "Download 4 Authorized Files from Cart Header" does not contain specified information
    |required_info                          |
    |---------------------------------------|
    |ce9cc0e6-78e5-448d-b395-006ea93c7be2   |
    |3d67242c-cf58-47d0-9e02-48d770efbe98   |
    |2de8c412-a56a-46eb-891c-2ef83c7fe0fd   |
    |07a438c5-f83f-411b-ae25-a1c5fc34dbdc   |
    |d44f5813-c524-406f-91f3-9201dd170341   |
    |9c0e3c5c-fae2-46e6-9fa3-f50f38459e33   |

## Only Open Access Cart Download
Messages can pile up here. Wait for everything to go away before continuing the test.
* Pause "5" seconds
* Remove "Unauthorized Files" from cart on the Cart page
* Is temporary modal with text "Removed 6 files from the cart." present on the page and "Keep Modal"
* Select "Download Cart" on the Cart page
* Download "Cart" from "Cart Header Dropdown"
* Read file content from compressed "Cart from Cart Header Dropdown"
* Verify that "Cart from Cart Header Dropdown" has expected information
    |required_info                          |
    |---------------------------------------|
    |fe3e912a-a0bf-49e7-97a3-0df8cc21d751   |
    |a7aae2a5-3abf-452a-9c0c-8bf4a6deb34c   |
    |79ab390d-a0e5-48fd-bb02-1a2f0f4d66c7   |
    |19e8f6a9-f8c6-4343-af12-86a3c5e28694   |
    |hsa-mir-103a-1                         |
    |hsa-mir-7151                           |
    |259.446613                             |
    |54c5412-2d12-4229-b2d2-f91d63eb2363    |
    |114077167                              |
    |f5e221dd-f1b2-435e-9ab6-300d2abd39c1   |
    |6a1d5c68-a949-4708-9b58-ac91ace26789   |
* Verify that "Cart from Cart Header Dropdown" does not contain specified information
    |required_info                          |
    |---------------------------------------|
    |ce9cc0e6-78e5-448d-b395-006ea93c7be2   |
    |3d67242c-cf58-47d0-9e02-48d770efbe98   |
    |2de8c412-a56a-46eb-891c-2ef83c7fe0fd   |
    |07a438c5-f83f-411b-ae25-a1c5fc34dbdc   |
    |d44f5813-c524-406f-91f3-9201dd170341   |
    |9c0e3c5c-fae2-46e6-9fa3-f50f38459e33   |

## Only Controlled Access Download
* Remove "All Files" from cart on the Cart page
* Pause "2" seconds
* Remove message if one is present
* Navigate to "Downloads" from "Header" "section"
* Add the following files to the cart on the Repository page
  |file_uuid_to_add                     |
  |-------------------------------------|
  |8dd349c8-f6e5-4454-bc58-45bf48cb4107 |
  |0adbee70-c4a6-4320-a57b-66f268735e9d |
  |0a68a44f-3c32-42c7-843e-cb9d132f8d64 |
  |ca4d1994-5f01-4202-a6b6-ce897c2f4358 |
  |19e8c827-9d47-494b-9487-0286af531ed4 |
* Navigate to "Cart" from "Header" "section"
* Select "Download Cart" on the Cart page
* Select "Cart" from dropdown menu
* Is text "0 files that you are authorized to download." present on the page
* Is text "5 files that you are not authorized to download." present on the page
* Verify the button with displayed text "Download 0 Authorized Files" is disabled
* Select "Cancel"

## Cart Over 5GB in Size
* Remove "All Files" from cart on the Cart page
* Is temporary modal with text "Removed 5 files from the cart." present on the page and "Remove Modal"
* Navigate to "Downloads" from "Header" "section"
* Add the following files to the cart on the Repository page
  |file_uuid_to_add                     |
  |-------------------------------------|
  |f2371cee-3e29-4901-a93f-74038e1797a1 |
  |4ded7d54-5c43-4b03-aecd-14fc4499a567 |
  |cf5450df-6e51-4baf-9c59-811e9d81f43a |
* Navigate to "Cart" from "Header" "section"
* Select "Download Cart" on the Cart page
* Select "Cart" from dropdown menu
* Is text "Access Alert" present on the page
* Is text "Your cart contains more than 5 GBs of data." present on the page
* Is text "Please select the \"Download > Manifest\" option and use the Data Transfer Tool to download the files in your cart." present on the page
* Select "Accept"

## Remove Files from Cart
* Remove "All Files" from cart on the Cart page
* Is text "Your cart is empty." present on the page
