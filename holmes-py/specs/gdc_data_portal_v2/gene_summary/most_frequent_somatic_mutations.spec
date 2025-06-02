# Gene Summary - Most Frequent Somatic Mutations
Date Created  : 12/17/2024
Version			  : 1.0
Owner		      : GDC QA
Description		: Validate Most Frequent Somatic Mutations Table
Test-Case     : PEAR-2286

tags: gdc-data-portal-v2, regression, gene-summary

## Navigate to Gene Summary Page: RDH14
* On GDC Data Portal V2 app
* Quick search for "RDH14" and go to its page

## Validate Table: Most Frequent Somatic Mutations
* In table "Most Frequent Somatic Mutations", search the table for "RDH14 A290T"
* Wait for table "Most Frequent Somatic Mutations" body text to appear
    |expected_text                                        |row  |column |
    |-----------------------------------------------------|-----|-------|
    |chr2:g.18555334C>T                                   |1    |2      |
* In table "Most Frequent Somatic Mutations" select or deselect these options from the table column selector
    |table_column_to_select                 |
    |---------------------------------------|
    |Mutation ID                            |
* Verify the table "Most Frequent Somatic Mutations" header text is correct
    |expected_text                          |column |
    |---------------------------------------|-------|
    |Mutation ID                            |2      |
    |DNA Change                             |3      |
    |Protein Change                         |4      |
    |Type                                   |5      |
    |Consequences                           |6      |
    |# Affected Cases in RDH14              |7      |
    |# Affected Cases Across the GDC        |8      |
    |Impact                                 |9      |
* Verify the table "Most Frequent Somatic Mutations" body text is correct
    |expected_text                          |row  |column |
    |---------------------------------------|-----|-------|
    |156884b3-e99e-5a12-855b-e1e7956fcc3c   |1    |2      |
    |chr2:g.18555334C>T                     |1    |3      |
    |RDH14A290T                             |1    |4      |
    |Substitution                           |1    |5      |
    |Missense                               |1    |6      |


## Most Frequent Somatic Mutations: TSV
* Download "TSV" from "Most Frequent Somatic Mutations"
* Read from "TSV from Most Frequent Somatic Mutations"
* Verify that "TSV from Most Frequent Somatic Mutations" has expected information
    |required_info                          |
    |---------------------------------------|
    |ssm_id                                 |
    |dna_change                             |
    |protein_change                         |
    |type                                   |
    |consequence                            |
    |num_ssm_affected_cases                 |
    |num_RDH14_cases                        |
    |ssm_affected_cases_percentage          |
    |num_gdc_ssm_affected_cases             |
    |num_gdc_ssm_cases                      |
    |gdc_ssm_affected_cases_percentage      |
    |vep_impact                             |
    |sift_impact                            |
    |sift_score                             |
    |polyphen_impact                        |
    |polyphen_score                         |
    |156884b3-e99e-5a12-855b-e1e7956fcc3c   |
    |chr2:g.18555334C>T                     |
    |RDH14 A290T                            |
    |Substitution                           |
    |Missense                               |
    |MODERATE                               |
    |deleterious                            |
    |probably_damaging                      |
* Verify that "TSV from Most Frequent Somatic Mutations" does not contain specified information
    |required_info                          |
    |---------------------------------------|
    |edcda9e3-59b2-5502-ba05-1c060e45db4a   |
    |chr2:g.18555401G>A                     |
    |RDH14 L226P                            |
    |Insertion                              |
    |Synonymous                             |
    |Frameshift                             |
    |ee5cf87d-4f0c-558f-98c9-9c259450ec2f   |
    |chr2:g.18555522A>C                     |

## Most Frequent Somatic Mutations: All In TSV
* In table "Most Frequent Somatic Mutations", search the table for ""
* Wait for table "Most Frequent Somatic Mutations" body text to appear
    |expected_text                                        |row  |column |
    |-----------------------------------------------------|-----|-------|
    |chr2:g.18555401G>A                                   |1    |3      |
* Download "TSV" from "Most Frequent Somatic Mutations"
* Read from "TSV from Most Frequent Somatic Mutations"
* Verify that "TSV from Most Frequent Somatic Mutations" has expected information
    |required_info                          |
    |---------------------------------------|
    |edcda9e3-59b2-5502-ba05-1c060e45db4a   |
    |chr2:g.18555401G>A                     |
    |RDH14 L226P                            |
    |Insertion                              |
    |Synonymous                             |
    |Frameshift                             |
    |ee5cf87d-4f0c-558f-98c9-9c259450ec2f   |
    |chr2:g.18555522A>C                     |
    |156884b3-e99e-5a12-855b-e1e7956fcc3c   |
    |chr2:g.18555334C>T                     |
    |RDH14 I71_M72del                       |
    |RDH14 P279=                            |
    |chr2:g.18560357delCATGAT               |

## Save New Cohort: # Affected Cases in RDH14
* Collect button labels in table for comparison
  |button_label                                     |row  |column |
  |-------------------------------------------------|-----|-------|
  |RDH14 L267= # Affected Cases in RDH14            |1    |7      |
* Select value from table "Most Frequent Somatic Mutations" by row and column
  |row   |column|
  |------|------|
  |1     |7     |
* Name the cohort "RDH14 L267= # Affected Cases in RDH14" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                                      |Keep or Remove Modal|
  |-----------------|---------------------------------------------------------------|--------------------|
  |Save             |RDH14 L267= # Affected Cases in RDH14 has been saved           |Remove Modal        |

* Navigate to "Analysis" from "Header" "section"
* Switch cohort to "RDH14 L267= # Affected Cases in RDH14" from the Cohort Bar dropdown list
* "RDH14 L267= # Affected Cases in RDH14" should be the active cohort
* Collect Cohort Bar Case Count for comparison
* Verify "Cohort Bar Case Count" and "RDH14 L267= # Affected Cases in RDH14" are "Equal"

## Navigate to Gene Summary Page: KMT2D
* Quick search for "KMT2D" and go to its page
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
* Enter "Gene Summary - Save/Edit Mutation Set" in the text box "Set Name"
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
* Select the radio button "Gene Summary - Save/Edit Mutation Set"
* Verify the set "Gene Summary - Save/Edit Mutation Set" displays a count of "5" in Modal
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
* Select the radio button "Gene Summary - Save/Edit Mutation Set"
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
* Select the radio button "Gene Summary - Save/Edit Mutation Set"
* Verify the set "Gene Summary - Save/Edit Mutation Set" displays a count of "6" in Modal
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
* Select the radio button "Gene Summary - Save/Edit Mutation Set"
* Verify the set "Gene Summary - Save/Edit Mutation Set" displays a count of "3" in Modal
* Select button "Save"
* Is temporary modal with text "Set has been modified." present on the page and "Remove Modal"

* Select "Save/Edit Mutation Set"
* Select "Remove from existing mutation set" from dropdown menu
* Change number of entries shown in the table "Select Set" to "100"
* Verify the set "Gene Summary - Save/Edit Mutation Set" displays a count of "0" in Modal
* Select "Cancel"
