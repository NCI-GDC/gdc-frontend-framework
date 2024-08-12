# Mutation Frequency - Table TSV Download
Date Created  : 05/08/2024
Version			  : 1.0
Owner		      : GDC QA
Description		: Download Table TSV on Genes and Mutations Tab
Test-Case     : PEAR-909, PEAR-911

tags: gdc-data-portal-v2, mutation-frequency, regression

## Navigate to Mutation Frequency App
* On GDC Data Portal V2 app
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Mutation Frequency" from "Analysis" "app"

## Validate Custom Gene Filters
* Is text "Overall Survival Plot" present on the page
* Select "Genes" in the Mutation Frequency app
* Upload "Gene FAT4" "txt" from "Mutation Frequency" in "Mutation Frequency Custom Filter" through "Browse"
* Pause "5" seconds
* Is text "1 submitted gene identifier mapped to 1 unique GDC gene" present on the page
* Select "Submit"
We are not guaranteed to get a loading spinner here to wait for,
but it usually requires a wait. So I've put 5 seconds.
* Pause "5" seconds
* Wait for table body text to appear
  |expected_text|row  |column |
  |-------------|-----|-------|
  |FAT4         |1    |4      |
* Download "TSV" from "Mutation Frequency"
* Read from "TSV from Mutation Frequency"
* Verify that "TSV from Mutation Frequency" has expected information
  |required_info                      |
  |-----------------------------------|
  |ENSG00000196159                    |
  |FAT4                               |
  |FAT atypical cadherin 4            |
  |4q28.1                             |
  |protein_coding                     |
  |Cancer Gene Census                 |
  |num_cohort_ssm_affected_cases      |
  |num_cohort_ssm_cases               |
  |cohort_ssm_affected_cases_percentage|
  |num_gdc_ssm_affected_cases         |
  |num_gdc_ssm_cases                  |
  |gdc_ssm_affected_cases_percentage  |
  |num_cohort_cnv_cases               |
  |num_cohort_cnv_gain_cases          |
  |cohort_cnv_gain_cases_percentage   |
  |num_cohort_cnv_loss_cases          |
  |cohort_cnv_loss_cases_percentage   |
  |num_mutations                      |
* Verify that "TSV from Mutation Frequency" does not contain specified information
  |required_info                          |
  |---------------------------------------|
  |ENSG00000141510                        |
  |MUC16                                  |
  |CUB and Sushi multiple domains 3       |
  |2q22.1, 2q22.2                         |
  |MUC16                                  |
  |FAT3                                   |
  |MUC16                                  |
* Perform the following actions on a filter card
  |filter_name          |action               |
  |---------------------|---------------------|
  |Mutated Gene         |clear selection      |

## Validate Custom Mutation Filters
* Switch to "Mutations" tab in the Mutation Frequency app
* Wait for table loading spinner
* Select "Somatic Mutations" in the Mutation Frequency app
* Upload "Mutation PIK3CA" "txt" from "Mutation Frequency" in "Mutation Frequency Custom Filter" through "Browse"
* Pause "5" seconds
* Is text "1 submitted mutation identifier mapped to 1 unique GDC mutation" present on the page
* Select "Submit"
* Pause "5" seconds
We are not guaranteed to get a loading spinner here to wait for,
but it usually requires a wait. So I've put 3 seconds.
* Wait for table body text to appear
  |expected_text      |row  |column |
  |-------------------|-----|-------|
  |chr3:g.179234297A>G|1    |4      |
* Download "TSV" from "Mutation Frequency"
* Read from "TSV from Mutation Frequency"
* Verify that "TSV from Mutation Frequency" has expected information
  |required_info                      |
  |-----------------------------------|
  |92b75ae1-8d4d-52c2-8658-9c981eef0e57|
  |chr3:g.179234297A>G                |
  |PIK3CA H1047R                      |
  |Substitution                       |
  |Missense                           |
  |MODERATE                           |
  |tolerated                          |
  |benign                             |
  |num_cohort_ssm_affected_cases      |
  |num_cohort_ssm_cases               |
  |cohort_ssm_affected_cases_percentage|
  |num_gdc_ssm_affected_cases         |
  |num_gdc_ssm_cases                  |
  |gdc_ssm_affected_cases_percentage  |
  |vep_impact                         |
  |sift_impact                        |
  |sift_score                         |
  |polyphen_impact                    |
  |polyphen_score                     |
* Verify that "TSV from Mutation Frequency" does not contain specified information
  |required_info                          |
  |---------------------------------------|
  |chr7:g.140753336A>T                    |
  |KRAS G12D                              |
  |fa9713e8-ce92-5413-aacc-ed3d95ab7906   |
  |Deletion                               |
* Perform the following actions on a filter card
  |filter_name              |action               |
  |-------------------------|---------------------|
  |Somatic Mutations        |clear selection      |
