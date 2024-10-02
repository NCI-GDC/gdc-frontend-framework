# Cohort Builder - Filter by Case, Gene, Mutation Identifier
Date Created    : 08/20/2024
Version	        : 1.0
Owner		        : GDC QA
Description		  : Test Cohort Builder - Filter by Case, Gene, Mutation Identifier
Test-case       : PEAR-792

tags: gdc-data-portal-v2, cohort-builder, filter-card, regression

## Navigate to Cohort Builder
* On GDC Data Portal V2 app
* Navigate to "Cohort" from "Header" "section"

## Case ID - Single Identifier
* Select the following labels from "General" tab on the Cohort Builder page
  |facet_name       |selection            |
  |-----------------|---------------------|
  |Case ID          |Upload Cases         |
* Upload "One Case" "txt" from "Cohort Builder" in "Cohort Builder Import" through "Browse"
* Is text "1 submitted case identifier mapped to 1 unique GDC case" present on the page
* Select "Submit"
* Validate expected custom filters "are" present in facet cards on the "General" tab on the Cohort Builder page
  |facet_name           |custom_filter_text                     |
  |---------------------|---------------------------------------|
  |Case Id              |a757f96a-a173-45e2-a292-62ea007efd9d   |
* Validate the cohort query filter area has these filters
  |facet_name           |selections                             |position in filter area  |
  |---------------------|---------------------------------------|-------------------------|
  |Case Id              |a757f96a-a173-45e2-a292-62ea007efd9d   |1                        |
* Remove these filters from the cohort query area
  |Filter to Remove             |
  |-----------------------------|
  |Case Id                      |
* Validate expected custom filters "are not" present in facet cards on the "General" tab on the Cohort Builder page
  |facet_name           |custom_filter_text                     |
  |---------------------|---------------------------------------|
  |Case Id              |a757f96a-a173-45e2-a292-62ea007efd9d   |

## Case ID - Multiple Identifiers
* Clear active cohort filters
* Select the following labels from "General" tab on the Cohort Builder page
  |facet_name       |selection            |
  |-----------------|---------------------|
  |Case ID          |Upload Cases         |
* Upload "All Case Identifiers" "txt" from "Cohort Builder" in "Cohort Builder Import" through "Browse"
* Is text "12 submitted case identifiers mapped to 12 unique GDC cases" present on the page
* Select "Submit"
* Validate expected custom filters "are" present in facet cards on the "General" tab on the Cohort Builder page
  |facet_name           |custom_filter_text                     |
  |---------------------|---------------------------------------|
  |Case Id              |12 input case ids                      |
* Validate the cohort query filter area has these filters
  |facet_name           |selections                             |position in filter area  |
  |---------------------|---------------------------------------|-------------------------|
  |Case Id              |12 input case ids                      |1                        |
* Remove the following custom filters in facet cards on the "General" tab on the Cohort Builder page
  |facet_name           |custom_filter_text                     |
  |---------------------|---------------------------------------|
  |Case Id              |12 input case ids                      |
* Validate there are no active cohort filters

## Mutated Gene - Single Identifier
* Clear active cohort filters
* Select the following labels from "Molecular Filters" tab on the Cohort Builder page
  |facet_name       |selection            |
  |-----------------|---------------------|
  |Mutated Gene     |Upload Genes         |
* Upload "One Gene" "txt" from "Cohort Builder" in "Cohort Builder Import" through "Browse"
* Is text "1 submitted gene identifier mapped to 1 unique GDC gene" present on the page
* Select "Submit"
* Validate expected custom filters "are" present in facet cards on the "Molecular Filters" tab on the Cohort Builder page
  |facet_name           |custom_filter_text                     |
  |---------------------|---------------------------------------|
  |Mutated Gene         |USH2A                                  |
* Validate the cohort query filter area has these filters
  |facet_name           |selections                             |position in filter area  |
  |---------------------|---------------------------------------|-------------------------|
  |Mutated Gene         |USH2A                                  |1                        |
* Remove these filters from the cohort query area
  |Filter to Remove             |
  |-----------------------------|
  |Mutated Gene                 |
