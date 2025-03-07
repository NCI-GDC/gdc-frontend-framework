# Cart - Download Associated Data Options
Date Created    : 10/25/2024
Version			: 1.0
Owner		    : GDC QA
Description		: Download Associated Data Dropdown Options
Test-Case       : PEAR-2246

tags: gdc-data-portal-v2, regression, cart, clinical-biospecimen-download

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
* Select "Clinical"
* Download "TSV" from "Cart Header Dropdown"
* Read file content from compressed "TSV from Cart Header Dropdown"
* Verify that "TSV from Cart Header Dropdown" has expected information
    |required_info                        |
    |-------------------------------------|
    |follow_ups.barretts_esophagus_goblet_cells_present     |
    |follow_ups.dlco_ref_predictive_percent|
    |follow_ups.recist_targeted_regions_sum|
    |molecular_tests.biospecimen_volume   |
    |molecular_tests.test_analyte_type    |
    |SD-Stable Disease                    |
    |Blood                                |
    |Serum Free Immunoglobulin Light Chain, Lambda          |
    |pathology_details.additional_pathology_findings        |
    |pathology_details.percent_tumor_nuclei|
    |pathology_details.vascular_invasion_present            |
    |97886d69-8daa-4a6e-b275-fa3853cf1702 |
    |f35b48fa-eae8-4b66-bb90-0f86a55d3552 |
    |exposures.chemical_exposure_type     |
    |exposures.secondhand_smoke_as_child  |
    |a2a2dbda-d10c-49c4-86a8-61baf6160cda |
    |Current Reformed Smoker for > 15 yrs |
    |family_histories.relationship_primary_diagnosis        |
    |family_histories.relative_smoker     |
    |HCM-BROD-0231-C25                    |
    |Prostate Cancer                      |
    |First Degree Relative, NOS           |
    |demographic.cause_of_death_source    |
    |diagnoses.primary_gleason_grade      |
    |pathology_details.perineural_invasion_present          |
    |treatments.treatment_outcome         |
    |Not Cancer Related                   |
    |Unknown tumor status                 |
    |Metastasis, NOS                      |
    |No Metastasis                        |
    |Endometrioid adenocarcinoma, NOS     |
    |Initial Diagnosis                    |
    |other_clinical_attributes.bmi        |
    |other_clinical_attributes.comorbidity_method_of_diagnosis  |
    |other_clinical_attributes.exercise_frequency_weekly        |
    |other_clinical_attributes.hormonal_contraceptive_type      |
    |other_clinical_attributes.hysterectomy_type                |
    |other_clinical_attributes.other_clinical_attribute_id      |
    |other_clinical_attributes.submitter_id                     |
    |other_clinical_attributes.viral_hepatitis_serology_tests   |
    |other_clinical_attributes.weeks_gestation_at_birth         |
    |3a0f6160-ac66-44d8-a689-2a7226ef4a17 |
    |a48d46ee-ca42-4f83-a458-a4200b11def1 |
    |191a027d-eca3-4626-a54c-1c702fcdd13d |
    |8d7378be-91a1-49f2-b20b-f6d531525dd2 |
    |7347ae42-87a7-4a93-acc6-0553cf06d39a |
    |89d5050c-3e95-4e5e-83c6-c073b9bb53cd |
    |a242040c-f78a-4fa8-8960-8e2f1020f0d5 |
    |HCM-CSHL-0182-C25_other_clinical_attribute|
    |Initial Diagnosis                    |
    |cases.case_id                        |
    |cases.consent_type                   |
    |cases.days_to_consent                |
    |cases.days_to_lost_to_followup       |
    |cases.disease_type                   |
    |cases.index_date                     |
    |cases.lost_to_followup               |
    |cases.primary_site                   |
    |cases.submitter_id                   |
    |Cystic, Mucinous and Serous Neoplasms  |
    |Pancreas                               |
    |Diagnosis                              |

