# Set Operations - Mutation Set
Date Created    : 07/11/2024
Version	        : 1.0
Owner		        : GDC QA
Description		  : Set Operations - Mutation Set Main Page
Test-Case       : PEAR-1230

tags: gdc-data-portal-v2, set-operations, regression

## Navigate to Manage Sets
* On GDC Data Portal V2 app
* Navigate to "Manage Sets" from "Header" "section"

## Create Mutation Sets
* Select Create Set and from the dropdown choose "Mutations"
* Upload "Mutation Main 1" "txt" from "Set Operations" in "Manage Sets Import" through "Browse"
* Name Set "B-Mutation_Set_SO_Main_1" in Set Creation modal

* Select Create Set and from the dropdown choose "Mutations"
* Upload "Mutation Main 2" "txt" from "Set Operations" in "Manage Sets Import" through "Browse"
* Name Set "B-Mutation_Set_SO_Main_2" in Set Creation modal

* Select Create Set and from the dropdown choose "Mutations"
* Upload "Mutation Main 3" "txt" from "Set Operations" in "Manage Sets Import" through "Browse"
* Name Set "B-Mutation_Set_SO_Main_3" in Set Creation modal

## Navigate to Set Operations
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Set Operations" from "Analysis" "app"
* Change number of entries shown in the table to "100"

## Mutations - 2 Sets
* Select the following checkboxes in the Set Operations selection screen
  |checkbox_name                |
  |-----------------------------|
  |B-Mutation_Set_SO_Main_3     |
  |B-Mutation_Set_SO_Main_2     |
* Run analysis on Set Operations
* Download "S1 minus S2" from "Set Operations"
* Read from "S1 minus S2 from Set Operations"
* Verify that "S1 minus S2 from Set Operations" has expected information
  |required_info                        |
  |-------------------------------------|
  |15694d60-96ab-5084-8ec4-c73119ece8c0 |
  |22542e1a-7490-50a0-bce1-d27ed8438eca |
  |288a8e0d-059a-520c-b457-fc8464e68154 |
  |303bd333-75f7-5c86-839f-a25599afdb36 |
  |522ea97b-af8b-5ac1-b60f-1b588ee696e2 |
  |71f9e49d-a4c9-58f2-b6d1-d79390eacdf6 |
  |76c91101-f84c-515c-b894-2277881823bc |
  |8d2dfec2-3a12-511c-90e9-3e29c039b548 |
  |9319a74d-d505-5997-b96e-311313ce0350 |
  |94ae04b4-d8fc-5161-9393-f6acea2f5ef1 |
  |955a5a1e-1e1f-5126-b7a8-dbb787a20b22 |
  |a28ec4a9-d827-5d1d-9f8f-149045be1cc4 |
  |a9ed209d-4f9f-51da-9d71-631fc61bca49 |
  |b98b6b56-7905-5a6c-b25f-3063d3ed3d69 |
  |c10f4f07-be66-54a0-acbc-19f6c37651ab |
  |c2e6b2d1-7034-5c64-930c-47b046f278b4 |
* Verify that "S1 minus S2 from Set Operations" does not contain specified information
  |required_info                        |
  |-------------------------------------|
  |0a77b70b-ffd3-5140-8bd0-e9d16c5774c3 |
  |0b48f075-25a9-5edd-977d-83247204658c |
  |0d797d3c-ca18-59f6-80a0-e5572d70ec3c |
  |39da35de-2350-5593-95ca-c995fb661dc1 |
  |42d468eb-df21-5c5e-942a-260fba8297d7 |
  |53af5705-a17b-555a-92e9-880ce5c14ca0 |
  |7133099f-9251-5da9-816b-6d9536bb19ed |
  |84aef48f-31e6-52e4-8e05-7d5b9ab15087 |
  |89aee9f6-9564-5c6b-bf5b-762620c36719 |
  |df73da47-91d3-59ab-841a-c6a7f1106151 |
  |edd1ae2c-3ca9-52bd-a124-b09ed304fcc2 |
  |fa9713e8-ce92-5413-aacc-ed3d95ab7906 |
* Select set "S1 intersect S2" to save as a new set in the Set Operations analysis screen
* Name set "B-S1 intersect S2 Mutation Set" in Save Set modal
* Verify the table "Summary Set Operations" is displaying this information
    |text_to_validate             |
    |-----------------------------|
    |B-Mutation_Set_SO_Main_3     |
    |B-Mutation_Set_SO_Main_2     |
## Mutations Union Row - 2 Sets
* Select the following checkboxes in the Set Operations analysis screen
  |checkbox_name                |
  |-----------------------------|
  |S1 intersect S2              |
  |S1 minus S2                  |
  |S2 minus S1                  |
