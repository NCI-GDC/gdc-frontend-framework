# Cohort Builder - Custom Filter Removal
Date Created    : 11/12/2024
Version			    : 1.0
Owner		        : GDC QA
Description		  : Validate custom filters that have been removed are not present
Test-case       : PEAR-2269

tags: gdc-data-portal-v2, cohort-builder, regression

## Navigate to Cohort Builder
* On GDC Data Portal V2 app
* Navigate to "Cohort" from "Header" "section"

## Validate Removal of Custom Filters
* Navigate to the "Custom Filters" tab on the Cohort Builder page
* Select button "Cohort Builder Add A Custom Filter"
* Is text "Search for a property" present on the page
* Verify these custom filters "are not" present in the properties table
  |removed_property                             |
  |---------------------------------------------|
  |diagnoses.anaplasia_present                  |
  |diagnoses.anaplasia_present_type             |
  |diagnoses.breslow_thickness                  |
  |diagnoses.circumferential_resection_margin   |
  |diagnoses.greatest_tumor_dimension           |
  |diagnoses.gross_tumor_weight                 |
  |diagnoses.largest_extrapelvic_peritoneal_focus|
  |diagnoses.lymph_node_involved_site           |
  |diagnoses.lymph_nodes_positive               |
  |diagnoses.lymph_nodes_tested                 |
  |diagnoses.lymphatic_invasion_present         |
  |diagnoses.non_nodal_regional_disease         |
  |diagnoses.non_nodal_tumor_deposits           |
  |diagnoses.percent_tumor_invasion             |
  |diagnoses.perineural_invasion_present        |
  |diagnoses.peripancreatic_lymph_nodes_positive|
  |diagnoses.peripancreatic_lymph_nodes_tested  |
  |diagnoses.transglottic_extension             |
  |diagnoses.tumor_largest_dimension_diameter   |
  |diagnoses.tumor_stage                        |
  |diagnoses.vascular_invasion_present          |
  |diagnoses.vascular_invasion_type             |
  |exposures.bmi                                |
  |exposures.height                             |
  |exposures.marijuana_use_per_week             |
  |exposures.smokeless_tobacco_quit_age         |
  |exposures.tobacco_use_per_day                |
  |exposures.weight                             |
  |analyte.ribosomal_rna_28s_16s_ratio          |
  |demographic.gender                           |
  |family_history.relationship_gender           |
  |other_clinical_attribute.undescended_testis_corrected_age|
  |pathology_details.epithelioid_cell_percent   |
  |pathology_details.extrascleral_extension     |
  |pathology_details.size_extraocular_nodule    |
  |pathology_details.spindle_cell_percent       |
  |sample.tumor_code_id                         |
  |treatment.therapeutic_level_achieved         |

## Close Modal
* Close the modal
