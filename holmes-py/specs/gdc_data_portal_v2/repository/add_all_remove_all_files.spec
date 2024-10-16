# Repository Page - Add All and Remove All Files
Date Created   : 05/01/2023
Version			   : 1.0
Owner		       : GDC QA
Description		 : Test Repository Add All Files and Remove All Files buttons
Test-Case      : PEAR-461, PEAR-473

tags: gdc-data-portal-v2, repository, regression

## Navigate to Repository Page
* On GDC Data Portal V2 app
* Navigate to "Downloads" from "Header" "section"

## Cannot add more than 10,000 files to the cart
* Select "Add All" on the Repository page
* Is modal with text "The cart is limited to 10,000" present on the page and "Remove Modal"
* The cart should have "0" files
* Make the following selections on a filter card
  |facet_name       |selection                            |
  |-----------------|-------------------------------------|
  |Data Type        |Allele-specific Copy Number Segment  |
* Select "Add All" on the Repository page
* Is modal with text "The cart is limited to 10,000" present on the page and "Remove Modal"
* The cart should have "0" files
* Select "Remove All" on the Repository page
* Is modal with text "Removed 0 files from the cart." present on the page and "Remove Modal"

## Add All Files and Remove All Files buttons
* Perform the following actions on a filter card
  |filter_name      |action               |
  |-----------------|---------------------|
  |Data Type        |clear selection      |
* Make the following selections on a filter card
  |facet_name             |label                |
  |-----------------------|---------------------|
  |Workflow Type          |VCF LiftOver         |
* Select "Add All" on the Repository page
* Is modal with text "files to the cart" present on the page and "Keep Modal"
* Select "Add All" on the Repository page
* Is modal with text "Added 0 files to the cart" present on the page and "Remove Modal"
* Select "Remove All" on the Repository page
* Is modal with text "files from the cart." present on the page and "Keep Modal"
* The cart should have "0" files
* Select "Remove All" on the Repository page
* Is modal with text "Removed 0 files from the cart." present on the page and "Remove Modal"
* Make the following selections on a filter card
  |facet_name             |label                |
  |-----------------------|---------------------|
  |Workflow Type          |VCF LiftOver         |

A separate specification ensures the cart has 0 files
## Remove All Files from Cart
* Perform the following actions on a filter card
  |filter_name      |action               |
  |-----------------|---------------------|
  |Workflow Type    |clear selection      |
* Select "Remove All" on the Repository page
* The cart should have "0" files
