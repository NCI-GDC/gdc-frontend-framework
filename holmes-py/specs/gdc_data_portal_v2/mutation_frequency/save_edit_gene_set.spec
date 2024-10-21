# Mutation Frequency - Save/Edit Gene Set
Date Created   : 10/21/2024
Version			   : 1.0
Owner		       : GDC QA
Description		 : Save/Edit Gene Button
Test-Case      : PEAR-2236

tags: gdc-data-portal-v2, regression, mutation-frequency, manage-sets

## Navigate to Mutation Frequency App
* On GDC Data Portal V2 app
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Mutation Frequency" from "Analysis" "app"

## Save Gene Set
* Flip the switch on filter card "Is Cancer Gene Census"
* Wait for table loading spinner
* In table "Genes", search the table for "MUC1"
* Wait for table "Genes" body text to appear
  |expected_text        |row  |column |
  |---------------------|-----|-------|
  |MUC16                |1    |4      |
* Select value from table "Genes" by row and column
  |row   |column|
  |------|------|
  |1     |1     |
  |2     |1     |
  |3     |1     |
  |4     |1     |
  |5     |1     |
* Select "Save/Edit Gene Set"
* Select "Save as new gene set" from dropdown menu
* Enter "MF - Save/Edit Gene Set" in the text box "Set Name"
* Select button "Save"
* Is temporary modal with text "Set has been saved." present on the page and "Remove Modal"

## Add to Existing Set - Rejection
* Select value from table "Genes" by row and column
  |row   |column|
  |------|------|
  |3     |1     |
  |4     |1     |
  |5     |1     |
* Select "Save/Edit Gene Set"
* Select "Add to existing gene set" from dropdown menu
* Change number of entries shown in the table "Select Set" to "100"
* Verify the button "Save" is disabled
* Select the radio button "MF - Save/Edit Gene Set"
* Verify the set "MF - Save/Edit Gene Set" displays a count of "5" in Modal
* Is text "All genes are already in the set." present on the page
* Verify the button "Save" is disabled
* Select "Cancel"

## Add to Existing Set - Confirmation
* Select value from table "Genes" by row and column
  |row   |column|
  |------|------|
  |6     |1     |
* Select "Save/Edit Gene Set"
* Select "Add to existing gene set" from dropdown menu
* Change number of entries shown in the table "Select Set" to "100"
* Select the radio button "MF - Save/Edit Gene Set"
* Select button "Save"
* Is temporary modal with text "Set has been modified." present on the page and "Remove Modal"

## Remove from Existing Set - Partial
* Select value from table "Genes" by row and column
  |row   |column|
  |------|------|
  |1     |1     |
  |2     |1     |
  |6     |1     |
  |3     |1     |
  |4     |1     |
  |5     |1     |
  |7     |1     |
* Select "Save/Edit Gene Set"
* Select "Remove from existing gene set" from dropdown menu
* Change number of entries shown in the table "Select Set" to "100"
* Select the radio button "MF - Save/Edit Gene Set"
* Verify the set "MF - Save/Edit Gene Set" displays a count of "6" in Modal
* Select button "Save"
* Is temporary modal with text "Set has been modified." present on the page and "Remove Modal"

## Remove from Existing Set - All
 * Select value from table "Genes" by row and column
  |row   |column|
  |------|------|
  |3     |1     |
  |4     |1     |
  |5     |1     |
  |7     |1     |
  |1     |1     |
  |2     |1     |
  |6     |1     |
* Select "Save/Edit Gene Set"
* Select "Remove from existing gene set" from dropdown menu
* Change number of entries shown in the table "Select Set" to "100"
* Select the radio button "MF - Save/Edit Gene Set"
* Verify the set "MF - Save/Edit Gene Set" displays a count of "3" in Modal
* Select button "Save"
* Is temporary modal with text "Set has been modified." present on the page and "Remove Modal"

* Select "Save/Edit Gene Set"
* Select "Remove from existing gene set" from dropdown menu
* Change number of entries shown in the table "Select Set" to "100"
* Verify the set "MF - Save/Edit Gene Set" displays a count of "0" in Modal
* Select "Cancel"
