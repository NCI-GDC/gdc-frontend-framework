# Cohort Case View - Summary View Header
Date Created    : 10/01/2024
Version			    : 1.0
Owner		        : GDC QA
Description		  : Summary View Header
Test-Case       : PEAR-2207

tags: gdc-data-portal-v2, regression, cohort-bar, case-view

## Navigate to Summary View
* On GDC Data Portal V2 app
* Navigate to "Analysis" from "Header" "section"
* Expand or collapse the cohort bar
* Go to tab "Summary View" in Cohort Case View

## Biospecimen - TSV
* Make the following selections on a filter card in Cohort Summary View
  |facet_name           |selection            |
  |---------------------|---------------------|
  |Project              |TCGA-KIRP            |
* Download "TSV" from "Cohort Summary View Biospecimen"
* Read file content from compressed "TSV from Cohort Summary View Biospecimen"
* Verify that "TSV from Cohort Summary View Biospecimen" has expected information
    |required_info                        |
    |-------------------------------------|
    |portion_submitter_id                 |
    |aliquot_volume                       |
    |no_matched_normal_wgs                |
    |source_center                        |
    |a007b49b-297c-48c7-9f0a-12bdb470df4b |
    |TCGA-IZ-8195-01A-31                  |
    |f040bf1b-7514-42e5-aec5-a51376c6571f |
    |c0d8ee00-9547-474d-bcc1-1d658abd36ec |
    |TCGA-UZ-A9PZ-01A-11D-A42J-10         |
    |analyte_type                         |
    |experimental_protocol_type           |
    |spectrophotometer_method             |
    |a2f4f06b-7e8e-4a0d-992e-df5060789137 |
    |TCGA-B9-4117-01A-02W                 |
    |aDNA Preparation Type                |
    |Repli-G X (Qiagen) DNA               |
    |percent_eosinophil_infiltration      |
    |percent_normal_cells                 |
    |prostatic_involvement_percent        |
    |4779d72f-9a3a-4237-8867-70a993f0ab77 |
    |TCGA-BQ-5883-11A-01-TS1              |
    |BOTTOM                               |
    |creation_datetime                    |
    |is_ffpe                              |
    |edd45612-8d50-446c-8817-04634c6723bb |
    |TCGA-KV-A74V-11A-11                  |
    |1399420800                           |
    |freezing_method                      |
    |pathology_report_uuid                |
    |shortest_dimension                   |
    |tumor_descriptor                     |
    |A2194453-658D-441C-AEE5-3C05DAADC243 |
    |Blood Derived Normal                 |
    |Peripheral Blood NOS                 |
* Verify that "TSV from Cohort Summary View Biospecimen" does not contain specified information
    |required_info                        |
    |-------------------------------------|
    |FM-AD                                |
    |TARGET-AML                           |
    |MATCH                                |

## Biospecimen - JSON
* Download "JSON" from "Cohort Summary View Biospecimen"
* Read from "JSON from Cohort Summary View Biospecimen"
* Verify that "JSON from Cohort Summary View Biospecimen" has expected information
    |required_info                        |
    |-------------------------------------|
    |34a19ed5-31a7-4ea4-91be-9fac72320e99 |
    |TCGA-G7-6797                         |
    |61f43bb2-3021-4921-ac92-45513ddba625 |
    |2f80cf91-1c69-521f-9019-3ce1b86ecaff |
    |9f4fedd8-e578-42c0-9abc-4f412c97ed15 |
    |3be6c60b-214d-4a46-bcee-c1ca346faaae |
    |61d634b8-e8dd-58bf-9a65-1233dc7c8c6a |
    |TCGA-G7-6797-10A-01W-2000-08         |
    |2018-09-05T19:47:24.014003-05:00     |
    |Pre-extracted DNA received by TSS    |
* Verify that "JSON from Cohort Summary View Biospecimen" does not contain specified information
    |required_info                        |
    |-------------------------------------|
    |FM-AD                                |
    |TARGET-AML                           |
    |MATCH                                |

## Biospecimen - Validate JSON Fields
  |field_name                               |
  |-----------------------------------------|
  |case_id	                                |
  |project.project_id                       |
  |submitter_id                             |
  |samples.sample_type_id	                  |
  |samples.tumor_descriptor                 |
  |samples.sample_id                        |
  |samples.sample_type                      |
  |samples.specimen_type                    |
  |samples.updated_datetime                 |
  |samples.state                            |
  |samples.is_ffpe                          |
  |samples.preservation_method              |
  |samples.tissue_type                      |
  |samples.portions.slides.updated_datetime |
  |samples.portions.slides.submitter_id     |
  |samples.portions.slides.section_location |
  |samples.portions.slides.state            |
  |samples.portions.slides.slide_id         |
  |samples.portions.analytes.analyte_id     |
  |samples.portions.analytes.experimental_protocol_type|
  |samples.portions.analytes.aliquots.aliquot_quantity |
  |samples.portions.analytes.aliquots.aliquot_id       |
  |samples.portions.analytes.aliquots.source_center    |
  |samples.portions.analytes.aliquots.updated_datetime |
  |samples.portions.analytes.aliquots.center.code      |
  |samples.portions.portion_id             |
