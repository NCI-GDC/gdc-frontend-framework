# Gene Summary - Summary and External Reference Tables
Date Created    : 12/13/2024
Version			: 1.0
Owner		    : GDC QA
Description		: Validate Summary Table and External Reference Table
Test-Case       : PEAR-2286

tags: gdc-data-portal-v2, regression, gene-summary

## Navigate to Gene Summary Page: PTEN
* On GDC Data Portal V2 app
* Quick search for "PTEN" and go to its page

## Validate Table: Summary
* Verify the table "Summary Gene Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |Symbol                                 |
    |Name                                   |
    |Synonyms                               |
    |Type                                   |
    |Location                               |
    |Strand                                 |
    |Description                            |
    |Annotation                             |
    |This gene was identified as a tumor suppressor that is mutated in a large number of cancers at high frequency. The protein encoded by this gene is a phosphatidylinositol-3,4,5-trisphosphate 3-phosphatase. It contains a tensin like domain as well as a…more|

* Verify the table "Summary Gene Summary" body text is correct
    |expected_text                          |row  |column |
    |---------------------------------------|-----|-------|
    |PTEN                                   |1    |2      |
    |phosphatase and tensin homolog         |2    |2      |
    |BZSMHAMMMAC1PTEN1TEP1                  |3    |2      |
    |protein_coding                         |4    |2      |
    |chr10:87863625-87971930 (GRCh38)       |5    |2      |
    |Cancer Gene Census                     |8    |2      |

## Validate Table: External References
* Verify the table "External References Gene Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |NCBI Gene                              |
    |UniProtKB Swiss-Prot                   |
    |HGNC                                   |
    |OMIM                                   |
    |Ensembl                                |
    |CIViC                                  |
* Verify the table "External References Gene Summary" body text is correct
    |expected_text                          |row  |column |
    |---------------------------------------|-----|-------|
    |5728                                   |1    |2      |
    |P60484                                 |2    |2      |
    |HGNC:9588                              |3    |2      |
    |601728                                 |4    |2      |
    |ENSG00000171862                        |5    |2      |
    |41                                     |6    |2      |
* In table "External References Gene Summary" these selections should take the user to correct page in a new tab
    |row  |column |expected_text                                                        |
    |-----|-------|---------------------------------------------------------------------|
    |2    |2      |This isoform has been chosen as the canonical sequence.              |
    |3    |2      |phosphatase and tensin homolog                                       |
    |6    |2      |TEN is a multi-functional tumor suppressor that is very commonly     |
