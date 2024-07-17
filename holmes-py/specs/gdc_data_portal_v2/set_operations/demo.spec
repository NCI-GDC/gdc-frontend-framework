# Set Operations - Demo Mode
Date Created    : 07/11/2024
Version	        : 1.0
Owner		    : GDC QA
Description	    : Set Operations - Demo Mode
Test-Case       : PEAR-1229

tags: gdc-data-portal-v2, set-operations, regression

## Navigate to Set Operations
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Set Operations Demo" from "Analysis" "app"

## Demo Text Check
* Is text "Demo showing high impact mutations overlap in Bladder between Mutect, Varscan and Muse pipelines." present on the page

## Validate TSV Downloads
* Download "S1 intersect S2 minus S3" from "Set Operations"
* Read from "S1 intersect S2 minus S3 from Set Operations"
* Verify that "S1 intersect S2 minus S3 from Set Operations" has expected information
  |required_info                        |
  |-------------------------------------|
  |00209a21-ae17-5b81-9f5f-7f2a19e42de4 |
  |50ed6c08-4981-5e87-855d-bbd9a33ac255 |
  |8aaca0f3-873a-57b8-ba2d-d4ee95202ad3 |
  |ac77f1f4-ed0b-59bd-8817-e7fd8b0c9153 |
  |cf8ec9b7-1e34-5ca5-b51f-f9954d45d806 |
  |f7390e1b-f3b9-5c47-88d6-8cf8080775eb |
  |fff93173-8575-5fc8-a42c-8c712f9e96ed |
  |28fae961-4589-5662-8fa5-37cc42a1850a |
* Verify that "S1 intersect S2 minus S3 from Set Operations" does not contain specified information
  |required_info                        |
  |-------------------------------------|
  |000040f2-388b-50d5-93c5-abf09a352148 |
  |2f2bee8b-3cf7-540d-8750-f5cb2efc685d |
  |524606ef-ad33-5092-8463-b1565023a1ce |
  |6f269441-369f-536c-a801-8d7137a77fad |
  |97123c18-6972-50bf-98c3-2be9ab8e127e |
  |bb712efa-de59-5cb8-8059-d9cf92a6da24 |
  |e6548a6a-6aea-5c58-aa56-579ee73fc990 |
  |ffec3be8-a6c7-5d99-ad06-c0b9b9fee688 |

* Download "S1 minus S2 union S3" from "Set Operations"
* Read from "S1 minus S2 union S3 from Set Operations"
* Verify that "S1 minus S2 union S3 from Set Operations" has expected information
  |required_info                        |
  |-------------------------------------|
  |0410c77e-dd45-5003-b8bf-51a9b2e5373e |
  |1fcc71f5-f8cd-5f26-ab4e-07a69c3b26f3 |
  |617dab9b-0998-50a6-b63b-da6640af6615 |
  |992bf3de-6450-549d-afb7-69d55c432a92 |
  |ced257f0-a04b-5994-9520-0beeea8d1ab4 |
  |fc0ca9e7-0e8d-5424-8e77-3e824a060b1b |
* Verify that "S1 minus S2 union S3 from Set Operations" does not contain specified information
  |required_info                        |
  |-------------------------------------|
  |000040f2-388b-50d5-93c5-abf09a352148 |
  |34dca682-3ef3-5bea-bfa3-3f593a323ca3 |
  |59eb22cd-c8fa-5589-9f21-377753dd0b15 |
  |9493d0cc-ece6-5b05-89e4-98939e6fc7b8 |
  |ce04987c-b0da-5d05-9467-116adbf178b1 |
  |ebb376ce-e22b-5506-9e94-05bc7d5871c9 |
  |f5e8c2b3-5abf-542c-ba08-312ebccbf240 |
  |fff93173-8575-5fc8-a42c-8c712f9e96ed |

## Set Creation
* Select set "S2 minus S1 union S3" to save as a new set in the Set Operations analysis screen
* Name set "Demo-S2 minus S1 union S3 Mutation Set" in Save Set modal

* Select set "S1 intersect S2 minus S3" to save as a new set in the Set Operations analysis screen
* Name set "Demo-S1 intersect S2 minus S3 Mutation Set" in Save Set modal

## Union Row - 3 Sets
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
  |000040f2-388b-50d5-93c5-abf09a352148 |
  |1860929f-3e21-57fb-9690-51c294c5ad10 |
  |44a885ae-d881-515c-8101-5850d9ac297a |
  |60ed978e-8c50-58c1-8a91-f290d221b6fb |
  |8aa8442f-70d5-5277-9cda-15c027b924a6 |
  |9f7f89c4-587e-51b0-8446-100ae8535df3 |
  |c3890d9f-b85d-5927-bf40-84d61b56490e |
  |e0e9dbaa-5678-5b11-a101-571658b17aef |
  |f588bc61-555e-5c1a-b5d1-d080391c6929 |
  |ffec3be8-a6c7-5d99-ad06-c0b9b9fee688 |
* Select Union Row to save as a new set in the Set Operations analysis screen
* Name set "Demo-S1 S2 S3 Union Mutation Set" in Save Set modal

## Validate Set Creation and Counts - 3 Sets
* Collect these save set item counts on the Set Operations analysis screen
  |set_name                     |
  |-----------------------------|
  |S2 minus S1 union S3         |
  |S1 intersect S2 minus S3     |
* Collect union row save set item count as "Demo-S1 Union S2 Union S3 Mutation Set" on the Set Operations analysis screen
* Navigate to "Manage Sets" from "Header" "section"
* Change number of entries shown in the table to "100"
* Collect these set item counts on Manage Sets page
  |set_name                                         |
  |-------------------------------------------------|
  |Demo-S2 minus S1 union S3 Mutation Set           |
  |Demo-S1 intersect S2 minus S3 Mutation Set       |
  |Demo-S1 S2 S3 Union Mutation Set                 |
* Verify "S2 minus S1 union S3 Count Set Operations" and "Demo-S2 minus S1 union S3 Mutation Set Count Manage Sets" are "Equal"
* Verify "S1 intersect S2 minus S3 Count Set Operations" and "Demo-S1 intersect S2 minus S3 Mutation Set Count Manage Sets" are "Equal"
* Verify "Demo-S1 Union S2 Union S3 Mutation Set Count Set Operations" and "Demo-S1 S2 S3 Union Mutation Set Count Manage Sets" are "Equal"