* Download "File" from "Set Operations Union Row"
* Read from "File from Set Operations Union Row"
* Verify that "File from Set Operations Union Row" has expected information
  |required_info                        |
  |-------------------------------------|
  |0a77b70b-ffd3-5140-8bd0-e9d16c5774c3 |
  |0b48f075-25a9-5edd-977d-83247204658c |
  |0d797d3c-ca18-59f6-80a0-e5572d70ec3c |
  |1012a5b1-76ce-5628-a8ec-f4e6b1a7b560 |
  |15694d60-96ab-5084-8ec4-c73119ece8c0 |
  |16f8087b-5a28-562e-b5fd-185832553532 |
  |22542e1a-7490-50a0-bce1-d27ed8438eca |
  |288a8e0d-059a-520c-b457-fc8464e68154 |
  |303bd333-75f7-5c86-839f-a25599afdb36 |
  |39da35de-2350-5593-95ca-c995fb661dc1 |
  |42d468eb-df21-5c5e-942a-260fba8297d7 |
  |4fb37566-16d1-5697-9732-27c359828bc7 |
  |51b5553d-b7ff-57d1-9827-2c7adbb8743a |
  |522ea97b-af8b-5ac1-b60f-1b588ee696e2 |
  |53af5705-a17b-555a-92e9-880ce5c14ca0 |
  |7133099f-9251-5da9-816b-6d9536bb19ed |
  |71f9e49d-a4c9-58f2-b6d1-d79390eacdf6 |
  |76c91101-f84c-515c-b894-2277881823bc |
  |84aef48f-31e6-52e4-8e05-7d5b9ab15087 |
  |89aee9f6-9564-5c6b-bf5b-762620c36719 |
  |8d2dfec2-3a12-511c-90e9-3e29c039b548 |
  |92b75ae1-8d4d-52c2-8658-9c981eef0e57 |
  |9319a74d-d505-5997-b96e-311313ce0350 |
  |94ae04b4-d8fc-5161-9393-f6acea2f5ef1 |
  |955a5a1e-1e1f-5126-b7a8-dbb787a20b22 |
  |a28ec4a9-d827-5d1d-9f8f-149045be1cc4 |
  |a34dbc69-77ad-5c45-9c4b-e26ea62bde83 |
  |a9ed209d-4f9f-51da-9d71-631fc61bca49 |
  |ab96fb54-dfc0-58d9-b727-20a857d58dad |
  |b98b6b56-7905-5a6c-b25f-3063d3ed3d69 |
  |c10f4f07-be66-54a0-acbc-19f6c37651ab |
  |c2e6b2d1-7034-5c64-930c-47b046f278b4 |
  |df73da47-91d3-59ab-841a-c6a7f1106151 |
  |edd1ae2c-3ca9-52bd-a124-b09ed304fcc2 |
  |fa9713e8-ce92-5413-aacc-ed3d95ab7906 |
* Select Union Row to save as a new set in the Set Operations analysis screen
* Name set "B-S1 and S2 Union Mutation Set" in Save Set modal

## Validate Set Creation and Counts - 2 Sets
* Collect these save set item counts on the Set Operations analysis screen
  |set_name                 |
  |-------------------------|
  |S1 intersect S2          |
* Collect union row save set item count as "S1 Union S2" on the Set Operations analysis screen
* Navigate to "Manage Sets" from "Header" "section"
* Change number of entries shown in the table to "100"
* Collect these set item counts on Manage Sets page
  |set_name                         |
  |---------------------------------|
  |B-S1 intersect S2 Mutation Set   |
  |B-S1 and S2 Union Mutation Set   |
* Verify "S1 intersect S2 Count Set Operations" and "B-S1 intersect S2 Mutation Set Count Manage Sets" are "Equal"
* Verify "S1 Union S2 Count Set Operations" and "B-S1 and S2 Union Mutation Set Count Manage Sets" are "Equal"

## Navigate Back to Set Operations
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Set Operations" from "Analysis" "app"
* Change number of entries shown in the table to "100"

## Mutations - 3 Sets
* Select the following checkboxes in the Set Operations selection screen
  |checkbox_name            |
  |-------------------------|
  |B-Mutation_Set_SO_Main_1 |
  |B-Mutation_Set_SO_Main_2 |
  |B-Mutation_Set_SO_Main_3 |