* Validate expected custom filters "are not" present in facet cards on the "Molecular Filters" tab on the Cohort Builder page
  |facet_name           |custom_filter_text                     |
  |---------------------|---------------------------------------|
  |Mutated Gene         |USH2A                                  |

## Mutated Gene - Multiple Identifiers
* Clear active cohort filters
* Select the following labels from "Molecular Filters" tab on the Cohort Builder page
  |facet_name       |selection            |
  |-----------------|---------------------|
  |Mutated Gene     |Upload Genes         |
* Upload "Multiple Genes" "txt" from "Cohort Builder" in "Cohort Builder Import" through "Browse"
* Is text "5 submitted gene identifiers mapped to 5 unique GDC genes" present on the page
* Select "Submit"
* Validate expected custom filters "are" present in facet cards on the "Molecular Filters" tab on the Cohort Builder page
  |facet_name           |custom_filter_text                     |
  |---------------------|---------------------------------------|
  |Mutated Gene         |5 input genes                          |
* Validate the cohort query filter area has these filters
  |facet_name           |selections                             |position in filter area  |
  |---------------------|---------------------------------------|-------------------------|
  |Mutated Gene         |5 input genes                          |1                        |
* Remove the following custom filters in facet cards on the "Molecular Filters" tab on the Cohort Builder page
  |facet_name           |custom_filter_text                     |
  |---------------------|---------------------------------------|
  |Mutated Gene         |5 input genes                          |
* Validate there are no active cohort filters

## Somatic Mutation - Single Identifier
* Clear active cohort filters
* Select the following labels from "Molecular Filters" tab on the Cohort Builder page
  |facet_name       |selection                      |
  |-----------------|-------------------------------|
  |Somatic Mutation |Upload Somatic Mutations       |
* Upload "One Mutation" "txt" from "Cohort Builder" in "Cohort Builder Import" through "Browse"
* Is text "1 submitted mutation identifier mapped to 1 unique GDC mutation" present on the page
* Select "Submit"
* Validate expected custom filters "are" present in facet cards on the "Molecular Filters" tab on the Cohort Builder page
  |facet_name           |custom_filter_text                     |
  |---------------------|---------------------------------------|
  |Somatic Mutation     |99eb3457-6125-5255-8322-88d0b55578ea   |
* Validate the cohort query filter area has these filters
  |facet_name           |selections                             |position in filter area  |
  |---------------------|---------------------------------------|-------------------------|
  |Ssm Id               |99eb3457-6125-5255-8322-88d0b55578ea   |1                        |
* Remove these filters from the cohort query area
  |Filter to Remove             |
  |-----------------------------|
  |Ssm Id                       |
* Validate expected custom filters "are not" present in facet cards on the "Molecular Filters" tab on the Cohort Builder page
  |facet_name           |custom_filter_text                     |
  |---------------------|---------------------------------------|
  |Somatic Mutation     |99eb3457-6125-5255-8322-88d0b55578ea   |

## Somatic Mutation - Multiple Identifiers
* Clear active cohort filters
* Select the following labels from "Molecular Filters" tab on the Cohort Builder page
  |facet_name       |selection                      |
  |-----------------|-------------------------------|
  |Somatic Mutation |Upload Somatic Mutations       |
* Upload "Multiple Mutations" "txt" from "Cohort Builder" in "Cohort Builder Import" through "Browse"
* Is text "5 submitted mutation identifiers mapped to 5 unique GDC mutations" present on the page
* Select "Submit"
* Pause "2" seconds
* Validate expected custom filters "are" present in facet cards on the "Molecular Filters" tab on the Cohort Builder page
  |facet_name           |custom_filter_text                     |
  |---------------------|---------------------------------------|
  |Somatic Mutation     |5 input ssm ids                        |
* Validate the cohort query filter area has these filters
  |facet_name           |selections                             |position in filter area  |
  |---------------------|---------------------------------------|-------------------------|
  |Ssm Id               |5 input ssm ids                        |1                        |
* Remove the following custom filters in facet cards on the "Molecular Filters" tab on the Cohort Builder page
  |facet_name           |custom_filter_text                     |
  |---------------------|---------------------------------------|
  |Ssm Id               |5 input ssm ids                        |
* Validate there are no active cohort filters
