# Cohort Comparison - Download TSV
Date Created    : 04/10/2024
Version			    : 1.0
Owner		        : GDC QA
Description		  : Cohort Comparison - Download TSV
Test-case       : PEAR-816

tags: gdc-data-portal-v2, regression, cohort-comparison, cohort-comparison-download-tsv

## Navigate to Cohort Builder
* On GDC Data Portal V2 app
* Navigate to "Cohort" from "Header" "section"

## Create Cohorts for Comparison
* Create and save a cohort named "CC_Program_1" with these filters
  |tab_name               |facet_name           |selection                      |
  |-----------------------|---------------------|-------------------------------|
  |General                |Program              |FM                             |
  |General                |Program              |TCGA                           |
  |General                |Program              |TARGET                         |

* Create and save a cohort named "CC_Gender_1" with these filters
  |tab_name               |facet_name           |selection                      |
  |-----------------------|---------------------|-------------------------------|
  |Demographic            |Gender               |female                         |
  |Demographic            |Gender               |male                           |
  |Demographic            |Gender               |not reported                   |
  |Demographic            |Gender               |unknown                        |
  |Demographic            |Gender               |unspecified                    |

## Travel to cohort comparison selection screen
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Cohort Comparison" from "Analysis" "app"
* Change number of entries shown in the table to "100"
* Is text "Select a cohort to compare with CC_Gender_1" present on the page

## Select cohort to compare with and run
* Select cohort "CC_Program_1" for comparison on the cohort comparison selection screen
* Run analysis on Cohort Comparison

## Verify Analysis Cards Visibility
* Select analysis cards to enable or disable on Cohort Comparison
  |analysis_card          |
  |-----------------------|
  |Ethnicity              |
  |Race                   |
* Verify analysis cards are visible or not visible as expected on Cohort Comparison
  |analysis_card          |should_be_visible_or_not_visible |
  |-----------------------|---------------------------------|
  |analysis-survival      |Visible                          |
  |Ethnicity              |Visible                          |
  |Gender                 |Visible                          |
  |Race                   |Visible                          |
  |Vital Status           |Visible                          |
  |Age At Diagnosis       |Visible                          |

## Validate TSV Download Information - Gender Card
* Collect case counts on save cohort buttons from an analysis card on Cohort Comparison
  |analysis_card          |Filter Row                       |Cohort Number  |Collect Case Count Name              |
  |-----------------------|---------------------------------|---------------|-------------------------------------|
  |Gender                 |female                           |1              |CC_Gender_Female_1 Count             |
  |Gender                 |male                             |1              |CC_Gender_Male_1 Count               |
  |Gender                 |not reported                     |1              |CC_Gender_Not_Reported_1 Count       |
  |Gender                 |unknown                          |1              |CC_Gender_Unknown_1 Count            |
  |Gender                 |unspecified                      |1              |CC_Gender_Unspecified_1 Count        |
  |Gender                 |female                           |2              |CC_Gender_Female_2 Count             |
  |Gender                 |male                             |2              |CC_Gender_Male_2 Count               |
  |Gender                 |not reported                     |2              |CC_Gender_Not_Reported_2 Count       |
  |Gender                 |unknown                          |2              |CC_Gender_Unknown_2 Count            |
  |Gender                 |unspecified                      |2              |CC_Gender_Unspecified_2 Count        |
* Download "Gender" from "Cohort Comparison"
* Read from "Gender from Cohort Comparison"
* Verify that "Gender from Cohort Comparison" has expected information
  |required_info                          |
  |---------------------------------------|
  |Gender                                 |
  |male                                   |
  |not reported                           |
  |unknown                                |
  |unspecified                            |
  |missing                                |
  |# Cases S1                             |
  |% Cases S1                             |
  |# Cases S2                             |
  |% Cases S2                             |
* Verify that "Gender from Cohort Comparison" has expected information from collected data
  |collected_data                         |
  |---------------------------------------|
  |CC_Gender_Female_1 Count               |
  |CC_Gender_Male_1 Count                 |
  |CC_Gender_Not_Reported_1 Count         |
  |CC_Gender_Unknown_1 Count              |
  |CC_Gender_Unspecified_1 Count          |
  |CC_Gender_Female_2 Count               |
  |CC_Gender_Male_2 Count                 |
  |CC_Gender_Not_Reported_2 Count         |
  |CC_Gender_Unknown_2 Count              |
  |CC_Gender_Unspecified_2 Count          |

