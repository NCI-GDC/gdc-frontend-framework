# Set Operations - Cohort
Date Created    : 07/11/2024
Version	        : 1.0
Owner		    : GDC QA
Description		: Set Operations - Cohort Main Page
Test-Case       : PEAR-1230

tags: gdc-data-portal-v2, set-operations, regression

## Navigate to Cohort Builder
* On GDC Data Portal V2 app
* Navigate to "Cohort" from "Header" "section"

## Create Cohorts for Comparison
* Create and save a cohort named "B-Cohort_Set_SO_Main_1" with these filters
  |tab_name               |facet_name           |selection                      |
  |-----------------------|---------------------|-------------------------------|
  |Demographic            |Ethnicity            |unknown                        |
* Create and save a cohort named "B-Cohort_Set_SO_Main_2" with these filters
  |tab_name               |facet_name           |selection                      |
  |-----------------------|---------------------|-------------------------------|
  |General                |Disease Type         |myeloid leukemias              |
* Create and save a cohort named "B-Cohort_Set_SO_Main_3" with these filters
  |tab_name               |facet_name           |selection                      |
  |-----------------------|---------------------|-------------------------------|
  |General                |Program              |BEATAML1.0                     |

## Navigate to Set Operations
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Set Operations" from "Analysis" "app"
* Change number of entries shown in the table to "100"

## Cohorts - 2 Sets
* Select the following checkboxes in the Set Operations selection screen
  |checkbox_name                |
  |-----------------------------|
  |B-Cohort_Set_SO_Main_3       |
  |B-Cohort_Set_SO_Main_1       |
* Run analysis on Set Operations
* Download "S2 minus S1" from "Set Operations"
* Read from "S2 minus S1 from Set Operations"
* Verify that "S2 minus S1 from Set Operations" has expected information
  |required_info                        |
  |-------------------------------------|
  |001ab32d-f924-4753-ad67-4366fb845ae6 |
  |17872859-4139-57d0-99ea-574709cfd8cf |
  |56508c22-dfb7-4d25-af83-f92864d2e3dd |
  |72e49f08-667a-540f-b58a-400b5940a7cd |
  |a780e596-6b32-48eb-80da-aa472c2997a1 |
  |ef6574d5-dcf0-55f1-9f9f-15a42bea285f |
  |fefe1be8-5741-48a5-825e-746e49c4ae43 |
* Verify that "S2 minus S1 from Set Operations" does not contain specified information
  |required_info                        |
  |-------------------------------------|
  |002c5901-b202-4465-86b6-7def589c8936 |
  |3c83cef9-7b47-4206-b9d9-346b2efd5215 |
  |72feb404-6af0-49cc-b391-a0e9dec7e5e0 |
  |a656655a-627d-4ce3-903d-2be931f82413 |
  |da6fb046-f40f-4416-878e-cd778e647bed |
  |fe680216-74b5-4568-b546-79baa87de538 |
  |ffcd3cb7-b476-4220-accf-96d2291dc2b1 |
* Select set "S1 minus S2" to save as a new set in the Set Operations analysis screen
* Name the cohort "S1 minus S2 Set Operations" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                            |Keep or Remove Modal|
  |-----------------|-----------------------------------------------------|--------------------|
  |Save             |S1 minus S2 Set Operations has been saved            |Remove Modal        |

## Cohorts Union Row - 2 Sets
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
  |00115367-8271-47b9-a987-fa1c59a7bd65 |
  |401ab0ef-3162-44b6-9f33-55b3bae082e6 |
  |65b8c7d7-5622-4fbf-b8bd-ab7a0de010f7 |
  |7d1edfd4-b5c8-5a36-8952-78b9b1b48a5d |
  |aa85a1b4-ed29-4ec0-a1d5-70b554e114eb |
  |dfd887a5-ae22-4a7c-a01f-62e20e2e5f1b |
  |f94fd89f-a593-5b44-9af9-f929c9d62488 |
  |fff5223f-86c5-5966-a055-bbd8234bf6fe |
* Select Union Row to save as a new set in the Set Operations analysis screen
* Name the cohort "S1 Union S2 Cohort Set Operations" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                            |Keep or Remove Modal|
  |-----------------|-----------------------------------------------------|--------------------|
  |Save             |S1 Union S2 Cohort Set Operations has been saved     |Remove Modal        |

## Validate Cohort Creation and Counts - 2 Sets
* Collect these save set item counts on the Set Operations analysis screen
  |set_name                 |
  |-------------------------|
  |S1 minus S2              |
* Collect union row save set item count as "S1 Union S2" on the Set Operations analysis screen
* Navigate to "Cohort" from "Header" "section"
* Switch cohort to "S1 minus S2 Set Operations" from the Cohort Bar dropdown list
* Collect Cohort Bar Case Count for comparison
* Verify "S1 minus S2 Count Set Operations" and "Cohort Bar Case Count" are "Equal"
* Switch cohort to "S1 Union S2 Cohort Set Operations" from the Cohort Bar dropdown list
* Collect Cohort Bar Case Count for comparison
* Verify "S1 Union S2 Count Set Operations" and "Cohort Bar Case Count" are "Equal"

## Navigate Back to Set Operations
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Set Operations" from "Analysis" "app"
* Change number of entries shown in the table to "100"

