# Cart - Download Cart Options
Date Created    : 10/25/2024
Version			: 1.0
Owner		    : GDC QA
Description		: Manifest and Download Cart
Test-Case       : PEAR-2246
tags: gdc-data-portal-v2, regression, cart

## Add Files to Cart
* On GDC Data Portal V2 app
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

## Validate Mixed Cart Download
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
* Verify that "Download 4 Authorized Files from Cart Header" does not contain specified information
    |required_info                          |
    |---------------------------------------|
    |ce9cc0e6-78e5-448d-b395-006ea93c7be2   |

## Remove Files from Cart
* Remove "All Files" from cart on the Cart page
* Is text "Your cart is empty." present on the page
