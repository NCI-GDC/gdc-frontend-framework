# Repository Page - ACL Access
Date Created    : 02/20/2025
Version			    : 1.0
Owner		        : GDC QA
Description		  :
Test-Case       :

tags: gdc-data-portal-v2, repository, regression

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

## Verify Raw Intensities
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

## Verify No Match Data Types
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

* Navigate to "Downloads" from "Header" "section"

* Make the following selections on a filter card
  |facet_name           |selection                            |
  |---------------------|-------------------------------------|
  |Data Type            |Biospecimen Supplement               |
* Collect case counts for the following filters for cohort "No_MATCH"
  |facet_name           |selection                            |
  |---------------------|-------------------------------------|
  |Data Type            |Biospecimen Supplement               |
  |Access               |open                                 |
* Verify "Data Type_Biospecimen Supplement_No_MATCH Count" and "Access_open_No_MATCH Count" are "Equal"

* Make the following selections on a filter card
  |facet_name           |selection                            |
  |---------------------|-------------------------------------|
  |Data Type            |Biospecimen Supplement               |
  |Data Type            |Clinical Supplement                  |
* Collect case counts for the following filters for cohort "No_MATCH"
  |facet_name           |selection                            |
  |---------------------|-------------------------------------|
  |Data Type            |Clinical Supplement                  |
  |Access               |open                                 |
* Verify "Data Type_Clinical Supplement_No_MATCH Count" and "Access_open_No_MATCH Count" are "Equal"

* Make the following selections on a filter card
  |facet_name           |selection                            |
  |---------------------|-------------------------------------|
  |Data Type            |Clinical Supplement                  |
  |Data Type            |Gene Expression Quantification       |
* Collect case counts for the following filters for cohort "No_MATCH"
  |facet_name           |selection                            |
  |---------------------|-------------------------------------|
  |Data Type            |Gene Expression Quantification       |
  |Access               |open                                 |
* Verify "Data Type_Gene Expression Quantification_No_MATCH Count" and "Access_open_No_MATCH Count" are "Equal"