## Validate TSV Download Information - Age At Diagnosis Card
* Collect case counts on save cohort buttons from an analysis card on Cohort Comparison
  |analysis_card          |Filter Row                       |Cohort Number  |Collect Case Count Name              |
  |-----------------------|---------------------------------|---------------|-------------------------------------|
  |Age At Diagnosis       |0 to <10 years                   |1              |CC_Age_0_to_10_1 Count               |
  |Age At Diagnosis       |10 to <20 years                  |1              |CC_Age_10_to_20_1 Count              |
  |Age At Diagnosis       |20 to <30 years                  |1              |CC_Age_20_to_30_1 Count              |
  |Age At Diagnosis       |30 to <40 years                  |1              |CC_Age_30_to_40_1 Count              |
  |Age At Diagnosis       |40 to <50 years                  |1              |CC_Age_40_to_50_1 Count              |
  |Age At Diagnosis       |50 to <60 years                  |1              |CC_Age_50_to_60_1 Count              |
  |Age At Diagnosis       |60 to <70 years                  |1              |CC_Age_60_to_70_1 Count              |
  |Age At Diagnosis       |70 to <80 years                  |1              |CC_Age_70_to_80_1 Count              |
  |Age At Diagnosis       |80+ years                        |1              |CC_Age_80+_1 Count                   |
  |Age At Diagnosis       |missing                          |1              |CC_Age_missing_1 Count               |
  |Age At Diagnosis       |0 to <10 years                   |2              |CC_Age_0_to_10_2 Count               |
  |Age At Diagnosis       |10 to <20 years                  |2              |CC_Age_10_to_20_2 Count              |
  |Age At Diagnosis       |20 to <30 years                  |2              |CC_Age_20_to_30_2 Count              |
  |Age At Diagnosis       |30 to <40 years                  |2              |CC_Age_30_to_40_2 Count              |
  |Age At Diagnosis       |40 to <50 years                  |2              |CC_Age_40_to_50_2 Count              |
  |Age At Diagnosis       |50 to <60 years                  |2              |CC_Age_50_to_60_2 Count              |
  |Age At Diagnosis       |60 to <70 years                  |2              |CC_Age_60_to_70_2 Count              |
  |Age At Diagnosis       |70 to <80 years                  |2              |CC_Age_70_to_80_2 Count              |
  |Age At Diagnosis       |80+ years                        |2              |CC_Age_80+_2 Count                   |
  |Age At Diagnosis       |missing                          |2              |CC_Age_missing_2 Count               |
* Download "Age At Diagnosis" from "Cohort Comparison"
* Read from "Age At Diagnosis from Cohort Comparison"
* Verify that "Age At Diagnosis from Cohort Comparison" has expected information
  |required_info                          |
  |---------------------------------------|
  |Age At Diagnosis                       |
  |0 to <10 years                         |
  |10 to <20 years                        |
  |20 to <30 years                        |
  |30 to <40 years                        |
  |40 to <50 years                        |
  |50 to <60 years                        |
  |60 to <70 years                        |
  |70 to <80 years                        |
  |80+ years                              |
  |missing                                |
  |# Cases S1                             |
  |% Cases S1                             |
  |# Cases S2                             |
  |% Cases S2                             |
* Verify that "Age At Diagnosis from Cohort Comparison" has expected information from collected data
  |collected_data                         |
  |---------------------------------------|
  |CC_Age_0_to_10_1 Count                 |
  |CC_Age_10_to_20_1 Count                |
  |CC_Age_20_to_30_1 Count                |
  |CC_Age_30_to_40_1 Count                |
  |CC_Age_40_to_50_1 Count                |
  |CC_Age_50_to_60_1 Count                |
  |CC_Age_60_to_70_1 Count                |
  |CC_Age_70_to_80_1 Count                |
  |CC_Age_80+_1 Count                     |
  |CC_Age_missing_1 Count                 |
  |CC_Age_0_to_10_2 Count                 |
  |CC_Age_10_to_20_2 Count                |
  |CC_Age_20_to_30_2 Count                |
  |CC_Age_30_to_40_2 Count                |
  |CC_Age_40_to_50_2 Count                |
  |CC_Age_50_to_60_2 Count                |
  |CC_Age_60_to_70_2 Count                |
  |CC_Age_70_to_80_2 Count                |
  |CC_Age_80+_2 Count                     |
  |CC_Age_missing_2 Count                 |
