# Cart - Download Cart Options
Date Created    : 10/25/2024
Version			    : 1.0
Owner		        : GDC QA
Description		  : Manifest and Download Cart
Test-Case       : PEAR-2246
tags: gdc-data-portal-v2, regression, cart

## Add Files to Cart
* On GDC Data Portal V2 app
* Navigate to "Downloads" from "Header" "section"
* Add the following files to the cart on the Repository page
  |file_uuid_to_add                     |
  |-------------------------------------|
  |99ba6902-c95a-4955-af15-879363eda256 |
  |73591a66-ccf0-4966-9151-31bfd37ae61b |
  |5c748ddf-3177-4678-9756-855afa21c464 |
  |504cb87e-acfd-43c0-996e-1c6818c66583 |
  |c6336cc2-9113-4bc4-a5ca-e79722129969 |
  |c2f86efc-bed1-42d5-ad75-be28ba1db1d1 |
  |4fc1257e-57fd-4aa6-8373-febf3177de9f |
  |945aee28-3188-41ad-9999-33c36a566a50 |
  |d342f285-b9ba-4737-b668-09bfc761e74f |
  |93d6d769-17fe-4bc9-bf94-bc9f92f1c747 |
  |b2f0aa77-5fe2-4029-a236-4ad374dd75a2 |
  |c137b9d3-ed18-49bc-879b-73cd90450c6a |

## Clinical TSV
* Navigate to "Cart" from "Header" "section"
* Select "Download Associated Data" on the Cart page
* Download "Clinical: TSV" from "Cart Header Dropdown"
* Read file content from compressed "Clinical: TSV from Cart Header Dropdown"
* Verify that "Clinical: TSV from Cart Header Dropdown" has expected information
    |required_info                        |
    |-------------------------------------|
    |barretts_esophagus_goblet_cells_present|
    |dlco_ref_predictive_percent          |
    |recist_targeted_regions_sum          |
    |biospecimen_volume                   |
    |test_analyte_type                    |
    |SD-Stable Disease                    |
    |Blood                                |
    |Serum Free Immunoglobulin Light Chain, Lambda |
    |additional_pathology_findings        |
    |lymphatic_invasion_present           |
    |percent_tumor_nuclei                 |
    |vascular_invasion_present            |
    |97886d69-8daa-4a6e-b275-fa3853cf1702 |
    |f35b48fa-eae8-4b66-bb90-0f86a55d3552 |
    |chemical_exposure_type               |
    |secondhand_smoke_as_child            |
    |marijuana_use_per_week               |
    |a2a2dbda-d10c-49c4-86a8-61baf6160cda |
    |Current Reformed Smoker for > 15 yrs |
    |relationship_primary_diagnosis       |
    |relative_smoker                      |
    |HCM-BROD-0231-C25                    |
    |Prostate Cancer                      |
    |First Degree Relative, NOS           |
    |cause_of_death_source                |
    |primary_gleason_grade                |
    |perineural_invasion_present          |
    |treatment_outcome                    |
    |Not Cancer Related                   |
    |Unknown tumor status                 |
    |Metastasis, NOS                      |
    |No Metastasis                        |
    |Endometrioid adenocarcinoma, NOS     |
    |Initial Diagnosis                    |
* Verify that "Clinical: TSV from Cart Header Dropdown" does not contain specified information
    |required_info                        |
    |-------------------------------------|
    |FM-AD                                |
    |TCGA-LUAD                            |
    |APOLLO                               |


## Clinical JSON
* Select "Download Associated Data" on the Cart page
* Download "Clinical: JSON" from "Cart Header Dropdown"
* Read from "Clinical: JSON from Cart Header Dropdown"
* Verify that "Clinical: JSON from Cart Header Dropdown" has expected information
    |required_info                        |
    |-------------------------------------|
    |Current Reformed Smoker, Duration Not Specified |
    |50a91ecd-458d-4097-a665-1f07ba21f95e |
    |7c18d276-ed3b-41b1-a16c-23d649296b5b |
    |2018-07-24T11:04:40.771533-05:00     |
    |04386a4d-acb4-442a-a924-40953b82c45f |
    |MMRF_1629_followup13                 |
    |MMRF_2579                            |
    |MMRF-COMMPASS                        |
    |MMRF_2017_diagnosis1                 |
    |9732/3                               |
    |00e85e58-ff40-4987-8489-c541f9de9d73 |
    |Bortezomib                           |
    |253415bb-94cc-5a4a-8235-d20cb0ee900e |
    |not hispanic or latino               |
    |TCGA-61-1727_demographic             |
    |Stage IC                             |
    |ca7cd085-c216-51aa-b48b-5ade175dccfa |
    |2019-07-31T16:35:47.082996-05:00     |
    |bb1eaf24-d667-5608-976c-f745b2da50f5 |
    |HCM-CSHL-0182-C25_other_clinical_attribute |
    |HCM-CSHL-0182-C25_pathology_detail   |
* Verify that "Clinical: JSON from Cart Header Dropdown" does not contain specified information
    |required_info                        |
    |-------------------------------------|
    |FM-AD                                |
    |TCGA-LUAD                            |
    |APOLLO                               |

## Remove Files from Cart
* Remove "All Files" from cart on the Cart page
* Is text "Your cart is empty." present on the page
