# Repository Page - Undo Add and Remove Files
Date Created    : 05/04/2023
Version			    : 1.0
Owner		        : GDC QA
Description		  : Undo Adding and Removing Files
Test-Case       : PEAR-462, PEAR-468

tags: gdc-data-portal-v2, repository, regression

## Navigate to Repository Page
* On GDC Data Portal V2 app
* Navigate to "Downloads" from "Header" "section"
* Wait for table loading spinner
* Wait for cohort bar case count loading spinner
* Pause "2" seconds
* Wait for cohort bar case count loading spinner

## Undo Adding File from Table
When selecting from the table and checking the message for the first time,
the automation may not "see" the message. I found selecting, de-selecting, then selecting
again solves the problem and automation can find the message.
* Select value from table by row and column
  |row|column|
  |------|---|
  |1     |1  |
  |1     |1  |
  |1     |1  |
* Pause "1" seconds
* Is modal with text "Added" present on the page and "Keep Modal"
* The cart should have "1" files
* Undo Action
* Is modal with text "Removed" present on the page and "Keep Modal"
* The cart should have "0" files

## Undo Removing File from Table
* Select value from table by row and column
  |row|column|
  |------|---|
  |2     |1  |
* Select value from table by row and column
  |row|column|
  |------|---|
  |2     |1  |
* Is modal with text "Removed" present on the page and "Keep Modal"
* The cart should have "0" files
* Undo Action
* Is modal with text "Added" present on the page and "Keep Modal"
* The cart should have "1" files
Reset the cart to 0 for future tests
* Undo Action
* The cart should have "0" files

A separate specification ensures the cart has 0 files
## Remove All Files from Cart
* Select "Remove All" on the Repository page
* The cart should have "0" files
