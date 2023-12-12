# Manage Sets - Mutation
Date Created    : 11/13/2023
Version	        : 1.0
Owner		    : GDC QA
Description		: Mutation Set - Create, Edit, Download, Delete
Test-Case       : PEAR-1619

tags: gdc-data-portal-v2, manage-sets, regression

## Navigate to Mutation Frequency App
* On GDC Data Portal V2 app
* Navigate to "Manage Sets" from "Header" "section"

## Create Mutation Set
* Select Create Set and from the dropdown choose "Mutations"
* Upload "Most Frequent Mutations" "tsv" from "Manage Sets" in "Manage Sets Import" through "Browse"
* Is text "20 submitted mutation identifiers mapped to 20 unique GDC mutations" present on the page
* Select "Submit"
* Enter text "Most Frequent Mutations" in the "Input field for new set name" search bar
* Select "Save"
* Is text "Set has been saved." present on the page
* Pause "2" seconds

## Edit Set Name
* Select "Edit Set Name" for set "Most Frequent Mutations" on Manage Sets page
* Enter "Edited Name Frequent Mutations" in the text box "Enter Set Name"
* Select button "Accept Set Name Input"

## Validate Item List
* Select item list for set "Edited Name Frequent Mutations" on Manage Sets page
* Verify the table "Set Information" is displaying this information
  |text_in_table_to_check               |
  |-------------------------------------|
  |522ea97b-af8b-5ac1-b60f-1b588ee696e2 |
  |b1fc5c61-6bc0-574f-9eb7-66c24d4c52d3 |
  |8e30604f-3a45-5533-bdd7-0a4353700318 |
  |a34dbc69-77ad-5c45-9c4b-e26ea62bde83 |
  |31df4cc1-3220-53c9-97a0-e926dd3f982b |
  |634532f4-76f3-5f82-b4e3-c76b027a0a18 |
  |78066279-06cf-5b55-bc10-10eeba4ec015 |
  |39da35de-2350-5593-95ca-c995fb661dc1 |
  |8d2dfec2-3a12-511c-90e9-3e29c039b548 |
  |84aef48f-31e6-52e4-8e05-7d5b9ab15087 |
  |edd1ae2c-3ca9-52bd-a124-b09ed304fcc2 |
  |fa9713e8-ce92-5413-aacc-ed3d95ab7906 |
  |b5249474-20f8-5245-8dc0-c548405baaa2 |
  |fa539267-db47-5b9d-8956-6863c0239acb |
  |a9ed209d-4f9f-51da-9d71-631fc61bca49 |
  |92b75ae1-8d4d-52c2-8658-9c981eef0e57 |
  |477e2125-974b-5af0-a876-25596d99ddbf |
  |4fb37566-16d1-5697-9732-27c359828bc7 |
  |53af5705-a17b-555a-92e9-880ce5c14ca0 |
  |6aebcc26-eef3-5a80-88cf-2d24dee29812 |
* Close set panel

## Download Set
* Download "Edited Name Frequent Mutations" from "Manage Sets"
* Read from "Edited Name Frequent Mutations from Manage Sets"
* Verify that "Edited Name Frequent Mutations from Manage Sets" has expected information
  |required_info                        |
  |-------------------------------------|
  |522ea97b-af8b-5ac1-b60f-1b588ee696e2 |
  |b1fc5c61-6bc0-574f-9eb7-66c24d4c52d3 |
  |8e30604f-3a45-5533-bdd7-0a4353700318 |
  |a34dbc69-77ad-5c45-9c4b-e26ea62bde83 |
  |31df4cc1-3220-53c9-97a0-e926dd3f982b |
  |634532f4-76f3-5f82-b4e3-c76b027a0a18 |
  |78066279-06cf-5b55-bc10-10eeba4ec015 |
  |39da35de-2350-5593-95ca-c995fb661dc1 |
  |8d2dfec2-3a12-511c-90e9-3e29c039b548 |
  |84aef48f-31e6-52e4-8e05-7d5b9ab15087 |
  |edd1ae2c-3ca9-52bd-a124-b09ed304fcc2 |
  |fa9713e8-ce92-5413-aacc-ed3d95ab7906 |
  |b5249474-20f8-5245-8dc0-c548405baaa2 |
  |fa539267-db47-5b9d-8956-6863c0239acb |
  |a9ed209d-4f9f-51da-9d71-631fc61bca49 |
  |92b75ae1-8d4d-52c2-8658-9c981eef0e57 |
  |477e2125-974b-5af0-a876-25596d99ddbf |
  |4fb37566-16d1-5697-9732-27c359828bc7 |
  |53af5705-a17b-555a-92e9-880ce5c14ca0 |
  |6aebcc26-eef3-5a80-88cf-2d24dee29812 |

## Delete Set
* Select "Delete Set" for set "Edited Name Frequent Mutations" on Manage Sets page
* Is modal with text "Edited Name Frequent Mutations has been deleted" present on the page and "Keep Modal"
* Undo Action