* Verify that the "JSON from Cohort Summary View Biospecimen" has <field_name> for each object

## Clinical - TSV
* Navigate to "Cohort" from "Header" "section"
* Clear active cohort filters
* Make the following selections on a filter card in Cohort Summary View
  |facet_name           |selection            |
  |---------------------|---------------------|
  |Project              |MMRF-COMMPASS        |
  |Gender               |female               |
* Make the following selections from "Disease Specific Classifications" tab on the Cohort Builder page
  |facet_name       |selection            |
  |-----------------|---------------------|
  |Iss Stage        |iii                  |
* Download "TSV" from "Cohort Summary View Clinical"
* Read file content from compressed "TSV from Cohort Summary View Clinical"
* Verify that "TSV from Cohort Summary View Clinical" has expected information
    |required_info                        |
    |-------------------------------------|
    |case_submitter_id                    |
    |evidence_of_recurrence_type          |
    |immunosuppressive_treatment_type     |
    |progression_or_recurrence_type       |
    |gene_symbol                          |
    |molecular_test_submitter_id          |
    |test_result                          |
    |9e3ee1c3-3376-489e-97f6-c5d13ab3a2de |
    |fded9873-4c4b-45f5-8381-1cfe2cff4cbf |
    |Serum Free Immunoglobulin Light Chain, Lambda|
    |cfbebd45-031c-4712-9b0e-1a2c1cde7562 |
    |MMRF_1889_molecular_test95           |
    |Test Value Reported                  |
    |14.994                               |
    |additional_pathology_findings        |
    |lymph_node_involvement               |
    |pathology_detail_submitter_id        |
    |tumor_basal_diameter                 |
    |zone_of_origin_prostate              |
    |age_at_last_exposure                 |
    |parent_with_radiation_exposure       |
    |years_smoked                         |
    |tobacco_use_per_day                  |
    |relationship_age_at_diagnosis        |
    |relationship_primary_diagnosis       |
    |relative_with_cancer_history         |
    |MMRF-COMMPASS                        |
    |Paternal Grandmother                 |
    |yes                                  |
    |Breast Cancer                        |
    |Multiple Myeloma                     |
    |occupation_duration_years            |
    |burkitt_lymphoma_clinical_variant    |
    |goblet_cells_columnar_mucosa_present |
    |uicc_staging_system_edition          |
    |non_nodal_tumor_deposits             |
    |therapeutic_agents                   |
    |treatment_type                       |
    |Stem Cell Transplantation, Autologous|
    |-19237                               |
    |Unknown tumor status                 |
    |Multiple myeloma                     |
    |Bone marrow                          |
    |Second line of therapy               |
    |Dexamethasone                        |
    |Stem Cell Transplantation, Autologous|
* Verify that "TSV from Cohort Summary View Clinical" does not contain specified information
    |required_info                        |
    |-------------------------------------|
    |TCGA                                 |
    |FM-AD                                |
    |TARGET-AML                           |
    |MATCH                                |

## Clinical - JSON
* Download "JSON" from "Cohort Summary View Clinical"
* Read from "JSON from Cohort Summary View Clinical"
* Verify that "JSON from Cohort Summary View Clinical" has expected information
    |required_info                        |
    |-------------------------------------|
    |c1756392-79eb-4df7-8788-3589c04af721 |
    |1e65559f-9949-4c8b-bd90-50e75a237a90 |
    |2c75210e-293a-4147-8f13-ecdc0dea5d26 |
    |2018-07-24T15:23:59.467688-05:00     |
    |06ec81b8-c665-40d4-acf8-7cc0f1158414 |
    |MMRF_2246_followup5                  |
    |MMRF_2246                            |
    |9490ff91-584e-4d8f-910c-4aa8205c1102 |
    |5ebc4229-bcb8-4515-9993-67a9f07424f3 |
    |MMRF_2246_treatment2                 |
    |95f61328-b1c3-4fe1-919f-971adf3823b0 |
    |not hispanic or latino               |
    |MMRF_2246_demographic1               |
* Verify that "JSON from Cohort Summary View Clinical" does not contain specified information
    |required_info                        |
    |-------------------------------------|
    |FM-AD                                |
    |TARGET-AML                           |
    |MATCH                                |

## Clinical - Validate JSON Fields
  |field_name                                       |
  |-------------------------------------------------|
  |case_id	                                        |
  |follow_ups.follow_up_id                          |
  |follow_ups.created_datetime	                    |
  |follow_ups.molecular_tests.test_result           |
  |follow_ups.molecular_tests.biospecimen_type      |
  |project.project_id                               |
  |submitter_id	                                    |
  |diagnoses.iss_stage                              |
  |diagnoses.site_of_resection_or_biopsy            |
  |demographic.demographic_id                       |
  |demographic.vital_status                         |
  |demographic.created_datetime	                    |
* Verify that the "JSON from Cohort Summary View Clinical" has <field_name> for each object

## Flip Filters
* Perform the following actions on a filter card in Cohort Summary View
  |filter_name          |action               |
  |---------------------|---------------------|
  |Project              |Chart view           |
  |Gender               |Chart view           |

## Collapse Cohort Case View
* Expand or collapse the cohort bar
