# Download Center - Add All and Remove All Files
Date Created    : 05/01/2023
Version			 : 1.0
Owner		       : GDC QA
Description		 : Test Repository Add all files and Remove all files buttons

tags: gdc-data-portal-v2, repository, regression

## Navigate to Repository Page
* On GDC Data Portal V2 app
* Navigate to "Downloads" from "Header" "section"

## Cannot add more than 10,000 files to the cart
* Select "Add All" on the Repository page
* Is modal with text "The cart is limited to 10,000" present on the page
* Make the following selections on a filter card on the Repository page
  |facet_name       |selection                    |
  |-----------------|-----------------------------|
  |Data Type        |Allele-specific Copy Number Segment |
* Make the following selections on a filter card on the Repository page
  |facet_name       |selection                    |
  |-----------------|-----------------------------|
  |Data Type        |Allele-specific Copy Number Segment |
* Make the following selections on a filter card on the Repository page
  |facet_name       |selection                    |
  |-----------------|-----------------------------|
  |Data Type        |Allele-specific Copy Number Segment |
* Perform the following actions on a filter card on the Repository page
   |facet_name       |action               |
  |-----------------|---------------------|
  |Data Type |clear selection      |
* Pause "2" seconds