## Cohorts - 3 Sets
* Select the following checkboxes in the Set Operations selection screen
  |checkbox_name            |
  |-------------------------|
  |B-Cohort_Set_SO_Main_2   |
  |B-Cohort_Set_SO_Main_3   |
  |B-Cohort_Set_SO_Main_1   |
* Run analysis on Set Operations
* Download "S3 minus S1 union S2" from "Set Operations"
* Read from "S3 minus S1 union S2 from Set Operations"
* Verify that "S3 minus S1 union S2 from Set Operations" has expected information
  |required_info                        |
  |-------------------------------------|
  |001ab32d-f924-4753-ad67-4366fb845ae6 |
  |294e522e-5f28-52ed-8a3a-bd701e6f2550 |
  |4a47a989-5650-5366-9c83-4fa7e1deaa83 |
  |799c9373-815b-4031-a495-47858e06908e |
  |bf916e33-7be7-4e33-a654-7424709cca70 |
  |e2346f57-311a-4d9c-a7c9-891223e5ce2a |
  |fb3cac25-28e3-4677-868a-0e4ba6703dee |
  |fff5223f-86c5-5966-a055-bbd8234bf6fe |
* Verify that "S3 minus S1 union S2 from Set Operations" does not contain specified information
  |required_info                        |
  |-------------------------------------|
  |00115367-8271-47b9-a987-fa1c59a7bd65 |
  |30a2fa7e-9dd7-45aa-8dc2-f370be1ca099 |
  |4f654ad0-1753-4895-a3af-a5d88a5a42eb |
  |76de7b7d-64f9-4001-8582-5e72bf00405b |
  |9948d88d-e4b2-410c-a87a-772ccc82f693 |
  |c567332d-db4d-5eb8-a128-96f321dc3571 |
  |d0d1b94e-add4-4c24-a540-0d22afe74d97 |
  |edaf4f27-47b4-4696-af0a-566cd3a73fae |
  |f661fe31-02df-4793-9313-4b6e67096b71 |
  |fff35c80-88cd-4923-80c1-0273ba5bed0f |
  |ffe3332f-44ef-5879-b9aa-c14325042aea |
  |00a29522-5eb0-4dbe-ae63-875aba3bf1b1 |
* Pause "3" seconds
* Select set "S2 intersect S3 minus S1" to save as a new set in the Set Operations analysis screen
* Name the cohort "S2 intersect S3 minus S1 Set Operations" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                              |Keep or Remove Modal|
  |-----------------|-------------------------------------------------------|--------------------|
  |Save             |S2 intersect S3 minus S1 Set Operations has been saved |Remove Modal        |

## Cohorts Union Row - 3 Sets
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
  |00115367-8271-47b9-a987-fa1c59a7bd65 |
  |0175f673-c1d7-4d3c-b799-32c4110a351c |
  |2660b19b-084d-59f8-b1b9-8323a46198ca |
  |373c5464-97c4-5dd5-8b77-363ad5c55af5 |
  |5460dcd4-34c0-48ee-991e-00d041c7b997 |
  |67698eb2-1340-48b4-b9bf-266a918ad107 |
  |7470c50d-7648-4a31-83ef-b1f79b768b25 |
  |973d2330-1651-4bf2-9738-400003df44fa |
  |a91b5f8f-fd7b-48cf-9e9b-406c00b03dcb |
  |b522a7b0-dae3-58b0-b411-61713ac195a3 |
  |c51a2ea3-b754-4141-913b-a422cf4d53b1 |
  |cf3a7262-5a83-4ff4-a196-be98c35df10e |
  |d6e55034-0e67-414b-876b-1b467e18e94f |
  |e0ff9354-4391-52bf-9ca5-4dc4e2c436cb |
  |edb3ff85-2d9f-4dbc-9fa9-98fd0928f3ef |
  |f8aebf38-9f02-4227-973c-1cd5d3cedb9c |
  |fe0fa666-d6eb-5188-b539-cd0f0f3df39c |
  |ffdc90ed-f126-5002-8a9c-32d51445d1e4 |
* Select Union Row to save as a new set in the Set Operations analysis screen
* Name the cohort "S1 Union S2 Union S3 Cohort Set Operations" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                                  |Keep or Remove Modal|
  |-----------------|-----------------------------------------------------------|--------------------|
  |Save             |S1 Union S2 Union S3 Cohort Set Operations has been saved  |Remove Modal        |


## Validate Cohort Creation and Counts - 3 Sets
* Collect these save set item counts on the Set Operations analysis screen
  |set_name                 |
  |-------------------------|
  |S2 intersect S3 minus S1 |
* Collect union row save set item count as "S1 Union S2 Union S3" on the Set Operations analysis screen
* Navigate to "Cohort" from "Header" "section"
* Switch cohort to "S2 intersect S3 minus S1 Set Operations" from the Cohort Bar dropdown list
* Collect Cohort Bar Case Count for comparison
* Verify "S2 intersect S3 minus S1 Count Set Operations" and "Cohort Bar Case Count" are "Equal"
* Switch cohort to "S1 Union S2 Union S3 Cohort Set Operations" from the Cohort Bar dropdown list
* Collect Cohort Bar Case Count for comparison
* Verify "S1 Union S2 Union S3 Count Set Operations" and "Cohort Bar Case Count" are "Equal"
