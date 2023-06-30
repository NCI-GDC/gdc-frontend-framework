# Repository Page - Add and Remove Files from Table
Date Created   : 05/03/2023
Version			   : 1.0
Owner		       : GDC QA
Description		 : Repository Add and Remove Individual Files From the Table
Test-Case      : PEAR-466, PEAR-471

tags: gdc-data-portal-v2, repository, regression, smoke

## Navigate to Repository Page
* On GDC Data Portal V2 app
* Navigate to "Downloads" from "Header" "section"

## Add Files from the Table
* Select value from table by row and column
  |row|column|
  |------|---|
  |1     |1  |
* Is modal with text "Added" present on the page and "Keep Modal"
* Select value from table by row and column
  |row|column|
  |------|---|
  |2     |1  |
  |3     |1  |
  |4     |1  |
  |5     |1  |
  |6     |1  |
  |7     |1  |
  |8     |1  |
  |9     |1  |
  |10    |1  |
  |11    |1  |
  |12    |1  |
  |13    |1  |
  |14    |1  |
  |15    |1  |
  |16    |1  |
* The cart should have "16" files

## Remove Files from the Table
* Select value from table by row and column
  |row|column|
  |------|---|
  |1     |1  |
* Is modal with text "Removed" present on the page and "Keep Modal"
* Select value from table by row and column
  |row|column|
  |------|---|
  |2     |1  |
  |3     |1  |
  |4     |1  |
  |5     |1  |
  |6     |1  |
  |7     |1  |
  |8     |1  |
  |9     |1  |
  |10    |1  |
  |11    |1  |
  |12    |1  |
  |13    |1  |
  |14    |1  |
  |15    |1  |
  |16    |1  |
* The cart should have "0" files

## Remove All individually added files
* Select value from table by row and column
  |row|column|
  |------|---|
  |17    |1  |
  |18    |1  |
  |19    |1  |
  |20    |1  |
* The cart should have "4" files
* Select "Remove All" on the Repository page
* Is modal with text "Removed 4 files from the cart." present on the page and "Keep Modal"
* The cart should have "0" files