* Run analysis on Set Operations
* Download "S1 intersect S3 minus S2" from "Set Operations"
* Read from "S1 intersect S3 minus S2 from Set Operations"
* Verify that "S1 intersect S3 minus S2 from Set Operations" has expected information
  |required_info                        |
  |-------------------------------------|
  |522ea97b-af8b-5ac1-b60f-1b588ee696e2 |
  |8d2dfec2-3a12-511c-90e9-3e29c039b548 |
  |a9ed209d-4f9f-51da-9d71-631fc61bca49 |
* Verify that "S1 intersect S3 minus S2 from Set Operations" does not contain specified information
  |required_info                        |
  |-------------------------------------|
  |0a77b70b-ffd3-5140-8bd0-e9d16c5774c3 |
  |0b48f075-25a9-5edd-977d-83247204658c |
  |0d797d3c-ca18-59f6-80a0-e5572d70ec3c |
  |1012a5b1-76ce-5628-a8ec-f4e6b1a7b560 |
  |15694d60-96ab-5084-8ec4-c73119ece8c0 |
  |16f8087b-5a28-562e-b5fd-185832553532 |
  |22542e1a-7490-50a0-bce1-d27ed8438eca |
  |288a8e0d-059a-520c-b457-fc8464e68154 |
  |303bd333-75f7-5c86-839f-a25599afdb36 |
  |31df4cc1-3220-53c9-97a0-e926dd3f982b |
  |39da35de-2350-5593-95ca-c995fb661dc1 |
  |42d468eb-df21-5c5e-942a-260fba8297d7 |
  |477e2125-974b-5af0-a876-25596d99ddbf |
  |4fb37566-16d1-5697-9732-27c359828bc7 |
  |51b5553d-b7ff-57d1-9827-2c7adbb8743a |
  |53af5705-a17b-555a-92e9-880ce5c14ca0 |
  |634532f4-76f3-5f82-b4e3-c76b027a0a18 |
  |6aebcc26-eef3-5a80-88cf-2d24dee29812 |
  |7133099f-9251-5da9-816b-6d9536bb19ed |
  |71f9e49d-a4c9-58f2-b6d1-d79390eacdf6 |
  |76c91101-f84c-515c-b894-2277881823bc |
  |78066279-06cf-5b55-bc10-10eeba4ec015 |
  |84aef48f-31e6-52e4-8e05-7d5b9ab15087 |
  |89aee9f6-9564-5c6b-bf5b-762620c36719 |
  |8e30604f-3a45-5533-bdd7-0a4353700318 |
  |92b75ae1-8d4d-52c2-8658-9c981eef0e57 |
  |9319a74d-d505-5997-b96e-311313ce0350 |
  |94ae04b4-d8fc-5161-9393-f6acea2f5ef1 |
  |955a5a1e-1e1f-5126-b7a8-dbb787a20b22 |
  |a28ec4a9-d827-5d1d-9f8f-149045be1cc4 |
  |a34dbc69-77ad-5c45-9c4b-e26ea62bde83 |
  |ab96fb54-dfc0-58d9-b727-20a857d58dad |
  |b1fc5c61-6bc0-574f-9eb7-66c24d4c52d3 |
  |b5249474-20f8-5245-8dc0-c548405baaa2 |
  |b98b6b56-7905-5a6c-b25f-3063d3ed3d69 |
  |c10f4f07-be66-54a0-acbc-19f6c37651ab |
  |c2e6b2d1-7034-5c64-930c-47b046f278b4 |
  |df73da47-91d3-59ab-841a-c6a7f1106151 |
  |edd1ae2c-3ca9-52bd-a124-b09ed304fcc2 |
  |fa539267-db47-5b9d-8956-6863c0239acb |
  |fa9713e8-ce92-5413-aacc-ed3d95ab7906 |
* Select set "S1 intersect S2 intersect S3" to save as a new set in the Set Operations analysis screen
* Name set "B-S1 intersect S2 intersect S3 Mutation Set" in Save Set modal
* Verify the table "Summary Set Operations" is displaying this information
    |text_to_validate             |
    |-----------------------------|
    |B-Mutation_Set_SO_Main_1     |
    |B-Mutation_Set_SO_Main_2     |
    |B-Mutation_Set_SO_Main_3     |

## Mutations Union Row - 3 Sets
* Select the following checkboxes in the Set Operations analysis screen
  |checkbox_name                |
  |-----------------------------|
  |S1 intersect S2 intersect S3 |
  |S1 intersect S2 minus S3     |
  |S2 intersect S3 minus S1     |
  |S1 intersect S3 minus S2     |
  |S1 minus S2 union S3         |
  |S2 minus S1 union S3         |
  |S3 minus S1 union S2         |