* Verify that "TSV from Cart Header Dropdown" does not contain specified information
    |required_info                          |
    |---------------------------------------|
    |FM-AD                                  |
    |TCGA-LUAD                              |
    |APOLLO                                 |
    |tumor_stage                            |
    |marijuana_use_per_week                 |
    |smokeless_tobacco_quit_age             |
    |tobacco_use_per_day                    |
    |diagnoses.anaplasia_present            |
    |diagnoses.anaplasia_present_type       |
    |diagnoses.breslow_thickness            |
    |diagnoses.circumferential_resection_margin|
    |diagnoses.greatest_tumor_dimension     |
    |diagnoses.gross_tumor_weight           |
    |diagnoses.largest_extrapelvic_peritoneal_focus|
    |diagnoses.lymph_node_involved_site     |
    |diagnoses.lymph_nodes_positive         |
    |diagnoses.lymph_nodes_tested           |
    |diagnoses.lymphatic_invasion_present   |
    |diagnoses.non_nodal_regional_disease   |
    |diagnoses.non_nodal_tumor_deposits     |
    |diagnoses.percent_tumor_invasion       |
    |diagnoses.perineural_invasion_present  |
    |diagnoses.peripancreatic_lymph_nodes_positive|
    |diagnoses.peripancreatic_lymph_nodes_tested|
    |diagnoses.transglottic_extension       |
    |diagnoses.tumor_largest_dimension_diameter|
    |diagnoses.tumor_stage                  |
    |diagnoses.vascular_invasion_present    |
    |diagnoses.vascular_invasion_type       |
    |exposures.bmi                          |
    |exposures.height                       |
    |exposures.marijuana_use_per_week       |
    |exposures.smokeless_tobacco_quit_age   |
    |exposures.tobacco_use_per_day          |
    |exposures.weight                       |

## Clinical JSON
* Select "Clinical"
* Download "JSON" from "Cart Header Dropdown"
* Read from "JSON from Cart Header Dropdown"
* Verify that "JSON from Cart Header Dropdown" has expected information
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
    |2024-07-09T13:45:56.716690-05:00     |
    |bb1eaf24-d667-5608-976c-f745b2da50f5 |
    |HCM-CSHL-0182-C25_other_clinical_attribute |
    |HCM-CSHL-0182-C25_pathology_detail   |
    |other_clinical_attributes	          |
    |timepoint_category	                  |
    |updated_datetime	                  |
    |other_clinical_attribute_id	      |
    |weight                               |
    |bmi                                  |
    |height                               |
    |Initial Diagnosis                    |
    |3a0f6160-ac66-44d8-a689-2a7226ef4a17 |
    |30.4                                 |
    |80ae7467-6489-4c87-af68-5a64c444b3d2 |
    |a48d46ee-ca42-4f83-a458-a4200b11def1 |
    |2024-07-09T13:46:04.511308-05:00     |
    |2024-07-08T14:59:53.534123-05:00     |
    |8d7378be-91a1-49f2-b20b-f6d531525dd2 |
    |MMRF_2579_oca1                       |
    |a242040c-f78a-4fa8-8960-8e2f1020f0d5 |
    |HCM-CSHL-0182-C25_other_clinical_attribute|
    |disease_type                         |
    |index_date                           |
    |primary_site                         |
    |case_id	                          |
    |submitter_id	                      |

* Verify that "JSON from Cart Header Dropdown" does not contain specified information
    |required_info                        |
    |-------------------------------------|
    |FM-AD                                |
    |TCGA-LUAD                            |
    |APOLLO                               |

