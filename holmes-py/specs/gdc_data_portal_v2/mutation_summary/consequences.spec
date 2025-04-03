# Mutation Summary - Consequences Table
Date Created    : 03/19/2025
Version			: 1.0
Owner		    : GDC QA
Description		: Validate Consequences Table and Downloads
Test-Case       : PEAR-2367

tags: gdc-data-portal-v2, regression, mutation-summary

## Navigate to Mutation Summary Page: chr3:g.179218303G>A
* On GDC Data Portal V2 app
* Quick search for "chr3:g.179218303G>A" and go to its page

## Validate Table: Consequences
* Verify the table "Consequences Mutation Summary" header text is correct
    |expected_text                          |column |
    |---------------------------------------|-------|
    |Gene                                   |1      |
    |AA Change                              |2      |
    |Consequences                           |3      |
    |Coding DNA Change                      |4      |
    |Impact                                 |5      |
    |Gene Strand                            |6      |
    |Transcript                             |7      |
* Verify the table "Consequences Mutation Summary" body text is correct
    |expected_text                          |row  |column |
    |---------------------------------------|-----|-------|
    |PIK3CA                                 |1    |1      |
    |E545K                                  |1    |2      |
    |Missense                               |1    |3      |
    |c.1633G>A                              |1    |4      |
    |MODHPR                                 |1    |5      |
    |ENST00000263967C                       |1    |7      |
* Select value from table "Consequences Mutation Summary" by row and column
    |row   |column|
    |------|------|
    |1     |1     |
* Verify the table "Summary Gene Summary" body text is correct
    |expected_text                          |row  |column |
    |---------------------------------------|-----|-------|
    |chr3:179148114-179240093 (GRCh38)      |5    |2      |

## Navigate back to Mutation Summary Page: chr3:g.179218303G>A
* Quick search for "chr3:g.179218303G>A" and go to its page

## Consequences: JSON
* Download "JSON" from "Mutation Summary Consequences"
* Read from "JSON from Mutation Summary Consequences"
* Verify that "JSON from Mutation Summary Consequences" has expected information
    |required_info                          |
    |---------------------------------------|
    |ENST00000263967                        |
    |E46K                                   |
    |non_coding_transcript_exon_variant     |
    |false                                  |
    |c.*200G>A                              |
    |probably_damaging                      |
    |0.997                                  |
    |0.02                                   |
    |deleterious_low_confidence             |
    |MODERATE                               |
    |ENSG00000121879                        |
    |PIK3CA                                 |
    |1                                      |
    |3_prime_UTR_variant                    |

## Cancer Distribution - Validate JSON File Fields
  |field_name                               |
  |-----------------------------------------|
  |transcript_id                            |
  |aa_change                                |
  |is_canonical                             |
  |consequence_type                         |
  |annotation.hgvsc                         |
  |annotation.polyphen_impact               |
  |annotation.polyphen_score                |
  |annotation.sift_score                    |
  |annotation.sift_impact                   |
  |annotation.vep_impact                    |
  |gene.gene_id                             |
  |gene.symbol                              |
  |gene.gene_strand                         |
* Verify that the "JSON from Mutation Summary Consequences" has <field_name> for each object

## Consequences: TSV
* Download "TSV" from "Mutation Summary Consequences"
* Read from "TSV from Mutation Summary Consequences"
* Verify that "TSV from Mutation Summary Consequences" has expected information
    |required_info                          |
    |---------------------------------------|
    |Gene                                   |
    |AA Change                              |
    |Consequences                           |
    |Coding DNA Change                      |
    |Impact                                 |
    |Gene Strand                            |
    |Transcript                             |
    |PIK3CA                                 |
    |E545K                                  |
    |Non Coding Transcript Exon             |
    |c.*200G>A                              |
    |VEP: MODERATE, SIFT: deleterious_low_confidence - score 0, PolyPhen: probably_damaging - score 0.999|
    |VEP: MODIFIER                          |
    |+                                      |
    |ENST00000263967 (Canonical)            |
    |ENST00000462255                        |
