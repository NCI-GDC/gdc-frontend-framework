# Case Summary - Save Edit Mutation Set
Date Created        : 03/13/2025
Version			        : 1.0
Owner		            : GDC QA
Description		      : Most Frequent Somatic Mutations Table - Save/Edit Mutation Set
Test-Case           : PEAR-464

tags: gdc-data-portal-v2, regression, case-summary, mutations

## Navigate to Case Summary Page: 3ea880f4-7a78-4cb7-bfe4-54b3c30a812e
* On GDC Data Portal V2 app
* Quick search for "3ea880f4-7a78-4cb7-bfe4-54b3c30a812e" and go to its page
* Pause "3" seconds

## Save Mutation Set
* Select value from table "Most Frequent Somatic Mutations" by row and column
  |row   |column|
  |------|------|
  |1     |1     |
  |2     |1     |
  |3     |1     |
  |4     |1     |
  |5     |1     |
* Select "Save/Edit Mutation Set"
* Select "Save as new mutation set" from dropdown menu
* Enter "Case Summary - Save/Edit Mutation Set" in the text box "Set Name"
* Select button "Save"
* Is temporary modal with text "Set has been saved." present on the page and "Remove Modal"

## Add to Existing Set - Rejection
* Select value from table "Most Frequent Somatic Mutations" by row and column
  |row   |column|
  |------|------|
  |3     |1     |
  |4     |1     |
  |5     |1     |
* Select "Save/Edit Mutation Set"
* Select "Add to existing mutation set" from dropdown menu
* Change number of entries shown in the table "Select Set" to "100"
* Verify the button "Save" is disabled
* Select the radio button "Case Summary - Save/Edit Mutation Set"
* Verify the set "Case Summary - Save/Edit Mutation Set" displays a count of "5" in Modal
* Is text "All mutations are already in the set." present on the page
* Verify the button "Save" is disabled
* Select "Cancel"

## Add to Existing Set - Confirmation
* Select value from table "Most Frequent Somatic Mutations" by row and column
  |row   |column|
  |------|------|
  |6     |1     |
* Select "Save/Edit Mutation Set"
* Select "Add to existing mutation set" from dropdown menu
* Change number of entries shown in the table "Select Set" to "100"
* Select the radio button "Case Summary - Save/Edit Mutation Set"
* Select button "Save"
* Is temporary modal with text "Set has been modified." present on the page and "Remove Modal"

## Remove from Existing Set - Partial
* Select value from table "Most Frequent Somatic Mutations" by row and column
  |row   |column|
  |------|------|
  |1     |1     |
  |2     |1     |
  |6     |1     |
  |3     |1     |
  |4     |1     |
  |5     |1     |
  |7     |1     |
* Select "Save/Edit Mutation Set"
* Select "Remove from existing mutation set" from dropdown menu
* Change number of entries shown in the table "Select Set" to "100"
* Select the radio button "Case Summary - Save/Edit Mutation Set"
* Verify the set "Case Summary - Save/Edit Mutation Set" displays a count of "6" in Modal
* Select button "Save"
* Is temporary modal with text "Set has been modified." present on the page and "Remove Modal"

## Remove from Existing Set - All
 * Select value from table "Most Frequent Somatic Mutations" by row and column
  |row   |column|
  |------|------|
  |3     |1     |
  |4     |1     |
  |5     |1     |
  |7     |1     |
  |1     |1     |
  |2     |1     |
  |6     |1     |
* Select "Save/Edit Mutation Set"
* Select "Remove from existing mutation set" from dropdown menu
* Change number of entries shown in the table "Select Set" to "100"
* Select the radio button "Case Summary - Save/Edit Mutation Set"
* Verify the set "Case Summary - Save/Edit Mutation Set" displays a count of "3" in Modal
* Select button "Save"
* Is temporary modal with text "Set has been modified." present on the page and "Remove Modal"

* Select "Save/Edit Mutation Set"
* Select "Remove from existing mutation set" from dropdown menu
* Change number of entries shown in the table "Select Set" to "100"
* Verify the set "Case Summary - Save/Edit Mutation Set" displays a count of "0" in Modal
* Select "Cancel"