## Biospecimen TSV
* Select "Biospecimen"
* Download "TSV" from "Cart Header Dropdown"
* Read file content from compressed "TSV from Cart Header Dropdown"
* Verify that "TSV from Cart Header Dropdown" has expected information
    |required_info                        |
    |-------------------------------------|
    |portion_id                           |
    |aliquots.no_matched_normal_targeted_sequencing|
    |aliquots.selected_normal_targeted_sequencing  |
    |aliquots.selected_normal_wxs         |
    |a2a2dbda-d10c-49c4-86a8-61baf6160cda |
    |9873fb3a-2db4-5127-857a-9c4d43fe52f3 |
    |a0c9eb15-1a55-5310-8f10-3709713d1536 |
    |HCM-CSHL-0182-C25-01A-11R-A78N-41    |
    |HCMI-CMDC                            |
    |TCGA-BG-A0M0-01A                     |
    |sample_id                            |
    |analyte_id                           |
    |a260_a280_ratio                      |
    |analytes.experimental_protocol_type  |
    |analytes.rna_integrity_number        |
    |fca75565-3783-4251-8bc8-4917a416e21c |
    |71e5c3c0-8fd8-438b-915c-6e75eaaeaae2 |
    |HCM-BROD-0231-C25-06A-01D            |
    |Repli-G (Qiagen) DNA                 |
    |Repli-G X                            |
    |UV Spec                              |
    |portions.creation_datetime           |
    |portions.portion_number              |
    |8360d471-e5eb-4deb-b63f-eddb88daae24 |
    |8617ab21-718f-4914-9a3b-70e9bfe084cf |
    |HCM-BROD-0231-C25-06A-01             |
    |1305158400                           |
    |samples.biospecimen_anatomic_site    |
    |samples.initial_weight               |
    |samples.oct_embedded                 |
    |samples.preservation_method          |
    |samples.time_between_clamping_and_freezing|
    |samples.tumor_code_id                |
    |5fc14815-00f9-4cb5-b158-a294f0fd48f2 |
    |7A76BDC7-62D9-4A8D-AAEF-CECF9F819D58 |
    |Expanded Next Generation Cancer Model|
    |Peripheral Blood Components NOS      |
    |Tumor                                |
    |Metastatic                           |
    |slide_id                             |
    |slides.submitter_id                  |
    |slides.percent_follicular_component  |
    |slides.percent_necrosis              |
    |slides.percent_tumor_cells           |
    |slides.prostatic_involvement_percent |
    |slides.tissue_microarray_coordinates |
    |2ca2cf14-9a01-408d-be23-73dffb093ead |
    |TCGA-BG-A0M0-01Z-00-DX1              |
    |98.0                                 |
    |BOTTOM                               |
* Verify that "TSV from Cart Header Dropdown" does not contain specified information
    |required_info                        |
    |-------------------------------------|
    |FM-AD                                |
    |TCGA-LUAD                            |
    |APOLLO                               |

## Biospecimen JSON
* Select "Biospecimen"
* Download "JSON" from "Cart Header Dropdown"
* Read from "JSON from Cart Header Dropdown"
* Verify that "JSON from Cart Header Dropdown" has expected information
    |required_info                        |
    |-------------------------------------|
    |1ae8657f-477f-4e1a-aef2-dd1c1ab5f26a |
    |project	                          |
    |project_id                           |
    |HCMI-CMDC                            |
    |submitter_id	                      |
    |MMRF_1540                            |
    |samples	                          |
    |tumor_descriptor	                  |
    |Recurrence                           |
    |specimen_type	                      |
    |Bone Marrow NOS                      |
    |days_to_sample_procurement	          |
    |updated_datetime	                  |
    |2023-11-08T11:51:28.153805-06:00     |
    |sample_id	                          |
    |1b91e02e-9d83-4785-b94d-a13db72a4564 |
    |MMRF_2017_1_BM_CD138pos              |
    |state	                              |
    |preservation_method	              |
    |sample_type	                      |
    |Primary Blood Derived Cancer - Bone Marrow|
    |tissue_type	                      |
    |Normal                               |
    |created_datetime	                  |
    |2018-01-01T11:33:50.360407-06:00     |
    |portion_id	                          |
    |e737adb3-5810-5cd2-9750-3a9e39ee4d16 |
    |slide_id	                          |
    |1f4c3265-eee0-4752-afb4-4446dbd521ee |
    |sample_type_id	                      |
    |is_ffpe	                          |
    |analyte_id	                          |
    |56524bc-4a40-4f58-b157-59490275578b  |
    |aliquot_id	                          |
    |5c7f192d-a02e-4208-ade8-c64fdf87be1a |
    |center_id	                          |
    |61d634b8-e8dd-58bf-9a65-1233dc7c8c6a |
    |concentration                        |
    |analyte_type_id	                  |
    |5341a8a5-acac-5a24-a963-d27dbecc5db2 |
    |3df88b48-da53-4014-9507-de070223d1dd |
    |91e73c21-abd7-4c20-ac1e-81f4dabc7511 |
* Verify that "JSON from Cart Header Dropdown" does not contain specified information
    |required_info                        |
    |-------------------------------------|
    |FM-AD                                |
    |TCGA-LUAD                            |
    |APOLLO                               |

