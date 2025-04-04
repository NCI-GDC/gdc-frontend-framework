# Repository Page - Access Control Level
Date Created    : 02/20/2025
Version			    : 1.0
Owner		        : GDC QA
Description		  : Verify Filters Expected Access Level
Test-Case       : PEAR-2347

tags: gdc-data-portal-v2, repository, data-release, acl-validation

## Navigate to Repository Page
* On GDC Data Portal V2 app
* Navigate to "Downloads" from "Header" "section"

## Verify Access Level
* Verify filters have correct access level
  |facet_name           |selection                          |access_level |
  |---------------------|-----------------------------------|-------------|
  |Data Type            |Aggregated Somatic Mutation        |controlled   |
  |Data Type            |Aligned Reads                      |controlled   |
  |Data Type            |Annotated Somatic Mutation         |controlled   |
  |Data Type            |Raw CGI Variant                    |controlled   |
  |Data Type            |Raw Simple Somatic Mutation        |controlled   |
  |Data Type            |Simple Germline Variation          |controlled   |
  |Data Type            |Splice Junction Quantification     |controlled   |
  |Data Type            |Structural Rearrangement           |controlled   |
  |Data Type            |Transcript Fusion                  |controlled   |
  |Data Type            |Allele-specific Copy Number Segment|open         |
  |Data Type            |Copy Number Segment                |open         |
  |Data Type            |Differential Gene Expression       |open         |
  |Data Type            |Gene Level Copy Number             |open         |
  |Data Type            |Isoform Expression Quantification  |open         |
  |Data Type            |Masked Copy Number Segment         |open         |
  |Data Type            |Masked Intensities                 |open         |
  |Data Type            |Methylation Beta Value             |open         |
  |Data Type            |miRNA Expression Quantification    |open         |
  |Data Type            |Pathology Report                   |open         |
  |Data Type            |Protein Expression Quantification  |open         |
  |Data Type            |Single Cell Analysis               |open         |
  |Data Type            |Slide Image                        |open         |
  |Data Type            |Tissue Microarray Image            |open         |

## Raw Intensities
* Perform the following actions on a filter card
  |filter_name      |action               |
  |-----------------|---------------------|
  |Data Type        |clear selection      |

* Make the following selections on a filter card
  |facet_name           |selection                            |
  |---------------------|-------------------------------------|
  |Data Type            |Raw Intensities                      |
  |Experimental Strategy|Expression Array                     |
* Collect case counts for the following filters for cohort "ALC_Validation"
  |facet_name           |selection                            |
  |---------------------|-------------------------------------|
  |Experimental Strategy|Expression Array                     |
  |Access               |open                                 |
* Verify "Experimental Strategy_Expression Array_ALC_Validation Count" and "Access_open_ALC_Validation Count" are "Equal"

* Make the following selections on a filter card
  |facet_name           |selection                            |
  |---------------------|-------------------------------------|
  |Experimental Strategy|Expression Array                     |
  |Experimental Strategy|Genotyping Array                     |
* Collect case counts for the following filters for cohort "ALC_Validation"
  |facet_name           |selection                            |
  |---------------------|-------------------------------------|
  |Experimental Strategy|Genotyping Array                     |
  |Access               |controlled                                 |
* Verify "Experimental Strategy_Genotyping Array_ALC_Validation Count" and "Access_controlled_ALC_Validation Count" are "Equal"

## Create No MATCH Cohort
* Navigate to "Cohort" from "Header" "section"
* Create and save a cohort named "No_MATCH" with these filters
  |tab_name               |facet_name           |selection                      |
  |-----------------------|---------------------|-------------------------------|
  |General                |Program              |APOLLO                         |
  |General                |Program              |BEATAML1.0                     |
  |General                |Program              |CDDP_EAGLE                     |
  |General                |Program              |CGCI                           |
  |General                |Program              |CMI                            |
  |General                |Program              |CPTAC                          |
  |General                |Program              |CTSP                           |
  |General                |Program              |EXCEPTIONAL_RESPONDERS         |
  |General                |Program              |FM                             |
  |General                |Program              |HCMI                           |
  |General                |Program              |MMRF                           |
  |General                |Program              |MP2PRT                         |
  |General                |Program              |NCICCR                         |
  |General                |Program              |OHSU                           |
  |General                |Program              |ORGANOID                       |
  |General                |Program              |REBC                           |
  |General                |Program              |TARGET                         |
  |General                |Program              |TCGA                           |
  |General                |Program              |TRIO                           |
  |General                |Program              |VAREPOP                        |
  |General                |Program              |WCDT                           |

## No MATCH Cohort - Biospecimen Supplement, Clinical Supplement, Gene Expression Quantification
* Navigate to "Downloads" from "Header" "section"
* Verify filters have correct access level
  |facet_name           |selection                          |access_level |
  |---------------------|-----------------------------------|-------------|
  |Data Type            |Biospecimen Supplement             |open         |
  |Data Type            |Clinical Supplement                |open         |
  |Data Type            |Gene Expression Quantification     |open         |

## No MATCH Cohort - Masked Somatic Mutation (Tumor-Only)
* Perform the following actions on a filter card
  |filter_name      |action               |
  |-----------------|---------------------|
  |Data Type        |clear selection      |
* Make the following selections on a filter card
  |facet_name           |selection                            |
  |---------------------|-------------------------------------|
  |Data Type            |Masked Somatic Mutation              |
  |Workflow Type        |Tumor-Only Somatic Variant Merging and Masking|
* Collect case counts for the following filters for cohort "No_MATCH"
  |facet_name           |selection                            |
  |---------------------|-------------------------------------|
  |Workflow Type        |Tumor-Only Somatic Variant Merging and Masking|
  |Access               |controlled                           |
* Verify "Workflow Type_Tumor-Only Somatic Variant Merging and Masking_No_MATCH Count" and "Access_controlled_No_MATCH Count" are "Equal"

## Only MATCH Cohort
* Navigate to "Cohort" from "Header" "section"
* Create and save a cohort named "Only_MATCH" with these filters
  |tab_name               |facet_name           |selection                      |
  |-----------------------|---------------------|-------------------------------|
  |General                |Program              |MATCH                          |
* Collect case counts for the following filters on the Cohort Builder page for cohort "Only_MATCH"
  |tab_name               |facet_name           |selection                      |
  |-----------------------|---------------------|-------------------------------|
  |Available Data         |Access               |controlled                     |
* Collect Cohort Bar Case Count for comparison
* Verify "Cohort Bar Case Count" and "Access_controlled_Only_MATCH Count" are "Equal"
