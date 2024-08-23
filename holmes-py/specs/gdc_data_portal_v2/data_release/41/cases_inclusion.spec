# Data Release: 41 - Cases Inclusion
Date Created        : 08/20/2024
Version			    : 1.0
Owner		        : GDC QA
Description		    : Cases Introduced in DR-41
Test-Case           : PEAR-1929

tags: gdc-data-portal-v2, data-release

## Case Introduced in this Data Release: MATCH-Z1B-B5PE
* On GDC Data Portal V2 app
* Quick search for "49c27916-c258-420a-85da-b827aa3769de" and go to its page
* Add all files to cart on the case summary page
* Is text "Added 27 files to the cart." present on the page
* Remove all files from cart on the case summary page
* Is text "Removed 27 files from the cart." present on the page
* Verify the table "Summary Case Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |49c27916-c258-420a-85da-b827aa3769de   |
    |MATCH-Z1B-B5PE                         |
    |Bronchus and lung                      |

## Case Introduced in this Data Release: C207624
* On GDC Data Portal V2 app
* Quick search for "a05cf25f-dc52-4d99-9a8c-9178f17c99fa" and go to its page
* Add all files to cart on the case summary page
* Is text "Added 113 files to the cart." present on the page
* Remove all files from cart on the case summary page
* Is text "Removed 113 files from the cart." present on the page
* Verify the table "Summary Case Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |a05cf25f-dc52-4d99-9a8c-9178f17c99fa   |
    |C207624                                |
    |Gliomas                                |