## Sample Sheet
* Download "Sample Sheet" from "Page"
* Read from "Sample Sheet from Page"
* Verify that "Sample Sheet from Page" has expected information
    |required_info                        |
    |-------------------------------------|
    |File ID                              |
    |File Name                            |
    |Data Category                        |
    |Data Type                            |
    |Project ID                           |
    |Case ID                              |
    |Sample ID                            |
    |Tissue Type			              |
    |Tumor Descriptor                     |
    |Specimen Type                        |
    |Preservation Method                  |
    |945aee28-3188-41ad-9999-33c36a566a50 |
    |TCGA-OV.f9ef779b-0228-4ef1-a6c4-824dff5460d2.ascat3.gene_level_copy_number.v36.tsv|
    |Transcriptome Profiling              |
    |Masked Somatic Mutation              |
    |MMRF-COMMPASS                        |
    |MMRF_2579, MMRF_2579                 |
    |MMRF_2167_1_PB_Whole, MMRF_2167_1_BM_CD138pos|
    |c137b9d3-ed18-49bc-879b-73cd90450c6a |
    |d342f285-b9ba-4737-b668-09bfc761e74f |
    |93d6d769-17fe-4bc9-bf94-bc9f92f1c747 |
    |TCGA-BG-A0M0-10A, TCGA-BG-A0M0-01A   |
    |Normal, Tumor                        |
    |Tumor, Normal                        |
    |Primary, Not Applicable              |
    |Metastatic                           |
    |3D Organoid, Buffy Coat              |
    |Solid Tissue, Unknown                |
    |Unknown, OCT                         |
    |Frozen, Frozen                       |

* Verify that "Sample Sheet from Page" does not contain specified information
    |required_info                        |
    |-------------------------------------|
    |FM-AD                                |
    |TCGA-LUAD                            |
    |APOLLO                               |
    |Sample Type                          |

## Metadata
* Download "Metadata" from "Page"
* Read from "Metadata from Page"
* Verify that "Metadata from Page" has expected information
    |required_info                        |
    |-------------------------------------|
    |data_format	                      |
    |access	                              |
    |associated_entities	              |
    |entity_submitter_id	              |
    |entity_type	                      |
    |case_id	                          |
    |entity_id	                          |
    |file_name	                          |
    |submitter_id	                      |
    |data_category	                      |
    |entity_submitter_id	              |
    |submitter_id	                      |
    |annotation_id	                      |
    |category	                          |
    |status	                              |
    |case_submitter_id	                  |
    |downstream_analyses	              |
    |output_files	                      |
    |file_name	                          |
    |file_id                              |
    |data_type	                          |
    |workflow_type	                      |
    |workflow_version	                  |
    |proportion_reads_mapped              |
    |md5sum	                              |
    |contamination                        |
    |experimental_strategy	              |
    |proportion_reads_duplicated          |
    |workflow_link	                      |
    |index_files	                      |
    |TCGA-61-1727-11A-01W-0639-09         |
    |TCGA-OV.f9ef779b-0228-4ef1-a6c4-824dff5460d2.ascat3.gene_level_copy_number.v36.tsv|
    |Copy Number Variation                |
    |1b06f3bd-6129-4805-be76-5e0965e4889f |
    |3dd621a8745ee2b91716911604bf3f096337a9b7|
    |4b7ba483550f3fc70b8f23b280e9b912     |
    |Aliquot Ensemble Somatic Variant Merging and Masking|
    |8ecf1343-3f59-4a18-99e0-c783825b82ae |
    |21640f1a-d199-499b-bb08-5e778cfa830c |
    |79d5f99d-84b7-44c8-aac6-8ffb9d79c8ea |
    |2019-01-28T11:04:05.783741-06:00     |
    |Illumina                             |
    |Masked Somatic Mutation              |
    |WGS                                  |
    |SeSAMe Methylation Beta Estimation   |
    |3431594                              |
    |https://gdc.cancer.gov/about-data/publications/pancanatlas|
    |VCF                                  |
    |f58edce0a21b29b810508a11599ad447     |
    |148.81047                            |
    |0.00013948633598826976               |
    |0.022844                             |
    |8cd9cd506d600cbeb4abbe6470babf6f     |
* Verify that "Metadata from Page" does not contain specified information
    |required_info                        |
    |-------------------------------------|
    |FM-AD                                |
    |TCGA-LUAD                            |
    |APOLLO                               |

## Remove Files from Cart
* Remove "All Files" from cart on the Cart page
* Is text "Your cart is empty." present on the page
