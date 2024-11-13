# Cart - Miscellaneous Scenarios
Date Created        : 10/24/2024
Version			    : 1.0
Owner		        : GDC QA
Description		    : Instructions Description and Empty Cart Page
Test-Case           : PEAR-2245

tags: gdc-data-portal-v2, regression, cart

## Add Files to Cart
* On GDC Data Portal V2 app
* Navigate to "Downloads" from "Header" "section"
* Add the following files to the cart on the Repository page
  |file_uuid_to_add                     |
  |-------------------------------------|
  |eb2953ae-792d-425c-8616-ef1308d1f56e |

## Instructions Table
* Navigate to "Cart" from "Header" "section"
* Select "How To Download Files" on the Cart page
* Is text "Download a manifest for use with the  GDC Data Transfer Tool. The GDC Data Transfer Tool is recommended for transferring large volumes of data." present on the page
* Is text "Download Files in your Cart directly from the Web Browser." present on the page
* Is text "Download  GDC Reference Files for use in your genomic data analysis." present on the page
* These links on the "Cart" should take the user to correct page in a new tab
  |button_text                                |text_on_expected_page                                    |
  |-------------------------------------------|---------------------------------------------------------|
  |GDC Data Transfer Tool                     |The GDC Data Transfer Tool provides an optimized method  |
  |GDC Reference Files                        |Reference files used by the GDC data harmonization       |

## No Files in Cart Message
* Remove "All Files" from cart on the Cart page
* Is text "Your cart is empty." present on the page
