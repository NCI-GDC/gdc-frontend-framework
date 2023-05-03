# Repository Page - Add All and Remove All Files
Date Created   : 05/01/2023
Version			   : 1.0
Owner		       : GDC QA
Description		 : Test Repository Add All Files and Remove All Files buttons

tags: gdc-data-portal-v2, repository, regression

## Navigate to Repository Page
* On GDC Data Portal V2 app
* Navigate to "Downloads" from "Header" "section"

## Cannot add more than 10,000 files to the cart
* Select "Add All" on the Repository page
* Is modal with text "The cart is limited to 10,000" present on the page
* Expand or contract a filter on the Repository page
  |facet_name       |label                |
  |-----------------|---------------------|
  |Data Type        |plus-icon            |
* Make the following selections on a filter card on the Repository page
  |facet_name       |selection                            |
  |-----------------|-------------------------------------|
  |Data Type        |Allele-specific Copy Number Segment  |
* Select "Add All" on the Repository page
* Is modal with text "The cart is limited to 10,000" present on the page
* Select "Remove All" on the Repository page
* Is modal with text "Removed 0 files from the cart." present on the page
* Make the following selections on a filter card on the Repository page
  |facet_name       |selection                            |
  |-----------------|-------------------------------------|
  |Data Type        |Allele-specific Copy Number Segment  |

## Add All Files and Remove All Files buttons
* Expand or contract a filter on the Repository page
  |facet_name             |label                |
  |-----------------------|---------------------|
  |Experimental Strategy  |plus-icon            |
* Make the following selections on a filter card on the Repository page
  |facet_name             |label                |
  |-----------------------|---------------------|
  |Experimental Strategy  |scRNA-Seq            |
* Select "Add All" on the Repository page
* Is modal with text "files to the cart" present on the page
* Select "Add All" on the Repository page
* Is modal with text "Added 0 files to the cart" present on the page
* Select "Remove All" on the Repository page
* Is modal with text "files from the cart." present on the page
* Select "Remove All" on the Repository page
* Is modal with text "Removed 0 files from the cart." present on the page
* Make the following selections on a filter card on the Repository page
  |facet_name             |label                |
  |-----------------------|---------------------|
  |Experimental Strategy  |scRNA-Seq            |