* Download "File" from "Set Operations Union Row"
* Read from "File from Set Operations Union Row"
* Verify that "File from Set Operations Union Row" has expected information
  |required_info                        |
  |-------------------------------------|
  |0a77b70b-ffd3-5140-8bd0-e9d16c5774c3 |
  |0b48f075-25a9-5edd-977d-83247204658c |
  |0d797d3c-ca18-59f6-80a0-e5572d70ec3c |
  |1012a5b1-76ce-5628-a8ec-f4e6b1a7b560 |
  |15694d60-96ab-5084-8ec4-c73119ece8c0 |
  |16f8087b-5a28-562e-b5fd-185832553532 |
  |22542e1a-7490-50a0-bce1-d27ed8438eca |
  |288a8e0d-059a-520c-b457-fc8464e68154 |
  |303bd333-75f7-5c86-839f-a25599afdb36 |
  |31df4cc1-3220-53c9-97a0-e926dd3f982b |
  |39da35de-2350-5593-95ca-c995fb661dc1 |
  |42d468eb-df21-5c5e-942a-260fba8297d7 |
  |477e2125-974b-5af0-a876-25596d99ddbf |
  |4fb37566-16d1-5697-9732-27c359828bc7 |
  |51b5553d-b7ff-57d1-9827-2c7adbb8743a |
  |522ea97b-af8b-5ac1-b60f-1b588ee696e2 |
  |53af5705-a17b-555a-92e9-880ce5c14ca0 |
  |634532f4-76f3-5f82-b4e3-c76b027a0a18 |
  |6aebcc26-eef3-5a80-88cf-2d24dee29812 |
  |7133099f-9251-5da9-816b-6d9536bb19ed |
  |71f9e49d-a4c9-58f2-b6d1-d79390eacdf6 |
  |76c91101-f84c-515c-b894-2277881823bc |
  |78066279-06cf-5b55-bc10-10eeba4ec015 |
  |84aef48f-31e6-52e4-8e05-7d5b9ab15087 |
  |89aee9f6-9564-5c6b-bf5b-762620c36719 |
  |8d2dfec2-3a12-511c-90e9-3e29c039b548 |
  |8e30604f-3a45-5533-bdd7-0a4353700318 |
  |92b75ae1-8d4d-52c2-8658-9c981eef0e57 |
  |9319a74d-d505-5997-b96e-311313ce0350 |
  |94ae04b4-d8fc-5161-9393-f6acea2f5ef1 |
  |955a5a1e-1e1f-5126-b7a8-dbb787a20b22 |
  |a28ec4a9-d827-5d1d-9f8f-149045be1cc4 |
  |a34dbc69-77ad-5c45-9c4b-e26ea62bde83 |
  |a9ed209d-4f9f-51da-9d71-631fc61bca49 |
  |ab96fb54-dfc0-58d9-b727-20a857d58dad |
  |b1fc5c61-6bc0-574f-9eb7-66c24d4c52d3 |
  |b5249474-20f8-5245-8dc0-c548405baaa2 |
  |b98b6b56-7905-5a6c-b25f-3063d3ed3d69 |
  |c10f4f07-be66-54a0-acbc-19f6c37651ab |
  |c2e6b2d1-7034-5c64-930c-47b046f278b4 |
  |df73da47-91d3-59ab-841a-c6a7f1106151 |
  |edd1ae2c-3ca9-52bd-a124-b09ed304fcc2 |
  |fa539267-db47-5b9d-8956-6863c0239acb |
  |fa9713e8-ce92-5413-aacc-ed3d95ab7906 |
* Select Union Row to save as a new set in the Set Operations analysis screen
* Name set "B-S1 S2 S3 Union Mutation Set" in Save Set modal

## Validate Set Creation and Counts - 3 Sets
* Collect these save set item counts on the Set Operations analysis screen
  |set_name                     |
  |-----------------------------|
  |S1 intersect S2 intersect S3 |
* Collect union row save set item count as "S1 Union S2 Union S3 Mutation Set" on the Set Operations analysis screen
* Navigate to "Manage Sets" from "Header" "section"
* Change number of entries shown in the table to "100"
* Collect these set item counts on Manage Sets page
  |set_name                                     |
  |---------------------------------------------|
  |B-S1 intersect S2 intersect S3 Mutation Set  |
  |B-S1 S2 S3 Union Mutation Set                |
* Verify "S1 intersect S2 intersect S3 Count Set Operations" and "B-S1 intersect S2 intersect S3 Mutation Set Count Manage Sets" are "Equal"
* Verify "S1 Union S2 Union S3 Mutation Set Count Set Operations" and "B-S1 S2 S3 Union Mutation Set Count Manage Sets" are "Equal"
